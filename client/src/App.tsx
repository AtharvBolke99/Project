import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

// Main Platform Pages
import { Home } from './pages/Home';
import { DsaArena } from './pages/DsaArena';
import { DsaProblem } from './pages/DsaProblem';
import { VisualLab } from './pages/VisualLab';
import { AptitudeArena } from './pages/AptitudeArena';
import { AptitudeTopicQuestions } from './pages/AptitudeTopicQuestions';
import { AptitudeQuestion } from './pages/AptitudeQuestion';
import { AptitudeTest } from './pages/AptitudeTest';
import { LearningPaths } from './pages/LearningPaths';
import { Store } from './pages/Store';
import { ProductDetail } from './pages/ProductDetail';
import { Projects } from './pages/Projects';
import { Leaderboard } from './pages/Leaderboard';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { RefundPolicy } from './pages/RefundPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { ShippingPolicy } from './pages/ShippingPolicy';
import { Dashboard } from './pages/Dashboard';
import { MyPurchases } from './pages/MyPurchases';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentFailed } from './pages/PaymentFailed';

// Admin CMS Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProblems } from './pages/admin/AdminProblems';
import { AdminAptitude } from './pages/admin/AdminAptitude';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminUsers } from './pages/admin/AdminUsers';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({
  children,
  requireAdmin = false
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');

  const handleOpenAuth = (mode: 'login' | 'register' | 'forgot' | 'reset' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <Navbar onOpenAuth={handleOpenAuth} />
      <Routes>
        <Route path="/" element={<Home onOpenAuth={() => handleOpenAuth('register')} />} />
        <Route path="/dsa" element={<DsaArena />} />
        <Route path="/dsa/:slug" element={<DsaProblem />} />
        <Route path="/visual-lab" element={<VisualLab />} />
        <Route path="/aptitude" element={<AptitudeArena />} />
        <Route path="/aptitude/topic/:topicSlug" element={<AptitudeTopicQuestions />} />
        <Route path="/aptitude/test" element={<AptitudeTest />} />
        <Route path="/aptitude/:topicSlug/:slug" element={<AptitudeQuestion />} />
        <Route path="/learning-paths" element={<LearningPaths />} />
        <Route path="/roadmaps" element={<LearningPaths />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/:slug" element={<ProductDetail onOpenAuth={handleOpenAuth} />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProductDetail onOpenAuth={handleOpenAuth} />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        
        {/* Razorpay Merchant Compliance Legal Routes */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/cancellation-refund-policy" element={<RefundPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/delivery-policy" element={<ShippingPolicy />} />

        {/* Student Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-purchases"
          element={
            <ProtectedRoute>
              <MyPurchases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <DsaArena />
            </ProtectedRoute>
          }
        />

        {/* Payment Verification Routes */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />

        {/* Admin Protected CMS Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/problems"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminProblems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/aptitude"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminAptitude />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
      <MobileNav onOpenAuth={() => handleOpenAuth('login')} />

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
