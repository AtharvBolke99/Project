import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Download, ShoppingBag, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { SkeletonLoader } from '../components/SkeletonLoader';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    const fetchOrderStatus = async () => {
      if (!orderId) return;
      try {
        const res = await api.get(`/payments/order-status/${orderId}`);
        if (res.success && res.order) {
          setOrderData(res.order);
        }
      } catch (e) {
        console.error('Failed to load order:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderStatus();
  }, [orderId]);

  const handleDownload = () => {
    if (orderData?.productId) {
      window.location.href = `/api/downloads/${orderData.productId}`;
    }
  };

  return (
    <div className="page-wrapper animate-fade-in flex-center" style={{ minHeight: '80vh', padding: '2rem 1.25rem' }}>
      <div className="card glass-card glowing-border" style={{ maxWidth: '580px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
        {/* Success Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          color: 'var(--color-emerald)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <CheckCircle2 size={36} />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Payment Successful!
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Your digital resources have been verified and unlocked in your account.
        </p>

        {loading ? (
          <SkeletonLoader rows={4} height="35px" />
        ) : (
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem', textAlign: 'left', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Product:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{orderData?.productTitle || 'Digital Placement Resource'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{orderData?.orderNumber || orderId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
              <strong style={{ color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>₹{orderData?.amount}</strong>
            </div>
            {orderData?.paymentId && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment ID:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{orderData.paymentId}</span>
              </div>
            )}
            {orderData?.licenseKey && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>License Key:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-emerald)', fontWeight: 700 }}>{orderData.licenseKey}</span>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleDownload} className="btn btn-primary btn-lg">
            <Download size={18} /> Download Files Now
          </button>
          <Link to="/my-purchases" className="btn btn-secondary btn-lg">
            <ShoppingBag size={18} /> My Purchases
          </Link>
        </div>
      </div>
    </div>
  );
};
