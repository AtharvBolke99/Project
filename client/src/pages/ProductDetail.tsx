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
  BookOpen,
  Calendar,
  Sparkles,
  Award,
  GraduationCap,
  ArrowRight
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
    a.download = product.originalFileName || `${product.slug || 'notes'}.${(product.fileFormat || 'pdf').toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleView = () => {
    const token = localStorage.getItem('conceptifyyy_token') || '';
    const url = getApiUrl(`/downloads/${product.id}?download=false${token ? `&token=${token}` : ''}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="wrap" style={{ paddingTop: '40px', paddingBottom: '80px', background: 'var(--bg-cosmic)', minHeight: '100vh' }}>
        <SkeletonLoader count={3} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="wrap" style={{ textAlign: 'center', padding: '5rem 1.5rem', background: 'var(--bg-cosmic)', minHeight: '100vh', color: '#FFFFFF' }}>
        <div className="pop" style={{ background: 'var(--bg-card)', border: '2px solid var(--bg-card-border)', borderRadius: '26px', padding: '3.5rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'var(--yellow)', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <BookOpen size={32} color="var(--ink)" />
          </div>
          <h2 className="d" style={{ fontSize: '32px', marginBottom: '0.75rem', color: '#FFFFFF' }}>Note or Material Not Found</h2>
          <p className="mu" style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: '2rem', color: 'var(--text-muted)' }}>
            The requested learning material may have moved or been updated. You can find all verified notes, cheat sheets, and full-stack projects in the Store.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/store" className="btn btn-yellow">
              Browse All Resources
            </Link>
            <Link to="/" className="btn btn-dark">
              Back to Home
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
  const reviewsList = Array.isArray(product.reviews) ? product.reviews : [];
  const relatedProducts = Array.isArray(product.relatedProducts) ? product.relatedProducts : [];

  return (
    <div className="product-detail-page animate-fade-in" style={{ paddingBottom: '96px', background: 'var(--bg-cosmic)', minHeight: '100vh', color: '#FFFFFF' }}>
      <div className="wrap" style={{ paddingTop: '32px' }}>
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <Link 
            to="/store" 
            className="btn btn-dark btn-sm"
            style={{ textDecoration: 'none', gap: '6px' }}
          >
            <ChevronLeft size={16} />
            <span>Store</span>
          </Link>
          <span style={{ color: 'var(--text-sub)' }}>/</span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--yellow)' }}>{product.category}</span>
          {product.subcategory && (
            <>
              <span style={{ color: 'var(--text-sub)' }}>/</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>{product.subcategory}</span>
            </>
          )}
        </div>

        {/* Two-Column Detail Layout */}
        <div className="product-detail-grid">
          
          {/* Left Column: Media & Checkout Box (Sticky) */}
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
              <div style={{ width: '100%', height: '240px', borderRadius: '18px', border: '1.5px solid var(--bg-card-border)', overflow: 'hidden', marginBottom: '20px', background: '#0E0D22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {thumbnailSrc ? (
                  <img
                    src={thumbnailSrc}
                    alt={product.title}
                    onError={handleImageError}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--yellow)' }}>
                    <BookOpen size={48} />
                    <span style={{ fontSize: '13px', fontWeight: 700, marginTop: '8px' }}>{product.category}</span>
                  </div>
                )}
              </div>

              {/* Price & Discount */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                {isFree ? (
                  <span className="d" style={{ fontSize: '38px', fontWeight: 800, color: 'var(--mint)' }}>FREE</span>
                ) : (
                  <>
                    <span className="d" style={{ fontSize: '38px', fontWeight: 800, color: 'var(--yellow)' }}>₹{product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span style={{ fontSize: '18px', color: 'var(--text-sub)', textDecoration: 'line-through' }}>₹{product.originalPrice}</span>
                    )}
                    {product.discountPercent > 0 && (
                      <span className="tag" style={{ background: 'var(--coral)', color: 'var(--ink)', fontWeight: 800, marginLeft: 'auto' }}>
                        {product.discountPercent}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Clear Free / Paid Label */}
              <div style={{ marginBottom: '16px' }}>
                {isFree ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: 'var(--mint)', background: 'rgba(78, 237, 184, 0.1)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(78, 237, 184, 0.2)' }}>
                    ✓ 100% Free Public Learning Resource
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: 'var(--yellow)', background: 'rgba(255, 201, 51, 0.1)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(255, 201, 51, 0.2)' }}>
                    ✓ One-Time Payment • Lifetime Vault Storage
                  </span>
                )}
              </div>

              {/* Security Trust Badge */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '12.5px', 
                color: 'var(--text-muted)', 
                marginBottom: '20px'
              }}>
                <ShieldCheck size={18} color="var(--mint)" />
                <span>Official Razorpay 256-Bit SSL Encrypted Checkout</span>
              </div>

              {/* Physical File Missing Notice if applicable */}
              {!isFileAvailable && (
                <div style={{ 
                  background: 'rgba(255, 138, 107, 0.12)', 
                  border: '1px solid var(--coral)', 
                  borderRadius: '12px', 
                  padding: '12px 14px', 
                  fontSize: '13px', 
                  color: 'var(--coral)', 
                  marginBottom: '16px' 
                }}>
                  <strong>⚠️ File Syncing:</strong> The digital file for this note is currently being updated by the instructor. You can still purchase or save it for instant access once ready.
                </div>
              )}

              {/* CTA Buttons */}
              {canAccess ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={handleView}
                    className="btn btn-yellow btn-lg"
                    style={{ width: '100%', gap: '8px' }}
                    disabled={!isFileAvailable}
                  >
                    <ExternalLink size={18} />
                    <span>Open / View Document</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="btn btn-dark btn-lg"
                    style={{ width: '100%', gap: '8px' }}
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
                  className="btn btn-yellow btn-lg"
                  style={{ width: '100%', gap: '10px' }}
                >
                  <ShoppingBag size={20} />
                  <span>{checkoutLoading ? 'Opening Razorpay Checkout...' : `Buy Now — ₹${product.price}`}</span>
                </button>
              )}

              {/* Key Resource Meta Spec Sheet */}
              <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--bg-card-border)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Format:</span>
                  <strong style={{ color: '#FFFFFF' }}>{product.fileFormat || 'PDF Document'}</strong>
                </div>
                {product.pageCount && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Pages / Chapters:</span>
                    <strong style={{ color: '#FFFFFF' }}>{product.pageCount} Pages</strong>
                  </div>
                )}
                {product.estimatedTime && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Estimated Time:</span>
                    <strong style={{ color: '#FFFFFF' }}>{product.estimatedTime}</strong>
                  </div>
                )}
                {product.difficulty && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Difficulty Level:</span>
                    <strong style={{ color: '#FFFFFF' }}>{product.difficulty}</strong>
                  </div>
                )}
                {product.lastUpdatedDate && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Last Maintained:</span>
                    <strong style={{ color: '#FFFFFF' }}>{product.lastUpdatedDate}</strong>
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-sub)', fontWeight: 600 }}>
                ✓ Instant Digital Download • ✓ Perpetual Vault Access
              </div>
            </div>
          </div>

          {/* Right Column: Complete Learning Breakdown & Transparency Details */}
          <div>
            
            {/* Top Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px', alignItems: 'center' }}>
              <span className="tag" style={{ background: 'var(--yellow)', color: 'var(--ink)', fontWeight: 800 }}>
                {product.category}
              </span>
              {product.subcategory && (
                <span className="tag" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', border: '1px solid var(--bg-card-border-subtle)' }}>
                  {product.subcategory}
                </span>
              )}
              <span className="tag" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF' }}>
                {product.fileFormat || 'PDF Document'}
              </span>
              {product.difficulty && (
                <span className="tag" style={{ background: 'rgba(78, 237, 184, 0.1)', color: 'var(--mint)', border: '1px solid rgba(78, 237, 184, 0.2)' }}>
                  {product.difficulty} Level
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="d" style={{ 
              fontSize: 'clamp(26px, 3.5vw, 42px)', 
              fontWeight: 800, 
              color: '#FFFFFF', 
              lineHeight: 1.2, 
              margin: '0 0 14px 0'
            }}>
              {product.title}
            </h1>

            {/* Ratings & Maintenance Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} color="#FFC933" fill="#FFC933" />
                  ))}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                  {product.rating || 4.9}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  ({product.reviewsCount || 120} verified student ratings)
                </span>
              </div>

              {product.lastUpdatedDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--text-sub)' }}>
                  <Calendar size={14} color="var(--text-sub)" />
                  <span>Maintained: {product.lastUpdatedDate}</span>
                </div>
              )}
            </div>

            {/* Quality & Transparency Badges */}
            {product.qualityIndicators && product.qualityIndicators.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {product.qualityIndicators.map((ind: string) => (
                  <span 
                    key={ind} 
                    className="tag"
                    style={{ 
                      fontSize: '11px', 
                      background: 'rgba(255, 255, 255, 0.06)', 
                      border: '1px solid var(--bg-card-border-subtle)',
                      color: ind === 'Beginner Friendly' ? 'var(--mint)' : (ind === 'Interview Focused' ? 'var(--yellow)' : '#FFFFFF')
                    }}
                  >
                    <CheckCircle2 size={13} style={{ marginRight: '4px' }} />
                    <span>{ind}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Short Overview Box */}
            {(product.cardDescription || product.shortDescription) && (
              <div className="pop" style={{ 
                background: 'var(--bg-card)', 
                border: '2px solid var(--bg-card-border)', 
                borderRadius: '20px', 
                padding: '20px', 
                marginBottom: '24px' 
              }}>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--yellow)', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  RESOURCE SUMMARY
                </div>
                <p className="mu" style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  {product.cardDescription || product.shortDescription}
                </p>
              </div>
            )}

            {/* Admin's Editorial Recommendation / Trust Message */}
            {product.adminReview && (
              <div className="pop" style={{ 
                background: 'rgba(78, 237, 184, 0.06)', 
                border: '2px solid rgba(78, 237, 184, 0.25)', 
                borderRadius: '20px', 
                padding: '20px', 
                marginBottom: '24px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Award size={18} color="var(--mint)" />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--mint)', letterSpacing: '0.04em' }}>
                    EDITORIAL RECOMMENDATION & INSTRUCTOR NOTE
                  </span>
                </div>
                <p style={{ fontSize: '14.5px', color: '#FFFFFF', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                  "{product.adminReview}"
                </p>
                <div style={{ fontSize: '11.5px', color: 'var(--mint)', marginTop: '8px', fontWeight: 600 }}>
                  — Conceptifyyy Academic Curriculum Team
                </div>
              </div>
            )}

            {/* Who Should Use This Resource? (Target Audience) */}
            {product.targetAudience && (
              <div className="pop" style={{ 
                background: 'var(--bg-card)', 
                border: '2px solid var(--bg-card-border)', 
                borderRadius: '20px', 
                padding: '24px', 
                marginBottom: '24px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <GraduationCap size={20} color="var(--yellow)" />
                  <h3 className="d" style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Who Should Use This Resource?
                  </h3>
                </div>
                <p className="mu" style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  {product.targetAudience}
                </p>
              </div>
            )}

            {/* What You Will Learn / Learning Outcomes */}
            {product.learningOutcomes && product.learningOutcomes.length > 0 && (
              <div className="pop" style={{ 
                background: 'var(--bg-card)', 
                border: '2px solid var(--bg-card-border)', 
                borderRadius: '20px', 
                padding: '24px', 
                marginBottom: '24px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Sparkles size={20} color="var(--yellow)" />
                  <h3 className="d" style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    What You Will Learn & Master
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {product.learningOutcomes.map((outcome: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14.5px', color: '#FFFFFF', fontWeight: 500 }}>
                      <CheckCircle2 size={18} color="var(--mint)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Content / Topics Covered / Syllabus Breakdown */}
            <div className="pop" style={{ 
              background: 'var(--bg-card)', 
              border: '2px solid var(--bg-card-border)', 
              borderRadius: '20px', 
              padding: '24px', 
              marginBottom: '24px' 
            }}>
              <h3 className="d" style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginTop: 0, marginBottom: '14px' }}>
                Topics Covered & Detailed Syllabus Breakdown
              </h3>
              <div className="mu" style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                {product.stepDescription || product.detailedDescription || product.description}
              </div>
            </div>

            {/* What's Included */}
            {product.whatIncluded && product.whatIncluded.length > 0 && (
              <div className="pop" style={{ 
                background: 'var(--bg-card)', 
                border: '2px solid var(--bg-card-border)', 
                borderRadius: '20px', 
                padding: '24px', 
                marginBottom: '24px' 
              }}>
                <h3 className="d" style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginTop: 0, marginBottom: '14px' }}>
                  What's Included in this Download:
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {product.whatIncluded.map((item: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px', color: '#FFFFFF', fontWeight: 600 }}>
                      <CheckCircle2 size={18} color="var(--mint)" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack for Projects */}
            {product.techStack && product.techStack.length > 0 && (
              <div className="pop" style={{ 
                background: 'var(--bg-card)', 
                border: '2px solid var(--bg-card-border)', 
                borderRadius: '20px', 
                padding: '24px', 
                marginBottom: '24px' 
              }}>
                <h3 className="d" style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginTop: 0, marginBottom: '14px' }}>
                  Technology Stack & Tools:
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.techStack.map((tech: string) => (
                    <span key={tech} className="tag" style={{ background: 'var(--yellow)', color: 'var(--ink)', fontWeight: 800, fontSize: '13px' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Relevant Published Reviews for this Product */}
            {reviewsList.length > 0 && (
              <div className="pop" style={{ 
                background: 'var(--bg-card)', 
                border: '2px solid var(--bg-card-border)', 
                borderRadius: '20px', 
                padding: '24px', 
                marginBottom: '24px' 
              }}>
                <h3 className="d" style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginTop: 0, marginBottom: '16px' }}>
                  Feedback & Editorial Reviews ({reviewsList.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reviewsList.map(rev => (
                    <div key={rev.id} style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '18px', borderRadius: '16px', border: '1px solid var(--bg-card-border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <strong style={{ fontSize: '14.5px', color: '#FFFFFF' }}>{rev.reviewerName}</strong>
                          <div style={{ fontSize: '12px', color: 'var(--text-sub)' }}>{rev.reviewerRole}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="tag" style={{ fontSize: '11px', background: rev.isEditorial ? 'rgba(91, 61, 245, 0.3)' : 'rgba(78, 237, 184, 0.2)', color: rev.isEditorial ? '#EDE9FF' : 'var(--mint)' }}>
                            {rev.badge || (rev.isEditorial ? 'Editorial' : 'Student')}
                          </span>
                          <div style={{ display: 'flex', gap: '1px' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={13} color={i < rev.rating ? '#FFC933' : 'rgba(255,255,255,0.2)'} fill={i < rev.rating ? '#FFC933' : 'transparent'} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF' }}>
                        {rev.reviewTitle}
                      </h4>
                      <p className="mu" style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        {rev.reviewDescription}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Resources in same category */}
            {relatedProducts.length > 0 && (
              <div className="pop" style={{ 
                background: 'var(--bg-card)', 
                border: '2px solid var(--bg-card-border)', 
                borderRadius: '20px', 
                padding: '24px', 
                marginBottom: '24px' 
              }}>
                <h3 className="d" style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginTop: 0, marginBottom: '16px' }}>
                  Related Resources in {product.category}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  {relatedProducts.map(rel => (
                    <Link 
                      key={rel.id} 
                      to={`/store/${rel.slug}`} 
                      style={{ 
                        textDecoration: 'none', 
                        background: 'rgba(255, 255, 255, 0.04)', 
                        border: '1.5px solid var(--bg-card-border-subtle)', 
                        borderRadius: '16px', 
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'transform 0.15s, border-color 0.15s'
                      }}
                    >
                      <div>
                        <span className="tag" style={{ fontSize: '11px', background: 'var(--yellow)', color: 'var(--ink)', fontWeight: 800, display: 'inline-block', marginBottom: '8px' }}>
                          {rel.category}
                        </span>
                        <h4 className="d" style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                          {rel.title}
                        </h4>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--bg-card-border)' }}>
                        <span className="d" style={{ fontSize: '14px', fontWeight: 800, color: rel.price === 0 ? 'var(--mint)' : 'var(--yellow)' }}>
                          {rel.price === 0 ? 'FREE' : `₹${rel.price}`}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--yellow)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                          View <ArrowRight size={12} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Transparent FAQ Card */}
            <div className="pop" style={{ 
              background: 'var(--bg-card)', 
              border: '2px solid var(--bg-card-border)', 
              borderRadius: '20px', 
              padding: '24px' 
            }}>
              <h3 className="d" style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginTop: 0, marginBottom: '16px' }}>
                Frequently Asked Questions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14.5px' }}>
                <div>
                  <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '4px' }}>
                    Q: How do I access my files after purchasing?
                  </strong>
                  <p className="mu" style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                    Your digital files unlock immediately upon verified payment and remain permanently accessible under your "My Purchases" vault.
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '4px' }}>
                    Q: Are future revisions to these notes included?
                  </strong>
                  <p className="mu" style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                    Yes! Any newly added company interview questions or updated diagrams are automatically available for re-download anytime.
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '4px' }}>
                    Q: Are there any recurring charges or subscriptions?
                  </strong>
                  <p className="mu" style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                    No. All materials are one-time payments with zero hidden fees and no automatic recurring billing.
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
            className="modal-content pop"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '480px', padding: '24px', background: 'var(--bg-card)', border: '2px solid var(--bg-card-border)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255, 138, 107, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--coral)' }}>
                <AlertTriangle size={22} color="var(--coral)" />
              </div>
              <div>
                <h3 className="d" style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Razorpay Configuration Required</h3>
              </div>
            </div>

            <p className="mu" style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              The backend received an authentication error when contacting Razorpay. Please verify your Razorpay API Key ID and Key Secret in your environment configuration.
            </p>

            <button
              onClick={() => setAuthErrorModalData(null)}
              className="btn btn-yellow"
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
