import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Star, 
  FileText, 
  Lock, 
  ChevronLeft, 
  Sparkles, 
  Layers, 
  HelpCircle,
  Clock,
  ExternalLink,
  AlertTriangle,
  Copy,
  X,
  KeyRound
} from 'lucide-react';
import { api, getApiUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { getAssetUrl, handleImageError } from '../utils/imageUrl';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const ProductDetail: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [authErrorModalData, setAuthErrorModalData] = useState<{
    visible: boolean;
    rawError: string;
  } | null>(null);
  const [copiedEnv, setCopiedEnv] = useState<boolean>(false);

  const { user, isAuthenticated, refreshUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/store/products/${slug}`);
      if (res.success && res.data) {
        setProduct(res.data);
      }
    } catch (e: any) {
      showToast(e.message || 'Product not found', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchProduct();
  }, [slug]);

  // Load Razorpay checkout script if not present
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window.Razorpay !== 'undefined') {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // REAL RAZORPAY STANDARD WEB CHECKOUT HANDLER
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to purchase resources.', 'info');
      onOpenAuth();
      return;
    }

    setCheckoutLoading(true);

    try {
      // 1. Ensure official Razorpay Checkout SDK is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Failed to load Razorpay Checkout SDK. Please check your internet connection.');
      }

      // 2. Create Internal & Razorpay Order on Backend (Price verified server-side in paise)
      const orderRes = await api.post('/payments/create-order', {
        productId: product.id
      });

      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.message || 'Failed to initialize payment order on server.');
      }

      const { orderId, razorpayOrderId, amountPaise, currency, keyId } = orderRes.data;

      // 3. Initialize Official Razorpay Standard Web Checkout
      const options = {
        key: keyId,
        amount: amountPaise,
        currency: currency || 'INR',
        name: 'CONCEPTIFYYY',
        description: product.title,
        image: '/favicon.svg',
        order_id: razorpayOrderId,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            // Send payment response to backend for server-side HMAC-SHA256 signature verification
            const verifyRes = await api.post('/payments/verify', {
              orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            if (verifyRes.success) {
              await refreshUser();
              showToast('🎉 Payment Successful! Product unlocked in your library.', 'success');
              navigate(`/payment/success?orderId=${orderId}`);
            } else {
              navigate(`/payment/failed?reason=${encodeURIComponent(verifyRes.message || 'Signature verification failed')}`);
            }
          } catch (vErr: any) {
            navigate(`/payment/failed?reason=${encodeURIComponent(vErr.message || 'Payment verification failed')}`);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: ''
        },
        notes: {
          productId: product.id,
          productTitle: product.title
        },
        theme: {
          color: '#00E5FF'
        },
        modal: {
          ondismiss: function () {
            showToast('Payment checkout was dismissed.', 'info');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        console.error('Razorpay Payment Failed:', resp?.error);
        showToast(resp?.error?.description || 'Payment was cancelled or failed.', 'error');
      });

      rzp.open();
    } catch (err: any) {
      if (err.alreadyOwned) {
        showToast(err.message, 'info');
        navigate('/my-purchases');
      } else if (
        err.message?.toLowerCase().includes('authentication failed') ||
        err.message?.toLowerCase().includes('razorpay authentication') ||
        err.message?.toLowerCase().includes('credentials')
      ) {
        setAuthErrorModalData({
          visible: true,
          rawError: err.message
        });
      } else {
        showToast(err.message || 'Payment initialization failed', 'error');
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleDownload = () => {
    const token = localStorage.getItem('conceptifyyy_token') || '';
    const url = getApiUrl(`/downloads/${product.id}?download=true${token ? `&token=${token}` : ''}`);
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleView = () => {
    const token = localStorage.getItem('conceptifyyy_token') || '';
    const url = getApiUrl(`/downloads/${product.id}?view=true${token ? `&token=${token}` : ''}`);
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <SkeletonLoader rows={6} height="60px" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <h2>Resource not found.</h2>
        <Link to="/store" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Store
        </Link>
      </div>
    );
  }

  const canAccess = product.price === 0 || product.isPurchased;

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container" style={{ paddingTop: '2rem', maxWidth: '1080px' }}>
        {/* Back Link */}
        <Link to="/store" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
          <ChevronLeft size={16} /> Back to Store
        </Link>

        {/* Product Details Layout */}
        <div className="product-detail-grid" style={{ marginBottom: '3rem' }}>
          {/* Left Column: Image Card */}
          <div>
            <div className="card glass-card glowing-border product-detail-sticky-card" style={{ padding: '1rem' }}>
              <div className="product-detail-img-box">
                <img
                  src={getAssetUrl(product.thumbnail)}
                  alt={product.title}
                  onError={handleImageError}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Price & Checkout Action */}
              <div style={{ padding: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {product.price === 0 ? 'Free' : `₹${product.price}`}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      ₹{product.originalPrice}
                    </span>
                  )}
                  {product.discountPercent && (
                    <span className="badge badge-emerald">
                      {product.discountPercent}% OFF
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  <ShieldCheck size={16} color="var(--color-cyan)" />
                  <span>Official Razorpay 256-Bit SSL Encrypted Checkout</span>
                </div>

                {canAccess ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={handleView}
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%', gap: '8px', fontWeight: 800 }}
                    >
                      <ExternalLink size={20} /> Visit / View Resource
                    </button>
                    <button
                      onClick={handleDownload}
                      className="btn btn-secondary btn-md"
                      style={{ width: '100%', gap: '8px', fontWeight: 700 }}
                    >
                      <Download size={18} /> Download Resource
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleBuyNow}
                    disabled={checkoutLoading}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', gap: '8px', fontWeight: 800 }}
                  >
                    <ShoppingBag size={20} />
                    <span>{checkoutLoading ? 'Opening Razorpay Checkout...' : `Buy Now — ₹${product.price}`}</span>
                  </button>
                )}

                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Instant Digital Delivery • Lifetime Access
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Specs */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-purple">{product.category}</span>
              <span className="badge badge-cyan">{product.fileFormat || 'PDF Document'}</span>
              {product.pageCount && <span className="badge">{product.pageCount} Pages</span>}
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              {product.title}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', color: 'var(--color-amber)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--color-amber)" />
                ))}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{product.rating}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                ({product.reviewsCount} verified student ratings)
              </span>
            </div>

            {/* Quick Summary / Card Overview (if provided and different) */}
            {(product.cardDescription || product.shortDescription) && 
             (product.cardDescription || product.shortDescription) !== (product.stepDescription || product.detailedDescription || product.description) && (
              <div className="card" style={{ marginBottom: '1.5rem', background: 'rgba(56, 189, 248, 0.06)', borderLeft: '4px solid var(--color-cyan)', padding: '1rem 1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-cyan)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  Quick Overview
                </div>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-primary)', lineHeight: '1.6', margin: 0 }}>
                  {product.cardDescription || product.shortDescription}
                </p>
              </div>
            )}

            {/* Complete Step Description */}
            <div className="card" style={{ marginBottom: '1.5rem', background: 'var(--bg-secondary)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.85rem' }}>
                {product.stepDescription || product.detailedDescription ? 'Complete Step-by-Step Description' : 'About this resource'}
              </h3>
              <div style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: '1.75', whiteSpace: 'pre-line' }}>
                {product.stepDescription || product.detailedDescription || product.description}
              </div>
            </div>

            {/* What's Included */}
            {product.whatIncluded?.length > 0 && (
              <div className="card" style={{ marginBottom: '1.5rem', background: 'var(--bg-secondary)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>What's Included:</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {product.whatIncluded.map((item: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      <CheckCircle2 size={16} color="var(--color-emerald)" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack for Projects */}
            {product.techStack?.length > 0 && (
              <div className="card" style={{ marginBottom: '1.5rem', background: 'var(--bg-secondary)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Technology Stack & Frameworks:</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {product.techStack.map((tech: string) => (
                    <span key={tech} className="badge badge-purple" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '2rem' }}>
              {product.tags?.map((tag: string) => (
                <span key={tag} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '4px' }}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* FAQ Accordion */}
            <div className="card" style={{ background: 'var(--bg-secondary)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Frequently Asked Questions:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Q: How do I access my files after purchasing?</strong>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Your files unlock immediately upon verified payment and remain accessible forever under your "My Purchases" library.</p>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Q: Are future updates to these notes included?</strong>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Yes! Any new interview questions or updated diagrams added by the instructors are automatically available for re-download.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Authentication Diagnostics Modal */}
      {authErrorModalData && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.25rem'
          }}
          onClick={() => setAuthErrorModalData(null)}
        >
          <div 
            className="card" 
            style={{
              maxWidth: '560px',
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setAuthErrorModalData(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '6px',
                borderRadius: '8px'
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Razorpay Payment Notice
                </h3>
                <span className="badge badge-warning" style={{ fontSize: '0.7rem', marginTop: '4px' }}>
                  401 Authentication Failed on Razorpay API
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Razorpay's API server (<code style={{ color: 'var(--color-primary)', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>api.razorpay.com</code>) rejected the credentials configured in <code style={{ color: 'var(--color-primary)', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>server/.env</code>. This happens when the Razorpay API keys were rotated, regenerated, or expired on the Razorpay Dashboard.
            </p>

            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1.25rem',
              fontSize: '0.85rem'
            }}>
              <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--text-primary)' }}>
                How to resolve this in 3 quick steps:
              </strong>
              <ol style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-secondary)' }}>
                <li>
                  Open your <a href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'underline' }}>Razorpay Dashboard &gt; API Keys</a> in <strong>Live Mode</strong>.
                </li>
                <li>
                  Click <strong>Generate New Key</strong> (or copy your active Live Key pair).
                </li>
                <li>
                  Update both <code style={{ fontWeight: 600 }}>RAZORPAY_KEY_ID</code> and <code style={{ fontWeight: 600 }}>RAZORPAY_KEY_SECRET</code> in <code style={{ fontWeight: 600 }}>server/.env</code> or your Render environment variables and restart.
                </li>
              </ol>
            </div>

            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <pre style={{
                background: '#0F172A',
                color: '#38BDF8',
                padding: '12px 14px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                margin: 0
              }}>
{`# Update in server/.env or Render Dashboard:
RAZORPAY_KEY_ID=rzp_live_TdWOOe8pJsTv4a
RAZORPAY_KEY_SECRET=AMX36S7ivlSsiQgzn2JZOEXj`}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('RAZORPAY_KEY_ID=rzp_live_TdWOOe8pJsTv4a\nRAZORPAY_KEY_SECRET=AMX36S7ivlSsiQgzn2JZOEXj');
                  setCopiedEnv(true);
                  setTimeout(() => setCopiedEnv(false), 2000);
                }}
                className="btn btn-secondary btn-sm"
                style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px 8px', fontSize: '0.7rem' }}
              >
                {copiedEnv ? '✓ Copied' : <><Copy size={12} /> Copy</>}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              {user?.role === 'ADMIN' && (
                <button 
                  onClick={() => {
                    setAuthErrorModalData(null);
                    handleView();
                  }} 
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                >
                  <ExternalLink size={14} /> Open Admin Preview
                </button>
              )}
              <a
                href="https://dashboard.razorpay.com/app/keys"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ fontSize: '0.85rem' }}
              >
                Open Razorpay Dashboard
              </a>
              <button
                onClick={() => setAuthErrorModalData(null)}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
