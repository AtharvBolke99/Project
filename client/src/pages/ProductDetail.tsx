import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Star, 
  ChevronLeft, 
  ExternalLink,
  AlertTriangle,
  FileText,
  BookOpen,
  Lock
} from 'lucide-react';
import { api, getApiUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
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

      const { razorpayOrderId, amountPaise, currency, razorpayKeyId, keyId, orderId } = orderRes.data;

      const options = {
        key: razorpayKeyId || keyId,
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
              orderId: orderId,
              order_id: orderId,
              razorpayOrderId: response.razorpay_order_id || razorpayOrderId,
              razorpay_order_id: response.razorpay_order_id || razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              razorpay_signature: response.razorpay_signature,
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
          color: '#4F46E5'
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
      <div className="store-detail-page">
        <div className="store-container">
          <div className="store-skeleton-card" style={{ height: '440px' }}></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="store-detail-page">
        <div className="store-container">
          <div className="store-empty-card" style={{ maxWidth: '580px' }}>
            <FileText size={48} color="#4F46E5" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              Resource Not Found
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
              The requested study material or project could not be found or has been moved.
            </p>
            <Link to="/store" className="store-btn-action">
              Browse All Resources
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isFree = product.price === 0;
  const canAccess = isFree || product.isPurchased;
  const isFileAvailable = product.isFileAvailable !== false;
  const thumbnailSrc = getAssetUrl(product.thumbnail);

  return (
    <div className="store-detail-page animate-fade-in">
      <div className="store-container">
        
        {/* Back Button */}
        <div style={{ marginBottom: '24px' }}>
          <Link 
            to="/store" 
            className="store-cat-pill"
            style={{ textDecoration: 'none' }}
          >
            <ChevronLeft size={16} />
            <span>Back to Store</span>
          </Link>
        </div>

        {/* Two-Column Detail Layout */}
        <div className="store-detail-grid">
          
          {/* Left Column: Media & Checkout Box */}
          <aside className="store-detail-sidebar" style={{ position: 'sticky', top: '96px' }}>
            
            {/* Product Thumbnail */}
            <div style={{ 
              width: '100%', 
              height: '240px', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {thumbnailSrc ? (
                <img
                  src={thumbnailSrc}
                  alt={product.title}
                  onError={handleImageError}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#4F46E5' }}>
                  <BookOpen size={48} />
                  <span style={{ fontSize: '13px', fontWeight: 700, marginTop: '8px' }}>{product.category}</span>
                </div>
              )}
            </div>

            {/* Price & Discount */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
              {isFree ? (
                <span className="store-price-free" style={{ fontSize: '32px' }}>FREE</span>
              ) : (
                <>
                  <span className="store-price-main" style={{ fontSize: '32px' }}>₹{product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="store-price-original" style={{ fontSize: '16px' }}>₹{product.originalPrice}</span>
                  )}
                  {product.discountPercent > 0 && (
                    <span className="store-badge store-badge-discount" style={{ marginLeft: 'auto' }}>
                      {product.discountPercent}% OFF
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Trust badge */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '12.5px', 
              color: '#64748B', 
              marginBottom: '20px',
              padding: '10px 12px',
              background: '#F8FAFC',
              borderRadius: '10px',
              border: '1px solid #E2E8F0'
            }}>
              <ShieldCheck size={16} color="#10B981" />
              <span>Official Razorpay 256-Bit SSL Encrypted</span>
            </div>

            {/* Physical File Missing Notice if applicable */}
            {!isFileAvailable && (
              <div style={{ 
                background: '#FFFBEB', 
                border: '1px solid #FDE68A', 
                borderRadius: '12px', 
                padding: '12px 14px', 
                fontSize: '13px', 
                color: '#B45309', 
                marginBottom: '16px' 
              }}>
                <strong>⚠️ File Syncing:</strong> The digital file for this note is currently being updated by the instructor. You can still purchase or save it for instant access once ready.
              </div>
            )}

            {/* Action Buttons */}
            {canAccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={handleView}
                  className="store-detail-btn-buy store-detail-btn-free"
                  disabled={!isFileAvailable}
                >
                  <ExternalLink size={18} />
                  <span>Open / View Document</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="store-detail-btn-buy"
                  style={{ background: '#0F172A' }}
                  disabled={!isFileAvailable}
                >
                  <Download size={18} />
                  <span>Download Resource</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleBuyNow}
                disabled={checkoutLoading}
                className="store-detail-btn-buy"
              >
                <ShoppingBag size={18} />
                <span>{checkoutLoading ? 'Opening Razorpay Checkout...' : `Buy Now — ₹${product.price}`}</span>
              </button>
            )}

            <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
              ✓ Instant Digital Access • ✓ Lifetime Vault Storage
            </div>
          </aside>

          {/* Right Column: Information, Syllabus & Specs */}
          <main>
            
            {/* Top Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <span className="store-badge store-badge-dsa" style={{ fontSize: '12.5px', padding: '6px 12px' }}>
                {product.category}
              </span>
              <span className="store-badge store-badge-default" style={{ fontSize: '12.5px', padding: '6px 12px' }}>
                {product.fileFormat || 'PDF Document'}
              </span>
              {product.pageCount && (
                <span className="store-badge store-badge-default" style={{ fontSize: '12.5px', padding: '6px 12px' }}>
                  {product.pageCount} Pages
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 style={{ 
              fontSize: 'clamp(26px, 3.5vw, 38px)', 
              fontWeight: 800, 
              color: '#0F172A', 
              lineHeight: 1.25, 
              margin: '0 0 14px 0',
              letterSpacing: '-0.02em'
            }}>
              {product.title}
            </h1>

            {/* Ratings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />
                ))}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                {product.rating || 4.9}
              </span>
              <span style={{ fontSize: '13px', color: '#64748B' }}>
                ({product.reviewsCount || 120} verified student ratings)
              </span>
            </div>

            {/* Short Description Box */}
            {(product.cardDescription || product.shortDescription) && (
              <div style={{ 
                background: '#EEF2FF', 
                border: '1px solid #E0E7FF', 
                borderRadius: '16px', 
                padding: '18px 20px', 
                marginBottom: '24px' 
              }}>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#4F46E5', letterSpacing: '0.05em', marginBottom: '6px' }}>
                  OVERVIEW
                </div>
                <p style={{ fontSize: '15px', color: '#1E293B', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                  {product.cardDescription || product.shortDescription}
                </p>
              </div>
            )}

            {/* Detailed Description / Syllabus Card */}
            <div className="store-detail-card">
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '14px' }}>
                {product.stepDescription || product.detailedDescription ? 'Detailed Content & Topics' : 'About this Resource'}
              </h3>
              <div style={{ fontSize: '15px', color: '#475569', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                {product.stepDescription || product.detailedDescription || product.description}
              </div>
            </div>

            {/* What's Included */}
            {product.whatIncluded && product.whatIncluded.length > 0 && (
              <div className="store-detail-card">
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '14px' }}>
                  What's Included:
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {product.whatIncluded.map((item: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px', color: '#1E293B', fontWeight: 600 }}>
                      <CheckCircle2 size={18} color="#10B981" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack for Projects */}
            {product.techStack && product.techStack.length > 0 && (
              <div className="store-detail-card">
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '14px' }}>
                  Technology Stack & Tools:
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.techStack.map((tech: string) => (
                    <span key={tech} className="store-cat-pill" style={{ height: '34px', fontSize: '13px' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Card */}
            <div className="store-detail-card">
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '16px' }}>
                Frequently Asked Questions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14.5px' }}>
                <div>
                  <strong style={{ color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Q: How do I access my files after purchasing?
                  </strong>
                  <p style={{ color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                    Your digital files unlock immediately upon verified payment and remain permanently accessible under your "My Purchases" vault.
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Q: Are future revisions to these notes included?
                  </strong>
                  <p style={{ color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                    Yes! Any newly added company interview questions or updated diagrams are automatically available for re-download anytime.
                  </p>
                </div>
              </div>
            </div>

          </main>

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
            style={{ maxWidth: '480px', padding: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={22} color="#DC2626" />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0F172A' }}>Razorpay Configuration Required</h3>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, marginBottom: '20px' }}>
              The backend received an authentication error when contacting Razorpay. Please verify your Razorpay API Key ID and Key Secret in your environment configuration.
            </p>

            <button
              onClick={() => setAuthErrorModalData(null)}
              className="store-btn-action"
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

export default ProductDetail;
