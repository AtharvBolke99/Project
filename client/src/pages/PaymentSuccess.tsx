import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Download, ShoppingBag, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api, getApiUrl } from '../services/api';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 } });

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
      window.location.href = getApiUrl(`/downloads/${orderData.productId}`);
    }
  };

  return (
    <div className="payment-success-page animate-fade-in flex-center" style={{ minHeight: '80vh', padding: '3rem 1.5rem' }}>
      <div 
        className="pop" 
        style={{ 
          maxWidth: '580px', 
          width: '100%', 
          background: '#FFFFFF', 
          borderRadius: '26px', 
          padding: '2.5rem', 
          textAlign: 'center' 
        }}
      >
        {/* Success Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'var(--soft-mint)',
          border: '2px solid var(--ink)',
          boxShadow: '3px 3px 0 var(--ink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <CheckCircle2 size={40} color="var(--ink)" />
        </div>

        <span className="tag" style={{ background: '#C9F7E8', marginBottom: '10px' }}>
          Payment Verified
        </span>

        <h1 className="d" style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
          Payment Successful!
        </h1>
        <p className="mu" style={{ marginBottom: '2rem', fontSize: '15px' }}>
          Your digital resources have been verified and unlocked permanently in your download vault.
        </p>

        {loading ? (
          <div className="skeleton-pop" style={{ height: '140px', borderRadius: '18px', marginBottom: '2rem' }}></div>
        ) : (
          <div 
            style={{ 
              background: 'var(--lavender)', 
              border: '2px solid var(--ink)', 
              borderRadius: '18px', 
              padding: '1.25rem', 
              marginBottom: '2rem', 
              textAlign: 'left', 
              fontSize: '14px',
              boxShadow: '2px 2px 0 var(--ink)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid var(--lavender-accent)', paddingBottom: '8px' }}>
              <span className="mu">Product:</span>
              <strong style={{ color: 'var(--ink)' }}>{orderData?.productTitle || 'Digital Placement Resource'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className="mu">Order Number:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ink)' }}>{orderData?.orderNumber || orderId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className="mu">Amount Paid:</span>
              <strong className="d" style={{ fontSize: '18px', color: 'var(--ink)' }}>₹{orderData?.amount}</strong>
            </div>
            {orderData?.paymentId && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="mu">Razorpay Payment ID:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink)' }}>{orderData.paymentId}</span>
              </div>
            )}
            {orderData?.licenseKey && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="mu">License Key:</span>
                <span className="tag" style={{ background: '#FFE9A8', fontSize: '11px', padding: '2px 8px' }}>{orderData.licenseKey}</span>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleDownload} className="btn v btn-lg" style={{ gap: '8px' }}>
            <Download size={18} /> Download Files Now
          </button>
          <Link to="/my-purchases" className="btn y btn-lg" style={{ gap: '8px' }}>
            <ShoppingBag size={18} /> My Purchases
          </Link>
        </div>
      </div>
    </div>
  );
};
