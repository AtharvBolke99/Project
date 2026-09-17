import React from 'react';
import { Link } from 'react-router-dom';
import { PlaySquare, Instagram, Heart, Shield, CheckCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <Link to="/" className="brand-logo" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <div className="brand-logo-icon">
                <PlaySquare size={20} strokeWidth={2.5} />
              </div>
              <span>CONCEPT<span style={{ color: 'var(--color-primary)' }}>IFYYY</span></span>
            </Link>
            <p style={{ maxWidth: '320px', fontSize: '0.9375rem', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--color-primary)' }}>"Don't just learn it. Understand it."</strong> Next-generation educational technology platform with interactive DSA visualizers, placement aptitude arena, and verified engineering resource marketplace.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <a 
                href="https://www.instagram.com/conceptifyyy/" 
                target="_blank" 
                rel="noreferrer" 
                className="btn-icon"
                title="Follow Conceptifyyy on Instagram (@conceptifyyy)"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(225, 48, 108, 0.25)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <Instagram size={18} color="#FFFFFF" strokeWidth={2.2} />
              </a>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                @conceptifyyy
              </span>
            </div>
          </div>

          {/* Practice Arenas */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Practice Arenas
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li><Link to="/dsa" style={{ color: 'var(--text-secondary)' }}>DSA Problem Arena</Link></li>
              <li><Link to="/visual-lab" style={{ color: 'var(--text-secondary)' }}>Interactive Visual Lab</Link></li>
              <li><Link to="/aptitude" style={{ color: 'var(--text-secondary)' }}>Campus Aptitude Arena</Link></li>
              <li><Link to="/aptitude/test" style={{ color: 'var(--text-secondary)' }}>Timed Aptitude Mock Tests</Link></li>
              <li><Link to="/learning-paths" style={{ color: 'var(--text-secondary)' }}>Engineering Roadmaps</Link></li>
              <li><Link to="/leaderboard" style={{ color: 'var(--text-secondary)' }}>Global Leaderboard</Link></li>
            </ul>
          </div>

          {/* Store & Projects */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Resources & Store
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li><Link to="/store" style={{ color: 'var(--text-secondary)' }}>Placement Handwritten Notes</Link></li>
              <li><Link to="/store?cat=Cheat+Sheets" style={{ color: 'var(--text-secondary)' }}>Algorithmic Cheat Sheets</Link></li>
              <li><Link to="/projects" style={{ color: 'var(--text-secondary)' }}>Full-Stack Major Projects</Link></li>
              <li><Link to="/store?cat=Placement+Bundles" style={{ color: 'var(--text-secondary)' }}>Ultimate Placement Pack</Link></li>
              <li><Link to="/my-purchases" style={{ color: 'var(--text-secondary)' }}>My Purchases Library</Link></li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Company & Legal
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li><Link to="/about" style={{ color: 'var(--text-secondary)' }}>About Conceptifyyy</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--text-secondary)' }}>Contact & Support</Link></li>
              <li><Link to="/privacy-policy" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Privacy Policy</Link></li>
              <li><Link to="/terms" style={{ color: 'var(--text-secondary)' }}>Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Refund & Cancellation</Link></li>
              <li><Link to="/shipping-policy" style={{ color: 'var(--text-secondary)' }}>Shipping & Delivery</Link></li>
              <li><Link to="/faq" style={{ color: 'var(--text-secondary)' }}>Help Center & FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* Razorpay Trust Strip */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem 1.25rem',
          background: 'rgba(79, 70, 229, 0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-primary)' }}>
              <Shield size={16} color="var(--color-primary)" /> Verified Razorpay Merchant
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={15} color="var(--color-emerald)" /> PCI-DSS Level 1 Compliant
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={15} color="var(--color-cyan)" /> 256-Bit SSL Bank Encryption
            </span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>100% Secure Digital Payments via UPI, Cards & Net Banking</span>
        </div>

        {/* Bottom copyright */}
        <div className="footer-bottom" style={{ marginTop: '1.5rem' }}>
          <div>
            © {new Date().getFullYear()} CONCEPTIFYYY EdTech Private Limited. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Link to="/privacy-policy" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'var(--text-muted)' }}>Terms</Link>
            <Link to="/refund-policy" style={{ color: 'var(--text-muted)' }}>Refund Policy</Link>
            <Link to="/shipping-policy" style={{ color: 'var(--text-muted)' }}>Shipping</Link>
            <Link to="/contact" style={{ color: 'var(--text-muted)' }}>Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
