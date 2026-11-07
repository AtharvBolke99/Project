import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Menu, 
  X,
  LogOut, 
  ShieldCheck, 
  Download,
  Sparkles,
  User,
  LogIn
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
    { label: 'How it works', path: '/#how-it-works' },
    { label: 'Features', path: '/#features' },
    { label: 'Subjects', path: '/store' },
    { label: 'My Vault', path: '/my-purchases' }
  ];

  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 900, width: '100%', background: 'rgba(10, 9, 21, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="wrap" style={{ paddingTop: '16px', paddingBottom: '16px' }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: '20px' 
            }}
          >
            {/* Logo from Reference (Glowing Planet System) */}
            <Link 
              to="/" 
              className="d" 
              style={{ 
                fontSize: '22px', 
                fontWeight: 800, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                color: '#FFFFFF', 
                textDecoration: 'none' 
              }}
            >
              {/* Planetary Concept Icon */}
              <div style={{ position: 'relative', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'var(--yellow)', boxShadow: '0 0 12px rgba(255, 201, 51, 0.8)' }}></div>
                <div style={{ position: 'absolute', width: '5px', height: '5px', borderRadius: '50%', background: 'var(--mint)', top: '1px', right: '2px' }}></div>
                <div style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--coral)', bottom: '2px', left: '1px' }}></div>
                <div style={{ position: 'absolute', width: '3px', height: '3px', borderRadius: '50%', background: '#FFFFFF', bottom: '0px', right: '4px' }}></div>
              </div>
              <span>Conceptifyyy</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="desktop-only">
              <ul style={{ display: 'flex', alignItems: 'center', gap: '32px', fontSize: '14px', fontWeight: 600, listStyle: 'none', margin: 0, padding: 0 }}>
                {navLinks.map(link => {
                  const active = isActive(link.path);
                  return (
                    <li key={link.path}>
                      <a
                        href={link.path}
                        onClick={(e) => {
                          if (link.path.startsWith('/#')) {
                            if (location.pathname === '/') {
                              e.preventDefault();
                              const targetId = link.path.replace('/#', '');
                              document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }
                        }}
                        style={{
                          color: active ? '#FFFFFF' : 'var(--text-muted)',
                          textDecoration: 'none',
                          transition: 'color 0.15s ease'
                        }}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}

                {isAdmin && (
                  <li>
                    <Link
                      to="/admin"
                      style={{
                        color: 'var(--yellow)',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isAuthenticated && user ? (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsUserMenuOpen(prev => !prev)}
                    className="btn btn-dark"
                    style={{
                      minHeight: '40px',
                      padding: '4px 14px 4px 6px',
                      gap: '8px',
                      fontSize: '14px',
                      borderRadius: '999px'
                    }}
                  >
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                      alt={user.name}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid var(--yellow)' }}
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
                        background: 'var(--bg-card)',
                        borderRadius: '20px',
                        padding: '12px',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        border: '2px solid var(--bg-card-border-subtle)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                      }}
                    >
                      <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--bg-card-border)' }}>
                        <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</div>
                      </div>

                      <Link
                        to="/my-purchases"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn btn-dark btn-sm"
                        style={{ width: '100%', justifyContent: 'flex-start' }}
                      >
                        <Download size={15} /> My Purchased Notes
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin/products"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="btn btn-dark btn-sm"
                          style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--yellow)' }}
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
                        className="btn btn-dark btn-sm"
                        style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--coral)' }}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="btn btn-dark desktop-only"
                    style={{
                      minHeight: '40px',
                      padding: '0 18px',
                      fontSize: '14px'
                    }}
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="btn btn-yellow"
                    style={{
                      minHeight: '40px',
                      padding: '0 20px',
                      fontSize: '14px'
                    }}
                  >
                    Start free
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
            background: 'rgba(10, 9, 21, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              width: '84%',
              maxWidth: '340px',
              height: '100%',
              background: 'var(--bg-cosmic-alt)',
              borderLeft: '2px solid var(--bg-card-border)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--bg-card-border)' }}>
                <Link to="/" onClick={() => setIsMobileDrawerOpen(false)} className="d" style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--yellow)', boxShadow: '0 0 10px var(--yellow)' }}></div>
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
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="btn btn-dark"
                    style={{
                      justifyContent: 'flex-start',
                      width: '100%',
                      background: isActive(link.path) ? 'var(--bg-card)' : 'transparent',
                      color: '#FFFFFF'
                    }}
                  >
                    <span>{link.label}</span>
                  </a>
                ))}

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="btn btn-yellow"
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                  >
                    <ShieldCheck size={18} />
                    <span>Admin CMS Portal</span>
                  </Link>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--bg-card-border)', paddingTop: '1.25rem' }}>
              {!isAuthenticated ? (
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    onOpenAuth('login');
                  }}
                  className="btn btn-yellow"
                  style={{ width: '100%' }}
                >
                  <LogIn size={16} /> Sign In
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    logout();
                  }}
                  className="btn btn-dark"
                  style={{ width: '100%', color: 'var(--coral)' }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
