import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Download, Home as HomeIcon } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div style={{ padding: '4rem 1.5rem 6rem', background: 'var(--bg-cosmic)' }}>
      <div className="wrap" style={{ maxWidth: '680px', textAlign: 'center' }}>
        <div 
          className="pop" 
          style={{ 
            borderRadius: '28px', 
            padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)' 
          }}
        >
          {/* 404 Chip */}
          <div style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
            <span className="tag" style={{ background: 'var(--coral)', color: 'var(--ink)', fontWeight: 800, fontSize: '14px', padding: '6px 14px' }}>
              ✦ ERROR 404
            </span>
          </div>

          <h1 className="d" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.05, marginBottom: '1rem', color: '#FFFFFF' }}>
            Oops! That page <br />
            <span style={{ color: 'var(--yellow)', fontStyle: 'italic' }}>got lost in orbit.</span>
          </h1>

          <p className="mu" style={{ fontSize: '16px', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 2.25rem', color: 'var(--text-muted)' }}>
            The link you followed doesn't exist, has moved, or was mistyped. All your verified study notes and projects are right here in the store.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <Link to="/store" className="btn btn-yellow btn-lg" style={{ gap: '8px' }}>
              <ShoppingBag size={18} /> Explore The Store
            </Link>
            <Link to="/my-purchases" className="btn btn-dark btn-lg" style={{ gap: '8px' }}>
              <Download size={18} /> My Download Vault
            </Link>
            <Link to="/" className="btn btn-dark btn-lg" style={{ gap: '8px' }}>
              <HomeIcon size={18} /> Home
            </Link>
          </div>

          {/* Quick Shortcuts */}
          <div style={{ borderTop: '1px solid var(--bg-card-border)', paddingTop: '1.75rem' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
              Quick Jumps to Popular Subjects:
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/store?category=DSA+Notes" className="tag" style={{ background: 'rgba(255,255,255,0.08)' }}>DSA Notes</Link>
              <Link to="/store?category=Aptitude+Notes" className="tag" style={{ background: 'rgba(255,255,255,0.08)' }}>Aptitude Prep</Link>
              <Link to="/store?search=Python" className="tag" style={{ background: 'rgba(255,255,255,0.08)' }}>Python Mastery</Link>
              <Link to="/store?search=MySQL" className="tag" style={{ background: 'rgba(255,255,255,0.08)' }}>MySQL Notes</Link>
              <Link to="/store?category=Projects" className="tag" style={{ background: 'rgba(255,255,255,0.08)' }}>MERN Projects</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotFound;
