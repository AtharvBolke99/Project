import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Star, 
  ChevronLeft, 
  Zap,
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

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to purchase resources.', 'info');
      onOpenAuth();
      return;
    }

    setCheckoutLoading(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Failed to load Razorpay Checkout SDK. Please check your internet connection.');
      }

      const orderRes = await api.post('/payments/create-order', {
        productId: product.id
      });

      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.message || 'Failed to initialize Razorpay checkout order.');
      }

      const { razorpayOrderId, amountPaise, currency, razorpayKeyId } = orderRes.data;

      const options = {
        key: razorpayKeyId,
        amount: amountPaise,
        currency: currency || 'INR',
        name: 'Conceptifyyy',
        description: product.title.substring(0, 255),
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            showToast('Verifying payment...', 'info');
            const verifyRes = await api.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              productId: product.id
            });

            if (verifyRes.success) {
              showToast('Payment successful! Notes unlocked in your vault.', 'success');
              if (refreshUser) refreshUser();
              fetchProduct();
              navigate('/my-purchases');
            } else {
              showToast(verifyRes.message || 'Payment verification failed.', 'error');
            }
          } catch (err: any) {
            showToast(err.message || 'Failed to verify payment.', 'error');
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
          color: '#5B3DF5'
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
      if (err.alreadyOwned || err.message?.toLowerCase().includes('already own')) {
        showToast(err.message || 'You already own this resource.', 'info');
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
      <div className="wrap" style={{ padding: '4rem 1.5rem' }}>
        <div className="pop skeleton-pop" style={{ height: '400px', borderRadius: '26px' }}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="wrap" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
        <div className="pop" style={{ background: '#FFFFFF', borderRadius: '26px', padding: '3.5rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'var(--yellow)', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <FileText size={32} color="var(--ink)" />
          </div>
          <h2 className="d" style={{ fontSize: '32px', marginBottom: '0.75rem' }}>Note or Project Not Found</h2>
          <p className="mu" style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: '2rem' }}>
            The requested learning material may have moved or been updated. You can find all verified notes, cheat sheets, and full-stack projects in the Store.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/store" className="btn v">
              Browse All Resources
            </Link>
            <Link to="/" className="btn">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canAccess = product.price === 0 || product.isPurchased;

  return (
    <div className="product-detail-page animate-fade-in" style={{ paddingBottom: '96px' }}>
      <div className="wrap" style={{ paddingTop: '32px' }}>
        
        {/* Back Button */}
        <Link to="/store" className="btn btn-dark btn-sm" style={{ marginBottom: '24px', gap: '6px' }}>
          <ChevronLeft size={16} /> Back to Store
        </Link>

        {/* Two-Column Detail Layout */}
        <div className="product-detail-grid">
          
          {/* Left Column: Media & Checkout Box */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div 
              className="pop" 
              style={{ 
                background: 'var(--bg-card)', 
                borderRadius: '26px', 
                overflow: 'hidden', 
                padding: '24px',
                border: '2px solid var(--bg-card-border)'
              }}
            >
              {/* Product Thumbnail */}
              <div style={{ width: '100%', height: '260px', borderRadius: '18px', border: '1.5px solid var(--bg-card-border)', overflow: 'hidden', marginBottom: '20px', background: '#0E0D22' }}>
                <img
                  src={getAssetUrl(product.thumbnail)}
                  alt={product.title}
                  onError={handleImageError}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Price & Action Strip */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '12px' }}>
                <span className="d" style={{ fontSize: '38px', fontWeight: 800, color: 'var(--yellow)' }}>
                  {product.price === 0 ? 'FREE' : `₹${product.price}`}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span style={{ fontSize: '18px', color: 'var(--text-sub)', textDecoration: 'line-through' }}>
                    ₹{product.originalPrice}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="tag" style={{ background: 'var(--coral)', color: 'var(--ink)', fontWeight: 800 }}>
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                <ShieldCheck size={18} color="var(--mint)" />
                <span>Official Razorpay 256-Bit SSL Encrypted Checkout</span>
              </div>

              {/* CTA Buttons */}
              {canAccess ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={handleView}
                    className="btn btn-yellow btn-lg"
                    style={{ width: '100%', gap: '8px' }}
                  >
                    <ExternalLink size={20} /> Open / View PDF
                  </button>
                  <button
                    onClick={handleDownload}
                    className="btn btn-dark btn-lg"
                    style={{ width: '100%', gap: '8px' }}
                  >
                    <Download size={20} /> Download Resource
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleBuyNow}
                  disabled={checkoutLoading}
                  className="btn btn-yellow btn-lg"
                  style={{ width: '100%', gap: '10px' }}
                >
                  <ShoppingBag size={20} />
                  <span>{checkoutLoading ? 'Opening Razorpay Checkout...' : `Buy Now — ₹${product.price}`}</span>
                </button>
              )}

              <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                ✓ Instant Digital Delivery • ✓ Lifetime Vault Access
              </div>
            </div>
          </div>

          {/* Right Column: Information, Syllabus & Specs */}
          <div>
            
            {/* Category & Tags Strip */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <span className="tag" style={{ background: 'var(--yellow)', color: 'var(--ink)', fontWeight: 800 }}>{product.category}</span>
              <span className="tag">{product.fileFormat || 'PDF Document'}</span>
              {product.pageCount && <span className="tag">{product.pageCount} Pages</span>}
            </div>

            {/* Title */}
            <h1 className="d" style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.15, fontWeight: 800, marginBottom: '14px', color: '#FFFFFF' }}>
              {product.title}
            </h1>

            {/* Reviews */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} color="#FFC933" fill="#FFC933" />
                ))}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>{product.rating || 4.9}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                ({product.reviewsCount || 120} verified student ratings)
              </span>
            </div>

            {/* Overview Box */}
            {(product.cardDescription || product.shortDescription) && (
              <div 
                className="pop" 
                style={{ 
                  background: 'var(--bg-card-light)', 
                  border: '1.5px solid var(--bg-card-border-subtle)',
                  borderRadius: '20px', 
                  padding: '20px', 
                  marginBottom: '24px' 
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px', color: 'var(--yellow)' }}>
                  QUICK OVERVIEW
                </div>
                <p style={{ fontSize: '15px', color: '#FFFFFF', lineHeight: 1.6, fontWeight: 600, margin: 0 }}>
                  {product.cardDescription || product.shortDescription}
                </p>
              </div>
            )}

            {/* Complete Syllabus & Description */}
            <div 
              className="pop" 
              style={{ 
                background: 'var(--bg-card)', 
                border: '2px solid var(--bg-card-border)',
                borderRadius: '24px', 
                padding: '26px', 
                marginBottom: '24px' 
              }}
            >
              <h3 className="d" style={{ fontSize: '22px', marginBottom: '14px', color: '#FFFFFF' }}>
                {product.stepDescription || product.detailedDescription ? 'Detailed Content & Step Breakdown' : 'About this resource'}
              </h3>
              <div style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                {product.stepDescription || product.detailedDescription || product.description}
              </div>
            </div>

            {/* What's Included */}
            {product.whatIncluded && product.whatIncluded.length > 0 && (
              <div 
                className="pop" 
                style={{ 
                  background: '#FFFFFF', 
                  borderRadius: '24px', 
                  padding: '26px', 
                  marginBottom: '24px' 
                }}
              >
                <h3 className="d" style={{ fontSize: '20px', marginBottom: '14px' }}>What's Included:</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {product.whatIncluded.map((item: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: 'var(--ink)', fontWeight: 600 }}>
                      <CheckCircle2 size={18} color="#19C8A0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack for Projects */}
            {product.techStack && product.techStack.length > 0 && (
              <div 
                className="pop" 
                style={{ 
                  background: '#FFFFFF', 
                  borderRadius: '24px', 
                  padding: '26px', 
                  marginBottom: '24px' 
                }}
              >
                <h3 className="d" style={{ fontSize: '20px', marginBottom: '14px' }}>Technology Stack & Tools:</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.techStack.map((tech: string) => (
                    <span key={tech} className="tag tag-yellow" style={{ fontSize: '13px' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Card */}
            <div 
              className="pop" 
              style={{ 
                background: '#FFFFFF', 
                borderRadius: '24px', 
                padding: '26px' 
              }}
            >
              <h4 className="d" style={{ fontSize: '20px', marginBottom: '16px' }}>Frequently Asked Questions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
                <div>
                  <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                    Q: How do I access my files after purchasing?
                  </strong>
                  <p className="mu">
                    Your digital files unlock immediately upon verified payment and remain permanently accessible under your "My Purchases" library.
                  </p>
                </div>
                <div>
                  <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                    Q: Are future updates to these notes included?
                  </strong>
                  <p className="mu">
                    Yes! Any new interview questions or updated diagrams added by instructors are automatically available for re-download.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Razorpay Authentication Diagnostics Modal */}
      {authErrorModalData && (
        <div 
          className="modal-overlay"
          onClick={() => setAuthErrorModalData(null)}
        >
          <div 
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--ink)' }}>
                <AlertTriangle size={22} color="#FFFFFF" />
              </div>
              <div>
                <h3 className="d" style={{ fontSize: '20px', margin: 0 }}>Razorpay Key Configuration Needed</h3>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              The backend received an authentication error when contacting Razorpay. Please verify your Razorpay API Key ID and Key Secret in Render environment variables.
            </p>

            <button
              onClick={() => setAuthErrorModalData(null)}
              className="btn v"
              style={{ width: '100%' }}
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
