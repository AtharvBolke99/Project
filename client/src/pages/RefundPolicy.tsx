import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ShieldCheck, CheckCircle2, Clock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';

export const RefundPolicy: React.FC = () => {
  return (
    <div className="page-wrapper animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '860px' }}>
        
        {/* Back Link */}
        <Link to="/" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(5, 150, 105, 0.08)', borderRadius: 'var(--radius-full)', color: 'var(--color-emerald)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
            <RotateCcw size={16} />
            <span>Razorpay Merchant Compliance</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Cancellation & Refund Policy
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            <strong>Effective Date:</strong> September 07, 2026 | Transparency and learner satisfaction are our top priorities.
          </p>
        </div>

        {/* Quick Refund Guarantee Box */}
        <div className="card glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', borderLeft: '4px solid var(--color-emerald)', background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.05) 0%, rgba(14, 165, 233, 0.03) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <CheckCircle2 size={22} color="var(--color-emerald)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              7-Day Learner Satisfaction Guarantee
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>
            We want you to be completely satisfied with your learning resources. If you purchase any handwritten notes, algorithmic cheat sheets, or interview preparation guides and find they do not meet expectations, you can request a <strong>full 100% refund within 7 calendar days</strong> of purchase.
          </p>
        </div>

        {/* Policy Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.75' }}>
          
          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              1. Eligibility for Refunds
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Refund requests are honored under the following straightforward conditions:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>The refund request is initiated within <strong>7 days</strong> from the official transaction date and time.</li>
              <li>Accidental duplicate payments or double charges for the same digital item.</li>
              <li>Technical failures where payment succeeded via Razorpay but digital download access failed to unlock within your dashboard.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              2. Refund Turnaround Time & Method (Razorpay Processing)
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              All approved refunds are credited back directly through our payment gateway (Razorpay) to the <strong>original payment method</strong> used during the transaction:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--color-primary)', display: 'block', fontSize: '0.85rem' }}>UPI & Net Banking</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Typically credited within <strong>24 to 48 business hours</strong>.</span>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--color-primary)', display: 'block', fontSize: '0.85rem' }}>Credit & Debit Cards</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Credited within <strong>5 to 7 business days</strong> as per card network timelines.</span>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--color-primary)', display: 'block', fontSize: '0.85rem' }}>Digital Wallets</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Credited within <strong>24 hours</strong> back to the respective wallet.</span>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              3. How to Request a Refund
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              To initiate a refund, simply send an email to <a href="mailto:refunds@conceptifyyy.com" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>refunds@conceptifyyy.com</a> or <a href="mailto:support@conceptifyyy.com" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>support@conceptifyyy.com</a> with the following details:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Your registered account email address.</li>
              <li>Order ID and Razorpay Payment ID (found on your email receipt or in <Link to="/my-purchases" style={{ color: 'var(--color-primary)' }}>My Purchases</Link>).</li>
              <li>A brief explanation of why you are requesting a refund.</li>
            </ul>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Our support team acknowledges all refund requests within <strong>24 hours</strong> and completes processing immediately upon verification.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              4. Cancellation of Orders
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Because digital items are provisioned automatically immediately upon transaction confirmation, traditional pre-shipment order cancellations do not apply. However, our 7-day refund policy gives you complete peace of mind to test the materials and request a return if unsatisfied.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              5. Contact Customer Support
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              For questions regarding billing or refund status, contact our financial support desk directly at <a href="mailto:support@conceptifyyy.com" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>support@conceptifyyy.com</a> or via our <Link to="/contact" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Support Center</Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};
export default RefundPolicy;
