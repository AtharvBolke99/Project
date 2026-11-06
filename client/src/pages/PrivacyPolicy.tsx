import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, ArrowLeft } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
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
              ✦ LEGAL & PRIVACY COMPLIANCE
            </span>
          </div>

          <h1 className="d" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.25rem)', lineHeight: 1.15, marginBottom: '0.5rem' }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
            <strong>Effective & Last Updated:</strong> September 07, 2026 | Fully compliant with the Information Technology Act 2000, SPDI Rules 2011, and Digital Personal Data Protection (DPDP) Act 2023.
          </p>
        </div>

        {/* Razorpay Trust Highlight Box */}
        <div className="pop" style={{ background: 'var(--lavender-accent)', padding: '1.75rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <CreditCard size={22} color="var(--purple)" />
            <h3 className="d" style={{ fontSize: '1.2rem', margin: 0, color: 'var(--ink)' }}>
              Payment Processing Security & Razorpay Compliance
            </h3>
          </div>
          <p style={{ color: 'var(--ink)', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>
            CONCEPTIFYYY does not store, capture, or have access to your sensitive financial credentials (such as full credit/debit card numbers, CVVs, or Net Banking credentials). All electronic payments are processed through <strong>Razorpay Software Private Limited</strong>, an RBI-authorized, PCI-DSS Level 1 compliant payment aggregator with 256-bit bank-grade encryption.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="pop" style={{ background: '#FFFFFF', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>1. Introduction</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: 0 }}>
              Welcome to <strong>CONCEPTIFYYY</strong> ("we", "our", or "us"). We respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy governs the manner in which CONCEPTIFYYY collects, uses, maintains, and discloses information collected from users ("Learners", "Customers", "You") of our website and digital services.
            </p>
          </section>

          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>2. Information We Collect</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', marginBottom: '0.75rem' }}>
              We only collect information necessary to deliver educational digital goods and maintain your persistent download library:
            </p>
            <ul style={{ color: 'var(--muted)', lineHeight: '1.7', paddingLeft: '1.5rem', margin: 0 }}>
              <li><strong>Account Identifiers:</strong> Name, Email address, and password hash (salted using bcrypt).</li>
              <li><strong>Transaction Telemetry:</strong> Razorpay Order IDs, Payment IDs, amounts paid, currency, timestamp, and purchased product identifiers.</li>
              <li><strong>Vault Access Logs:</strong> Download timestamps and license keys for verification against unauthorized distribution.</li>
              <li><strong>Technical Metadata:</strong> IP address, device type, and browser user-agent collected solely for fraud detection and session security.</li>
            </ul>
          </section>

          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>3. How We Use Collected Information</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: 0 }}>
              Your personal information is used exclusively to:
              (a) Provision instant access to digital notes, study materials, and project files in your My Purchases vault;
              (b) Dispatch electronic order confirmations and download links to your registered email;
              (c) Validate Razorpay payment webhooks and cryptographic HMAC signatures;
              (d) Provide technical and academic customer support; and
              (e) Detect and prevent fraudulent transactions or copyright infringement.
            </p>
          </section>

          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>4. Zero Third-Party Data Selling</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: 0 }}>
              We do <strong>NOT</strong> sell, trade, rent, or lease your personal identifiable information to third parties, advertisers, marketing agencies, or data brokers under any circumstances.
            </p>
          </section>

          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>5. Data Retention & Security</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: 0 }}>
              All database records are stored in enterprise-grade persistent MongoDB databases with TLS 1.3 encryption in transit and AES-256 encryption at rest. Your account and purchase history remain accessible to ensure your perpetual download rights.
            </p>
          </section>

          <section>
            <h2 className="d" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>6. Contact & Grievance Officer</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', margin: 0 }}>
              In accordance with the Information Technology Act 2000 and rules made thereunder, any queries or grievances regarding data privacy should be addressed to:
              <br /><br />
              <strong>Privacy & Compliance Officer</strong><br />
              CONCEPTIFYYY Digital Education<br />
              Email: <a href="mailto:conceptifyyy@gmail.com" style={{ color: 'var(--purple)', fontWeight: 700 }}>conceptifyyy@gmail.com</a>
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
