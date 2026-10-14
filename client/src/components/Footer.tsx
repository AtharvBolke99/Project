import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Instagram, Shield, CheckCircle, Mail, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', padding: '3.5rem 0 2rem' }}>
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <Link to="/" className="brand-logo" style={{ marginBottom: '1rem', display: 'inline-flex', textDecoration: 'none' }}>
              <div 
                className="brand-logo-icon" 
                style={{ 
                  background: 'var(--gradient-brand)', 
                  color: '#FFFFFF', 
                  borderRadius: '10px', 
                  width: '32px', 
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ShoppingBag size={18} strokeWidth={2.4} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                CONCEPT<span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IFYYY</span>
              </span>
            </Link>
            <p style={{ maxWidth: '320px', fontSize: '0.9rem', marginBottom: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--color-primary)' }}>"Don't just learn it. Understand it."</strong> Premium handwritten placement notes, interview cheat sheets, and production-ready MERN project source code.
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
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(225, 48, 108, 0.25)'
                }}
              >
                <Instagram size={18} color="#FFFFFF" strokeWidth={2.2} />
              </a>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                @conceptifyyy
              </span>
            </div>
          </div>

          {/* Store Categories */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Store Catalog
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', padding: 0, margin: 0 }}>
              <li><Link to="/?category=Python" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Python Complete Course PDF</Link></li>
              <li><Link to="/?category=MySQL" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>MySQL & DBMS Revision Notes</Link></li>
              <li><Link to="/?category=Aptitude" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Aptitude Speed Formula Pack</Link></li>
              <li><Link to="/?category=Placement+Bundles" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>92+ ATS Resume Template</Link></li>
              <li><Link to="/?category=Projects" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Real Estate Marketplace (MERN)</Link></li>
              <li><Link to="/?category=Projects" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Helpora Service Booking (MERN)</Link></li>
            </ul>
          </div>

          {/* My Library & Help */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Customer Library
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', padding: 0, margin: 0 }}>
              <li><Link to="/my-purchases" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>My Download Vault</Link></li>
              <li><Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About the Notes</Link></li>
              <li><Link to="/faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Download Help & FAQ</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact & Instant Support</Link></li>
            </ul>
          </div>

          {/* Legal Compliance & Razorpay */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Legal & Merchant Info
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', padding: 0, margin: 0 }}>
              <li><Link to="/privacy-policy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</Link></li>
              <li><Link to="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Refund & Cancellation</Link></li>
              <li><Link to="/shipping-policy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Instant Delivery Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Razorpay Trust Strip */}
        <div style={{
          marginTop: '2.5rem',
          padding: '1rem 1.25rem',
          background: 'var(--gradient-brand-subtle)',
          border: '1px solid var(--border-highlight)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8125rem',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={15} color="var(--color-primary)" />
            <span>Support: support@conceptifyyy.com</span>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} CONCEPTIFYYY Digital Store. All rights reserved.
          </div>
          <div>
            Official digital downloads powered by Razorpay.
          </div>
        </div>
      </div>
    </footer>
  );
};
