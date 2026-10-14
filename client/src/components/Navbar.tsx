import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Moon, 
  Sun, 
  User, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X,
  Sparkles,
  Download,
  FolderGit2,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/store')) return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: 'Store Catalog', path: '/', icon: ShoppingBag, badge: 'Live' },
    { label: 'My Purchases', path: '/my-purchases', icon: Download },
  ];

  return (
    <>
      <header className="navbar">
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="brand-logo" style={{ textDecoration: 'none' }}>
            <div 
              className="brand-logo-icon" 
              style={{ 
                background: 'var(--gradient-brand)', 
                color: '#FFFFFF', 
                borderRadius: '12px', 
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px'
              }}
            >
              <ShoppingBag size={20} strokeWidth={2.4} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                CONCEPT<span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IFYYY</span>
              </span>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-cyan)', textTransform: 'uppercase', marginTop: '2px' }}>
                Digital Notes & Projects
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-only">
            <ul className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '4px', listStyle: 'none', margin: 0, padding: 0 }}>
              {navLinks.map(link => {
                const IconComponent = link.icon;
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                      style={{ 
                        position: 'relative', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      <IconComponent size={16} />
                      <span>{link.label}</span>
                      {link.badge && (
                        <span style={{
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          background: 'var(--gradient-brand)',
                          color: '#FFFFFF',
                          padding: '1px 6px',
                          borderRadius: '6px',
                          textTransform: 'uppercase',
                          boxShadow: '0 2px 6px rgba(99, 102, 241, 0.3)'
                        }}>
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}

              {isAdmin && (
                <li>
                  <Link
                    to="/admin/products"
                    className="nav-link"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--color-cyan)',
                      textDecoration: 'none'
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>Admin CMS</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Dark / Light Theme Switcher */}
            <button
              className="btn-icon"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="var(--color-primary)" />}
            </button>

            {/* User Profile or Login */}
            {isAuthenticated && user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsUserMenuOpen(prev => !prev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '4px 12px 4px 6px',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    color: 'var(--text-primary)'
                  }}
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                    alt={user.name}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-card)' }}
                  />
                  <span className="navbar-user-name desktop-only" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {user.name.split(' ')[0]}
                  </span>
                  {isAdmin && (
                    <span className="badge badge-cyan desktop-only" style={{ fontSize: '0.65rem' }}>
                      ADMIN
                    </span>
                  )}
                </button>

                {isUserMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '44px',
                      width: '240px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '8px',
                      zIndex: 100,
                      animation: 'fadeIn 0.15s ease'
                    }}
                  >
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>{user.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>{user.email}</p>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{user.role}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '6px 0' }}>
                      <Link
                        to="/my-purchases"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn-secondary"
                        style={{ justifyContent: 'flex-start', border: 'none', padding: '8px 12px', fontSize: '0.85rem' }}
                      >
                        <ShoppingBag size={16} /> My Purchased Notes
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin/products"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="btn-secondary"
                          style={{
                            justifyContent: 'flex-start',
                            border: 'none',
                            padding: '8px 12px',
                            fontSize: '0.85rem',
                            color: 'var(--color-cyan)'
                          }}
                        >
                          <ShieldCheck size={16} /> Admin Products CMS
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="btn-secondary"
                        style={{
                          justifyContent: 'flex-start',
                          border: 'none',
                          padding: '8px 12px',
                          fontSize: '0.85rem',
                          color: 'var(--color-rose)',
                          width: '100%',
                          cursor: 'pointer'
                        }}
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="navbar-auth-buttons" style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onOpenAuth('login')}
                >
                  Log In
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenAuth('register')}
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Drawer Hamburger Button */}
            <button
              className="btn-icon mobile-only"
              onClick={() => setIsMobileDrawerOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>
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
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              width: '80%',
              maxWidth: '320px',
              height: '100%',
              background: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border-subtle)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="brand-logo-icon" style={{ width: '28px', height: '28px', background: 'var(--gradient-brand)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                    <ShoppingBag size={16} />
                  </div>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>CONCEPTIFYYY</strong>
                </div>
                <button
                  className="btn-icon"
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link
                  to="/"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="nav-link"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isActive('/') ? 'var(--gradient-brand-subtle)' : 'transparent',
                    color: isActive('/') ? 'var(--color-primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <ShoppingBag size={18} />
                  <span>Store Catalog</span>
                </Link>

                <Link
                  to="/my-purchases"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="nav-link"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isActive('/my-purchases') ? 'var(--gradient-brand-subtle)' : 'transparent',
                    color: isActive('/my-purchases') ? 'var(--color-primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <Download size={18} />
                  <span>My Purchases</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin/products"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="nav-link"
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      color: 'var(--color-cyan)',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <ShieldCheck size={18} />
                    <span>Admin Products CMS</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Bottom of drawer */}
            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              {isAuthenticated && user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                      alt={user.name}
                      style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', color: 'var(--color-rose)' }}
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      onOpenAuth('login');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%' }}
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      onOpenAuth('register');
                    }}
                    className="btn btn-primary btn-sm"
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
