import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

// Dedicated Digital Store Pages
import { Home } from './pages/Home';
import { Store } from './pages/Store';
import { ProductDetail } from './pages/ProductDetail';
import { MyPurchases } from './pages/MyPurchases';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentFailed } from './pages/PaymentFailed';
import { NotFound } from './pages/NotFound';

// Razorpay Compliance & Information Pages
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { RefundPolicy } from './pages/RefundPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { ShippingPolicy } from './pages/ShippingPolicy';

// Admin Store Management
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({
  children,
  requireAdmin = false
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        Loading session...
      </div>
    );
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
  const navigate = useNavigate();

  // Handle SPA redirects from 404.html (e.g. Render / GitHub Pages / static servers)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectRoute = params.get('route');
    if (redirectRoute) {
      navigate(redirectRoute, { replace: true });
    }
  }, [navigate]);

  const handleOpenAuth = (mode: 'login' | 'register' | 'forgot' | 'reset' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <Navbar onOpenAuth={handleOpenAuth} />
      <Routes>
        {/* Core Digital Store & Educational Platform Routes */}
        <Route path="/" element={<Home onOpenAuth={() => handleOpenAuth('login')} />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/:slug" element={<ProductDetail onOpenAuth={handleOpenAuth} />} />
        
        {/* Route Aliases for seamless discovery */}
        <Route path="/notes" element={<Store />} />
        <Route path="/notes/:slug" element={<ProductDetail onOpenAuth={handleOpenAuth} />} />
        <Route path="/projects" element={<Store />} />
        <Route path="/projects/:slug" element={<ProductDetail onOpenAuth={handleOpenAuth} />} />
        <Route path="/dsa" element={<Store />} />
        <Route path="/aptitude" element={<Store />} />
        <Route path="/resources" element={<Store />} />
        <Route path="/resources/:slug" element={<ProductDetail onOpenAuth={handleOpenAuth} />} />

        {/* Customer Purchases & Download Vault */}
        <Route
          path="/my-purchases"
          element={
            <ProtectedRoute>
              <MyPurchases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchases"
          element={
            <ProtectedRoute>
              <MyPurchases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/downloads"
          element={
            <ProtectedRoute>
              <MyPurchases />
            </ProtectedRoute>
          }
        />

        {/* Payment Verification Routes */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />

        {/* Razorpay Merchant Compliance Legal Routes */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/cancellation-refund-policy" element={<RefundPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/shipping" element={<ShippingPolicy />} />
        <Route path="/delivery-policy" element={<ShippingPolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/support" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/faqs" element={<FAQ />} />
        <Route path="/help" element={<FAQ />} />

        {/* Admin Store CMS */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
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

        {/* Fallback to custom 404 page */}
        <Route path="*" element={<NotFound />} />
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
