import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, Scale, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const TermsConditions: React.FC = () => {
  return (
    <div className="page-wrapper animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '860px' }}>
        
        {/* Back Link */}
        <Link to="/" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(79, 70, 229, 0.08)', borderRadius: 'var(--radius-full)', color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
            <Scale size={16} />
            <span>Platform Agreement</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Terms & Conditions
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            <strong>Effective Date:</strong> September 07, 2026 | Governing the use of CONCEPTIFYYY and related educational services.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.75' }}>
          
          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              1. Acceptance of Terms
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              By accessing, browsing, registering for an account, or purchasing digital resources on <strong>CONCEPTIFYYY</strong>, you acknowledge that you have read, understood, and agreed to be bound by these Terms & Conditions, our Privacy Policy, and our Refund Policy. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              2. User Accounts & Security
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              When creating an account on CONCEPTIFYYY:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>You must provide accurate, complete, and current information.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
              <li>You must immediately notify us of any unauthorized use or security breach regarding your account.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              3. Payments, Pricing & Billing via Razorpay
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              All prices displayed on CONCEPTIFYYY are quoted in Indian Rupees (INR) or applicable international currencies. All digital purchases are processed via our authorized payment partner, <strong>Razorpay Software Private Limited</strong>.
            </p>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Upon successful payment authorization, the ordered digital resource or course tier is unlocked in your account immediately. We reserve the right to modify prices for digital goods at any time, provided that active orders remain unaffected.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              4. Intellectual Property & Digital License
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              All content on CONCEPTIFYYY, including interactive algorithm visualizers, handwritten engineering notes, practice aptitude tests, curriculum roadmaps, text, graphics, and code samples, is the intellectual property of Conceptifyyy EdTech Private Limited or licensed authors.
            </p>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Purchased notes, cheat sheets, and source code repositories are licensed for <strong>individual personal learning only</strong>. Redistribution, resale, public file-sharing, or commercial republishing is strictly prohibited and constitutes a copyright violation.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              5. Governing Law & Jurisdiction
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              These Terms & Conditions and any disputes arising out of transactions on CONCEPTIFYYY shall be governed by and construed in accordance with the laws of India. Any legal proceedings shall be subject to the exclusive jurisdiction of the competent courts in <strong>Pune, Maharashtra, India</strong>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              6. Contact Information
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              For questions concerning these Terms, reach us at <a href="mailto:support@conceptifyyy.com" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>support@conceptifyyy.com</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};
export default TermsConditions;
