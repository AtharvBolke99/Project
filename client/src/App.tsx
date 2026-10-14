import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

// Dedicated Digital Store Pages
import { Store } from './pages/Store';
import { ProductDetail } from './pages/ProductDetail';
import { MyPurchases } from './pages/MyPurchases';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentFailed } from './pages/PaymentFailed';

// Razorpay Compliance & Information Pages
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { RefundPolicy } from './pages/RefundPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { ShippingPolicy } from './pages/ShippingPolicy';

// Admin Store Management
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

  const handleOpenAuth = (mode: 'login' | 'register' | 'forgot' | 'reset' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <Navbar onOpenAuth={handleOpenAuth} />
      <Routes>
        {/* Core Digital Store Routes */}
        <Route path="/" element={<Store />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/:slug" element={<ProductDetail onOpenAuth={handleOpenAuth} />} />
        <Route path="/projects" element={<Store />} />
        <Route path="/projects/:slug" element={<ProductDetail onOpenAuth={handleOpenAuth} />} />

        {/* Customer Purchases & Download Vault */}
        <Route
          path="/my-purchases"
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
        <Route path="/cancellation-refund-policy" element={<RefundPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/delivery-policy" element={<ShippingPolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />

        {/* Admin Store CMS */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminProducts />
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

        {/* Any other routes redirect directly to the Store */}
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
