import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ShippingPolicy: React.FC = () => {
  return (
    <div style={{ padding: '2rem 1.5rem 5rem' }}>
      <div className="wrap" style={{ maxWidth: '880px' }}>
        
        {/* Back Link */}
        <Link to="/" className="btn btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
            <span className="chip" style={{ background: 'var(--yellow)', transform: 'rotate(-2deg)' }}>
              ✦ INSTANT DIGITAL FULFILLMENT
            </span>
          </div>

          <h1 className="d" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.25rem)', lineHeight: 1.15, marginBottom: '0.5rem' }}>
            Shipping & Delivery Policy
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
            <strong>Effective Date:</strong> September 07, 2026 | Electronic fulfillment details for digital learning resources.
          </p>
        </div>

        {/* Digital Goods Notice */}
        <div className="pop" style={{ background: 'var(--lavender-accent)', padding: '1.75rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Zap size={22} color="var(--purple)" />
            <h3 className="d" style={{ fontSize: '1.25rem', margin: 0, color: 'var(--ink)' }}>
              100% Digital Delivery — Zero Physical Shipping
            </h3>
          </div>
          <p style={{ color: 'var(--ink)', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>
            All products and services hosted on <strong>CONCEPTIFYYY</strong> (including DSA placement notes, algorithms cheat sheets, full-stack capstone projects, and exam guides) are <strong>100% digital products</strong>. We do not dispatch or ship physical packages.
          </p>
        </div>

        {/* Details Card */}
        <div className="pop" style={{ background: '#FFFFFF', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>1. Delivery Timeline & Fulfillment</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: '0 0 0.75rem' }}>
              Delivery is instantaneous:
            </p>
            <ul style={{ color: 'var(--muted)', lineHeight: '1.7', paddingLeft: '1.5rem', margin: 0 }}>
              <li><strong>Instant Dashboard Access:</strong> Immediately upon successful transaction confirmation through Razorpay, your purchased resources are unlocked in your account dashboard under <Link to="/my-purchases" style={{ color: 'var(--purple)', fontWeight: 600 }}>My Purchases</Link>.</li>
              <li><strong>Automated Email Confirmation:</strong> A purchase confirmation containing download links and your official receipt is automatically dispatched to your registered email address within <strong>5 minutes</strong>.</li>
            </ul>
          </section>

          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>2. Shipping Charges</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: 0 }}>
              Because all products are delivered electronically via cloud servers, <strong>there are zero shipping, handling, or courier fees</strong>. The price listed at checkout is the complete and final price.
            </p>
          </section>

          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>3. Delivery Troubleshooting & Support</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: '0 0 0.75rem' }}>
              If you experience any delay in receiving your confirmation email or accessing your purchased content after a successful Razorpay transaction:
            </p>
            <ul style={{ color: 'var(--muted)', lineHeight: '1.7', paddingLeft: '1.5rem', margin: 0 }}>
              <li>Check your email's spam/junk or promotions folder.</li>
              <li>Log in to CONCEPTIFYYY and visit <Link to="/my-purchases" style={{ color: 'var(--purple)', fontWeight: 600 }}>My Purchases</Link> to download directly.</li>
              <li>Contact our team at <a href="mailto:conceptifyyy@gmail.com" style={{ color: 'var(--purple)', fontWeight: 700 }}>conceptifyyy@gmail.com</a> with your Razorpay Payment ID. We resolve fulfillment issues promptly.</li>
            </ul>
          </section>

        </div>

      </div>
    </div>
  );
};

export default ShippingPolicy;
