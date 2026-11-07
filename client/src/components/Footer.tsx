import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, ShieldCheck, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ background: '#070611', color: '#FFFFFF', borderTop: '1px solid var(--bg-card-border)' }}>
      <div className="wrap" style={{ paddingTop: '56px', paddingBottom: '36px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between', fontSize: '14px' }}>
          
          {/* Brand Vision */}
          <div style={{ maxWidth: '340px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ position: 'relative', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'var(--yellow)', boxShadow: '0 0 12px rgba(255, 201, 51, 0.8)' }}></div>
                <div style={{ position: 'absolute', width: '5px', height: '5px', borderRadius: '50%', background: 'var(--mint)', top: '1px', right: '2px' }}></div>
                <div style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--coral)', bottom: '2px', left: '1px' }}></div>
              </div>
              <span className="d" style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>Conceptifyyy</span>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '18px' }}>
              Conceptifyyy empowers students with verified engineering notes, placement cheat sheets, and full-stack project repositories. Master core concepts and ace technical interviews.
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <a 
                href="https://www.instagram.com/conceptifyyy/" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-yellow btn-sm"
                style={{ padding: '0 14px', minHeight: '36px', gap: '6px' }}
                title="Follow Conceptifyyy on Instagram"
              >
                <Instagram size={15} />
                <span>@conceptifyyy</span>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            {/* Explore */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <b style={{ color: 'var(--yellow)', fontSize: '15px', fontFamily: 'var(--font-display)' }}>Explore Resources</b>
              <Link to="/store" style={{ color: 'var(--text-muted)' }}>All Notes & Books</Link>
              <Link to="/store?category=DSA+Notes" style={{ color: 'var(--text-muted)' }}>DSA Placement Guide</Link>
              <Link to="/store?category=Aptitude+Notes" style={{ color: 'var(--text-muted)' }}>Aptitude Mastery</Link>
              <Link to="/store?category=Projects" style={{ color: 'var(--text-muted)' }}>Full-Stack MERN Projects</Link>
              <Link to="/store?search=Python" style={{ color: 'var(--text-muted)' }}>Python & MySQL Notes</Link>
            </div>

            {/* Student Library */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <b style={{ color: 'var(--yellow)', fontSize: '15px', fontFamily: 'var(--font-display)' }}>Student Library</b>
              <Link to="/my-purchases" style={{ color: 'var(--text-muted)' }}>My Download Vault</Link>
              <Link to="/about" style={{ color: 'var(--text-muted)' }}>About Conceptifyyy</Link>
              <Link to="/faq" style={{ color: 'var(--text-muted)' }}>Help Centre & FAQ</Link>
              <Link to="/contact" style={{ color: 'var(--text-muted)' }}>Contact Support</Link>
            </div>

            {/* Legal Compliance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <b style={{ color: 'var(--yellow)', fontSize: '15px', fontFamily: 'var(--font-display)' }}>Merchant Info</b>
              <Link to="/privacy-policy" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
              <Link to="/terms" style={{ color: 'var(--text-muted)' }}>Terms & Conditions</Link>
              <Link to="/refund-policy" style={{ color: 'var(--text-muted)' }}>Refund & Cancellation</Link>
              <Link to="/shipping-policy" style={{ color: 'var(--text-muted)' }}>Instant Delivery Policy</Link>
            </div>
          </div>

        </div>

        {/* Razorpay Trust Badge */}
        <div style={{
          marginTop: '36px',
          padding: '12px 20px',
          background: 'rgba(18, 16, 42, 0.7)',
          border: '1px solid var(--bg-card-border)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '13px',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="var(--yellow)" />
            <span>Official Razorpay Partner Merchant · 256-Bit Encrypted Payments</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} color="var(--mint)" />
            <span>Instant Digital Access Upon Payment Completion</span>
          </div>
        </div>

        {/* Exact Tagline from Page 2 Screenshot */}
        <div 
          style={{ 
            marginTop: '32px', 
            textAlign: 'center', 
            fontSize: '13px', 
            color: 'var(--text-sub)',
            letterSpacing: '0.02em',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          Conceptifyyy · Learn the idea, not just the answer.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
