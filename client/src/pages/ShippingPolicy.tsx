import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, CheckCircle2, Zap, ArrowLeft, Mail, Clock } from 'lucide-react';

export const ShippingPolicy: React.FC = () => {
  return (
    <div className="page-wrapper animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '860px' }}>
        
        {/* Back Link */}
        <Link to="/" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(14, 165, 233, 0.08)', borderRadius: 'var(--radius-full)', color: 'var(--color-cyan)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
            <Zap size={16} />
            <span>Instant Digital Delivery</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Shipping & Delivery Policy
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            <strong>Effective Date:</strong> September 07, 2026 | Electronic fulfillment details for digital learning resources.
          </p>
        </div>

        {/* Digital Goods Notice */}
        <div className="card glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', borderLeft: '4px solid var(--color-cyan)', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(79, 70, 229, 0.03) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <CheckCircle2 size={22} color="var(--color-cyan)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              100% Digital Delivery — Zero Physical Shipping
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>
            All products and services hosted on <strong>CONCEPTIFYYY</strong> (including DSA placement notes, algorithms cheat sheets, full-stack capstone projects, and visual learning tools) are <strong>digital products</strong>. We do not dispatch or ship physical packages.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.75' }}>
          
          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              1. Delivery Timeline & Fulfillment
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Delivery is instantaneous:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Instant Dashboard Access:</strong> Immediately upon successful transaction confirmation through Razorpay, your purchased resources are unlocked in your account dashboard under <Link to="/my-purchases" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>My Purchases</Link>.</li>
              <li><strong>Automated Email Confirmation:</strong> A purchase confirmation containing download links and your official receipt is automatically dispatched to your registered email address within <strong>5 minutes</strong>.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              2. Shipping Charges
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Because all products are delivered electronically via cloud servers, <strong>there are no shipping, handling, or courier fees</strong>. The price listed at checkout is the complete and final price.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              3. Delivery Troubleshooting & Support
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              If you experience any delay in receiving your confirmation email or accessing your purchased content after a successful Razorpay transaction:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Check your email's spam/junk or promotions folder.</li>
              <li>Log in to CONCEPTIFYYY and visit <Link to="/my-purchases" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>My Purchases</Link> to download directly.</li>
              <li>Contact our 24/7 technical team at <a href="mailto:support@conceptifyyy.com" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>support@conceptifyyy.com</a> with your Razorpay Payment ID. We resolve fulfillment issues within 2 business hours.</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
};
export default ShippingPolicy;
