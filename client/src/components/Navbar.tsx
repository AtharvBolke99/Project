import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Menu, 
  X,
  LogOut, 
  ShieldCheck, 
  Download,
  FileText,
  FolderGit2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore Notes', path: '/store' },
    { label: 'Placement Prep', path: '/store?category=DSA+Notes' },
    { label: 'Projects', path: '/store?category=Projects' },
    { label: 'My Downloads', path: '/my-purchases' }
  ];

  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 900, width: '100%' }}>
        <div className="wrap" style={{ paddingTop: '16px', paddingBottom: '12px' }}>
          <div 
            className="pop" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: '16px', 
              background: '#FFFFFF', 
              borderRadius: '999px', 
              padding: '8px 12px 8px 20px',
              border: '2px solid var(--ink)',
              boxShadow: '5px 5px 0 var(--ink)'
            }}
          >
            {/* Logo */}
            <Link 
              to="/" 
              className="d" 
              style={{ 
                fontSize: '24px', 
                fontWeight: 800, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                color: 'var(--ink)', 
                textDecoration: 'none' 
              }}
            >
              <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
                <rect x="1" y="1" width="32" height="32" rx="10" fill="#5B3DF5" stroke="#1B1740" strokeWidth="2"></rect>
                <path d="M10 9h11a3 3 0 0 1 3 3v13H13a3 3 0 0 1-3-3V9z" fill="none" stroke="#fff" strokeWidth="2"></path>
                <path d="M14 15h6M14 19h4" stroke="#FFC933" strokeWidth="2" strokeLinecap="round"></path>
              </svg>
              <span>Conceptifyyy</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="desktop-only">
              <ul style={{ display: 'flex', gap: '22px', fontSize: '15px', fontWeight: 700, listStyle: 'none', margin: 0, padding: 0 }}>
                {navLinks.map(link => {
                  const active = isActive(link.path);
                  return (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        style={{
                          color: active ? 'var(--purple)' : 'var(--ink)',
                          textDecoration: active ? 'underline' : 'none',
                          textUnderlineOffset: '6px',
                          textDecorationThickness: '2px',
                          transition: 'color 0.15s ease'
                        }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}

                {isAdmin && (
                  <li>
                    <Link
                      to="/admin"
                      style={{
                        color: 'var(--purple)',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <ShieldCheck size={16} />
                      <span>Admin</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            {/* Right Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isAuthenticated && user ? (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsUserMenuOpen(prev => !prev)}
                    className="btn"
                    style={{
                      minHeight: '40px',
                      padding: '4px 14px 4px 6px',
                      gap: '8px',
                      fontSize: '14px',
                      borderRadius: '999px',
                      background: '#FFFFFF'
                    }}
                  >
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                      alt={user.name}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid var(--ink)' }}
                    />
                    <span className="desktop-only">{user.name.split(' ')[0]}</span>
                    {isAdmin && (
                      <span className="tag tag-yellow" style={{ fontSize: '10px', padding: '2px 8px' }}>
                        ADMIN
                      </span>
                    )}
                  </button>

                  {isUserMenuOpen && (
                    <div
                      className="pop"
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '48px',
                        width: '240px',
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        padding: '12px',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ padding: '6px 8px', borderBottom: '2px solid var(--lavender-accent)' }}>
                        <div style={{ fontWeight: 800, color: 'var(--ink)' }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{user.email}</div>
                      </div>

                      <Link
                        to="/my-purchases"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', justifyContent: 'flex-start' }}
                      >
                        <Download size={15} /> My Purchased Notes
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin/products"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="btn btn-secondary btn-sm"
                          style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--purple)' }}
                        >
                          <ShieldCheck size={15} /> Admin CMS Portal
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="btn btn-sm"
                        style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--coral)', background: '#FFF' }}
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="btn desktop-only"
                    style={{
                      boxShadow: 'none',
                      borderColor: 'transparent',
                      minHeight: '40px',
                      padding: '0 14px',
                      background: 'transparent',
                      fontWeight: 700
                    }}
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="btn v"
                    style={{
                      minHeight: '40px',
                      padding: '0 20px',
                      fontSize: '14px'
                    }}
                  >
                    Get started
                  </button>
                </div>
              )}

              {/* Mobile Drawer Hamburger */}
              <button
                className="btn-icon mobile-only"
                onClick={() => setIsMobileDrawerOpen(true)}
                aria-label="Open Navigation Menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer */}
      {isMobileDrawerOpen && (
        <div 
          onClick={() => setIsMobileDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(27, 23, 64, 0.6)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.15s ease'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="pop"
            style={{
              width: '84%',
              maxWidth: '340px',
              height: '100%',
              background: '#FFFFFF',
              borderRadius: '0',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'none',
              borderLeft: '3px solid var(--ink)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '2px solid var(--ink)' }}>
                <Link to="/" onClick={() => setIsMobileDrawerOpen(false)} className="d" style={{ fontSize: '22px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="28" height="28" viewBox="0 0 34 34" aria-hidden="true">
                    <rect x="1" y="1" width="32" height="32" rx="10" fill="#5B3DF5" stroke="#1B1740" strokeWidth="2"></rect>
                    <path d="M10 9h11a3 3 0 0 1 3 3v13H13a3 3 0 0 1-3-3V9z" fill="none" stroke="#fff" strokeWidth="2"></path>
                    <path d="M14 15h6M14 19h4" stroke="#FFC933" strokeWidth="2" strokeLinecap="round"></path>
                  </svg>
                  <span>Conceptifyyy</span>
                </Link>
                <button
                  className="btn-icon"
                  style={{ minWidth: '36px', minHeight: '36px', padding: '6px' }}
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="btn"
                    style={{
                      justifyContent: 'flex-start',
                      width: '100%',
                      background: isActive(link.path) ? 'var(--lavender-accent)' : '#FFFFFF',
                      color: 'var(--ink)'
                    }}
                  >
                    <span>{link.label}</span>
                  </Link>
                ))}

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="btn y"
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                  >
                    <ShieldCheck size={18} />
                    <span>Admin CMS Portal</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Bottom Auth Section */}
            <div style={{ paddingTop: '1.25rem', borderTop: '2px solid var(--ink)' }}>
              {isAuthenticated && user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                      alt={user.name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--ink)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '15px' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="btn c"
                    style={{ width: '100%' }}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      onOpenAuth('login');
                    }}
                    className="btn"
                    style={{ width: '100%' }}
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      onOpenAuth('register');
                    }}
                    className="btn v"
                    style={{ width: '100%' }}
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
