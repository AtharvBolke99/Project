import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';

export const RefundPolicy: React.FC = () => {
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
              ✦ RAZORPAY MERCHANT COMPLIANCE
            </span>
          </div>

          <h1 className="d" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.25rem)', lineHeight: 1.15, marginBottom: '0.5rem' }}>
            Cancellation & Refund Policy
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
            <strong>Effective Date:</strong> September 07, 2026 | Transparency, fair trade, and learner satisfaction are our top commitments.
          </p>
        </div>

        {/* Quick Refund Guarantee Box */}
        <div className="pop" style={{ background: 'var(--mint-soft)', padding: '1.75rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <CheckCircle2 size={24} color="var(--mint)" />
            <h3 className="d" style={{ fontSize: '1.25rem', margin: 0, color: 'var(--ink)' }}>
              7-Day Learner Satisfaction Guarantee
            </h3>
          </div>
          <p style={{ color: 'var(--ink)', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>
            We want you to be completely satisfied with your learning resources. If you purchase any handwritten notes, algorithmic cheat sheets, or interview preparation guides and find they do not meet expectations, you can request a <strong>full 100% refund within 7 calendar days</strong> of purchase.
          </p>
        </div>

        {/* Policy Details */}
        <div className="pop" style={{ background: '#FFFFFF', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>1. Eligibility for Refunds</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: '0 0 0.75rem' }}>
              Refund requests are honored under the following straightforward conditions:
            </p>
            <ul style={{ color: 'var(--muted)', lineHeight: '1.7', paddingLeft: '1.5rem', margin: 0 }}>
              <li>The refund request is initiated within <strong>7 days</strong> from the official transaction timestamp.</li>
              <li>Accidental duplicate payments or double charges for the same digital item.</li>
              <li>Technical failures where payment succeeded via Razorpay but digital download access failed to unlock within your dashboard.</li>
            </ul>
          </section>

          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>2. Refund Turnaround Time & Method (Razorpay Processing)</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: '0 0 1rem' }}>
              All approved refunds are credited back directly through our payment gateway (Razorpay) to the <strong>original payment method</strong> used during the transaction:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'var(--lavender)', padding: '1rem', borderRadius: '12px', border: '2px solid var(--ink)' }}>
                <strong style={{ color: 'var(--purple)', display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>UPI & Net Banking</strong>
                <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Typically credited within <strong>24 to 48 business hours</strong>.</span>
              </div>
              <div style={{ background: 'var(--lavender)', padding: '1rem', borderRadius: '12px', border: '2px solid var(--ink)' }}>
                <strong style={{ color: 'var(--purple)', display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Credit & Debit Cards</strong>
                <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Credited within <strong>5 to 7 business days</strong> as per card network timelines.</span>
              </div>
              <div style={{ background: 'var(--lavender)', padding: '1rem', borderRadius: '12px', border: '2px solid var(--ink)' }}>
                <strong style={{ color: 'var(--purple)', display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Digital Wallets</strong>
                <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Credited within <strong>24 hours</strong> back to the respective wallet.</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>3. How to Request a Refund</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: '0 0 0.75rem' }}>
              To initiate a refund, simply send an email to <a href="mailto:conceptifyyy@gmail.com" style={{ color: 'var(--purple)', fontWeight: 700 }}>conceptifyyy@gmail.com</a> with the following details:
            </p>
            <ul style={{ color: 'var(--muted)', lineHeight: '1.7', paddingLeft: '1.5rem', margin: 0 }}>
              <li>Your registered account email address.</li>
              <li>Order ID and Razorpay Payment ID (found on your email receipt or in <Link to="/my-purchases" style={{ color: 'var(--purple)', fontWeight: 600 }}>My Purchases</Link>).</li>
              <li>A brief description of why you are requesting a refund.</li>
            </ul>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', marginTop: '0.75rem' }}>
              Our support team acknowledges all refund requests within <strong>24 hours</strong> and initiates processing immediately upon verification.
            </p>
          </section>

          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>4. Cancellation of Orders</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: 0 }}>
              Because digital items are provisioned automatically immediately upon transaction confirmation, traditional pre-shipment order cancellations do not apply. However, our 7-day refund guarantee gives you complete peace of mind to inspect the materials.
            </p>
          </section>

          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>5. Contact Customer Support</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: 0 }}>
              For any questions regarding billing or refund status, contact our support desk directly at <a href="mailto:conceptifyyy@gmail.com" style={{ color: 'var(--purple)', fontWeight: 700 }}>conceptifyyy@gmail.com</a> or via our <Link to="/contact" style={{ color: 'var(--purple)', fontWeight: 600 }}>Contact Page</Link>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};

export default RefundPolicy;
