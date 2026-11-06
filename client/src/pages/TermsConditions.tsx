import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowLeft } from 'lucide-react';

export const TermsConditions: React.FC = () => {
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
              ✦ PLATFORM AGREEMENT & TERMS
            </span>
          </div>

          <h1 className="d" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.25rem)', lineHeight: 1.15, marginBottom: '0.5rem' }}>
            Terms & Conditions
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
            <strong>Effective Date:</strong> September 07, 2026 | Governing the use of CONCEPTIFYYY and related digital educational services.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="pop" style={{ background: '#FFFFFF', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>1. Acceptance of Terms</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: 0 }}>
              By accessing, browsing, creating an account, or purchasing digital notes or projects on <strong>CONCEPTIFYYY</strong>, you acknowledge that you have read, understood, and agreed to be bound by these Terms & Conditions, our Privacy Policy, and our Refund Policy. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>2. User Accounts & Security</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: '0 0 0.75rem' }}>
              When creating an account on CONCEPTIFYYY:
            </p>
            <ul style={{ color: 'var(--muted)', lineHeight: '1.7', paddingLeft: '1.5rem', margin: 0 }}>
              <li>You must provide accurate, complete, and current information.</li>
              <li>You are solely responsible for maintaining the confidentiality of your login credentials.</li>
              <li>You must immediately notify us of any unauthorized use or security breach regarding your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>3. Payments, Pricing & Billing via Razorpay</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: '0 0 0.75rem' }}>
              All prices displayed on CONCEPTIFYYY are quoted in Indian Rupees (INR). All digital purchases are processed via our authorized payment partner, <strong>Razorpay Software Private Limited</strong>.
            </p>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: 0 }}>
              Upon successful payment authorization, the ordered digital resource or project repository is unlocked in your account immediately. We reserve the right to modify prices for digital goods at any time, provided that active orders remain unaffected.
            </p>
          </section>

          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>4. Intellectual Property & Digital License</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: '0 0 0.75rem' }}>
              All content on CONCEPTIFYYY, including handwritten engineering notes, interview preparation guides, exam cheat sheets, and full-stack project source codes, is the intellectual property of Conceptifyyy or verified contributing authors.
            </p>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: 0 }}>
              Purchased notes and materials are licensed strictly for <strong>individual personal learning only</strong>. Redistribution, resale, public file-sharing, or commercial republishing is strictly prohibited and constitutes a copyright violation.
            </p>
          </section>

          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>5. Governing Law & Jurisdiction</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: 0 }}>
              These Terms & Conditions and any disputes arising out of transactions on CONCEPTIFYYY shall be governed by and construed in accordance with the laws of India. Any legal proceedings shall be subject to the exclusive jurisdiction of the competent courts in <strong>Pune, Maharashtra, India</strong>.
            </p>
          </section>

          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>6. Contact Information</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: 0 }}>
              For questions concerning these Terms, reach us at <a href="mailto:conceptifyyy@gmail.com" style={{ color: 'var(--purple)', fontWeight: 700 }}>conceptifyyy@gmail.com</a>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};

export default TermsConditions;
