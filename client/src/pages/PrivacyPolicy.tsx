import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, Mail, Building2, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
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
            <ShieldCheck size={16} />
            <span>Legal & Privacy Compliance</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            <strong>Effective & Last Updated:</strong> September 07, 2026 | Compliant with the Information Technology Act 2000, SPDI Rules 2011, and Digital Personal Data Protection (DPDP) Act 2023.
          </p>
        </div>

        {/* Razorpay Trust Highlight Box */}
        <div className="card glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid var(--color-primary)', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(14, 165, 233, 0.03) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <CreditCard size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Payment Processing Security & Razorpay Compliance
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
            CONCEPTIFYYY does not store, capture, or have access to your sensitive financial credentials (such as full credit/debit card numbers, CVVs, or Net Banking credentials). All electronic payments are processed through <strong>Razorpay Software Private Limited</strong>, an RBI-authorized, PCI-DSS Level 1 compliant payment aggregator with 256-bit bank-grade encryption.
          </p>
        </div>

        {/* Policy Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.75' }}>
          
          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              1. Introduction & Corporate Entity
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              This Privacy Policy applies to the web platform operated under the brand name <strong>CONCEPTIFYYY</strong> ("we", "us", or "our"), with registered corporate operations at Conceptifyyy EdTech Private Limited, Pune, Maharashtra, India. We are committed to safeguarding the privacy and personal data of our users ("you", "your", "learner").
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              2. Information We Collect
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              We collect information to provide and enhance our educational services, manage user profiles, and fulfill purchase transactions:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Personal Identity Information:</strong> Full name, email address, password hashes (bcrypt salt), and academic/college background if provided.</li>
              <li><strong>Billing & Transaction Information:</strong> Order ID, product details, purchase date, payment status, and transaction references returned by Razorpay. We do not store raw card numbers.</li>
              <li><strong>Learning & Platform Activity:</strong> Algorithmic problems solved, visualizer interactions, aptitude test scores, bookmarked questions, and leaderboard standing.</li>
              <li><strong>Technical & Log Data:</strong> Internet Protocol (IP) address, browser type, operating system, device identifiers, and session timestamps.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              3. Purpose & Legal Basis for Data Use
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              We use the collected personal information solely for legitimate educational and platform administration purposes:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>To provide access to interactive DSA visualizers, aptitude question banks, and learning roadmaps.</li>
              <li>To fulfill purchases of digital notes, cheat sheets, and source code repositories.</li>
              <li>To communicate transactional receipts, password resets, and customer service updates.</li>
              <li>To maintain system integrity, detect fraudulent activities, and prevent unauthorized scraping.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              4. Payment Gateway & Third-Party Service Providers
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              We partner with trusted third-party providers to operate our application:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Razorpay Software Private Limited:</strong> Our payment gateway provider. Razorpay adheres to standards set by PCI-DSS (Payment Card Industry Data Security Standard) managed by the PCI Security Standards Council. For more details, consult Razorpay's privacy policy at <a href="https://razorpay.com/privacy/" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>razorpay.com/privacy</a>.</li>
              <li><strong>Cloud Hosting & CDN:</strong> Secure server infrastructure maintaining encrypted database stores.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              5. Cookies & Local Storage
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              CONCEPTIFYYY uses session tokens (JWT) stored in browser local storage / secure cookies solely to preserve user login sessions and theme preferences across page refreshes. We do not sell or monetize browsing data with external ad networks.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              6. Data Security & Storage
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              We deploy industry-standard technical safeguards, including 256-bit Transport Layer Security (TLS/SSL) encryption for all client-server communications, salted password hashing, and role-based access control (RBAC). In the event of a security breach, affected users will be notified as mandated by Indian cybersecurity regulations.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              7. User Rights under DPDP Act 2023
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Subject to applicable law, you have the right to request access to your personal data, request correction of inaccurate records, request deletion of your account and associated history, or withdraw consent at any time by emailing our support desk.
            </p>
          </section>

          {/* Grievance Redressal Section (Mandatory for Razorpay & IT Act) */}
          <section className="card glass-card" style={{ padding: '1.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={20} color="var(--color-primary)" />
              8. Grievance Redressal Officer (IT Act Compliance)
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              In accordance with the Information Technology Act, 2000 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the name and contact details of our Grievance Officer are published below:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '8px', fontSize: '0.875rem' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Officer Name:</strong>
                <span style={{ color: 'var(--text-secondary)' }}>Grievance Officer, Conceptifyyy</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Email Address:</strong>
                <a href="mailto:grievance@conceptifyyy.com" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>grievance@conceptifyyy.com</a>
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Registered Address:</strong>
                <span style={{ color: 'var(--text-secondary)' }}>Conceptifyyy EdTech, Hinjawadi Phase 1, Pune, Maharashtra 411057, India</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Response Timelines:</strong>
                <span style={{ color: 'var(--text-secondary)' }}>Acknowledgment within 48 hours; resolution within 30 days.</span>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              9. Contact Us
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              For general privacy inquiries or questions regarding this policy, reach us via our <Link to="/contact" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Contact Page</Link> or email <a href="mailto:support@conceptifyyy.com" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>support@conceptifyyy.com</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};
export default PrivacyPolicy;
