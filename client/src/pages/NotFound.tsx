import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Download, Home as HomeIcon } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div style={{ padding: '4rem 1.5rem 6rem' }}>
      <div className="wrap" style={{ maxWidth: '680px', textAlign: 'center' }}>
        <div 
          className="pop" 
          style={{ 
            background: '#FFFFFF', 
            borderRadius: '28px', 
            padding: ' clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)' 
          }}
        >
          {/* 404 Chip */}
          <div style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
            <span className="chip" style={{ background: '#FF8A6B', fontSize: '18px', transform: 'rotate(-3deg)' }}>
              ✦ ERROR 404
            </span>
          </div>

          <h1 className="d" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.05, marginBottom: '1rem' }}>
            Oops! That page <br />
            <span style={{ color: 'var(--purple)' }}>got lost in the code.</span>
          </h1>

          <p className="mu" style={{ fontSize: '17px', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 2.25rem' }}>
            The link you followed doesn't exist, has moved, or was mistyped. Don't worry — all your verified study notes and projects are right where you left them.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <Link to="/store" className="btn v btn-lg" style={{ gap: '8px' }}>
              <ShoppingBag size={18} /> Explore The Store
            </Link>
            <Link to="/my-purchases" className="btn y btn-lg" style={{ gap: '8px' }}>
              <Download size={18} /> My Download Vault
            </Link>
            <Link to="/" className="btn btn-lg" style={{ gap: '8px' }}>
              <HomeIcon size={18} /> Home
            </Link>
          </div>

          {/* Quick Shortcuts */}
          <div style={{ borderTop: '2px solid var(--lavender-accent)', paddingTop: '1.75rem' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
              Quick Jumps to Popular Subjects:
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/store?category=DSA+Notes" className="tag" style={{ background: '#E3DDFF' }}>DSA Notes</Link>
              <Link to="/store?category=Aptitude+Notes" className="tag" style={{ background: '#C9F7E8' }}>Aptitude Prep</Link>
              <Link to="/store?search=Python" className="tag" style={{ background: '#FFE9A8' }}>Python Mastery</Link>
              <Link to="/store?search=MySQL" className="tag" style={{ background: '#FFD4C8' }}>MySQL Notes</Link>
              <Link to="/store?category=Projects" className="tag" style={{ background: '#FFFFFF' }}>MERN Projects</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotFound;
