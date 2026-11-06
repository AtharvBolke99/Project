import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, ShieldCheck, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ background: '#5B3DF5', color: '#FFFFFF', borderTop: '2px solid #1B1740' }}>
      <div className="wrap" style={{ paddingTop: '56px', paddingBottom: '36px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between', fontSize: '15px' }}>
          
          {/* Brand Vision */}
          <div style={{ maxWidth: '340px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
                <rect x="1" y="1" width="32" height="32" rx="10" fill="#FFFFFF" stroke="#1B1740" strokeWidth="2"></rect>
                <path d="M10 9h11a3 3 0 0 1 3 3v13H13a3 3 0 0 1-3-3V9z" fill="none" stroke="#5B3DF5" strokeWidth="2"></path>
                <path d="M14 15h6M14 19h4" stroke="#FFC933" strokeWidth="2" strokeLinecap="round"></path>
              </svg>
              <span className="d" style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF' }}>Conceptifyyy</span>
            </div>
            <p style={{ color: '#EDE9FF', fontSize: '16px', lineHeight: 1.6, marginBottom: '18px' }}>
              Where every concept becomes clear. India's student-curated marketplace for verified notes, cheat sheets, and full-stack project source codes.
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <a 
                href="https://www.instagram.com/conceptifyyy/" 
                target="_blank" 
                rel="noreferrer" 
                className="btn y btn-sm"
                style={{ padding: '0 14px', minHeight: '36px', gap: '6px' }}
                title="Follow Conceptifyyy on Instagram"
              >
                <Instagram size={16} />
                <span>@conceptifyyy</span>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            {/* Explore */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <b style={{ color: '#FFC933', fontSize: '16px', fontFamily: 'var(--font-display)' }}>Explore Resources</b>
              <Link to="/store" style={{ color: '#FFFFFF' }}>All Notes & Books</Link>
              <Link to="/store?category=DSA+Notes" style={{ color: '#FFFFFF' }}>DSA Placement Guide</Link>
              <Link to="/store?category=Aptitude+Notes" style={{ color: '#FFFFFF' }}>Aptitude Mastery</Link>
              <Link to="/store?category=Projects" style={{ color: '#FFFFFF' }}>Full-Stack MERN Projects</Link>
              <Link to="/store?search=Python" style={{ color: '#FFFFFF' }}>Python & MySQL Notes</Link>
            </div>

            {/* Student Library */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <b style={{ color: '#FFC933', fontSize: '16px', fontFamily: 'var(--font-display)' }}>Student Library</b>
              <Link to="/my-purchases" style={{ color: '#FFFFFF' }}>My Download Vault</Link>
              <Link to="/about" style={{ color: '#FFFFFF' }}>About Conceptifyyy</Link>
              <Link to="/faq" style={{ color: '#FFFFFF' }}>Help Centre & FAQ</Link>
              <Link to="/contact" style={{ color: '#FFFFFF' }}>Contact Support</Link>
            </div>

            {/* Legal Compliance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <b style={{ color: '#FFC933', fontSize: '16px', fontFamily: 'var(--font-display)' }}>Merchant Info</b>
              <Link to="/privacy-policy" style={{ color: '#FFFFFF' }}>Privacy Policy</Link>
              <Link to="/terms" style={{ color: '#FFFFFF' }}>Terms & Conditions</Link>
              <Link to="/refund-policy" style={{ color: '#FFFFFF' }}>Refund & Cancellation</Link>
              <Link to="/shipping-policy" style={{ color: '#FFFFFF' }}>Instant Delivery Policy</Link>
            </div>
          </div>

        </div>

        {/* Razorpay Trust Badge */}
        <div style={{
          marginTop: '36px',
          padding: '12px 20px',
          background: 'rgba(27, 23, 64, 0.35)',
          border: '2px solid rgba(255, 255, 255, 0.25)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '13px',
          color: '#EDE9FF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#FFC933" />
            <span>Official Razorpay Partner Merchant & 256-Bit Encrypted Payments</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} color="#19C8A0" />
            <span>Instant Digital Access Upon Payment Completion</span>
          </div>
        </div>

        {/* Massive Brand Watermark from Reference */}
        <div 
          className="d" 
          style={{ 
            fontSize: 'clamp(48px, 13vw, 170px)', 
            fontWeight: 800, 
            lineHeight: 0.95, 
            marginTop: '40px', 
            color: '#FFC933', 
            whiteSpace: 'nowrap', 
            overflow: 'hidden',
            userSelect: 'none'
          }}
        >
          Conceptifyyy
        </div>

        <div style={{ marginTop: '20px', fontSize: '13px', color: '#D9D3FF', textAlign: 'center' }}>
          © {new Date().getFullYear()} Conceptifyyy. All rights reserved. Made for engineering and university students across India.
        </div>
      </div>
    </footer>
  );
};
