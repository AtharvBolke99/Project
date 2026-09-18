import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Code2, 
  BrainCircuit, 
  ShoppingBag, 
  Trophy, 
  Compass, 
  Search, 
  Moon, 
  Sun, 
  Bell, 
  User, 
  LogOut, 
  BookOpen, 
  FolderGit2, 
  ShieldCheck, 
  Menu, 
  X,
  PlaySquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { NotificationDropdown } from './NotificationDropdown';
import { GlobalSearchModal } from './GlobalSearchModal';

interface NavbarProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: 'DSA Arena', path: '/dsa', badge: 'Interactive' },
    { label: 'Visual Lab', path: '/visual-lab', badge: 'Lab' },
    { label: 'Aptitude', path: '/aptitude' },
    { label: 'Roadmaps', path: '/learning-paths' },
    { label: 'Store', path: '/store' },
  ];

  return (
    <>
      <header className="navbar">
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="brand-logo">
            <div className="brand-logo-icon">
              <PlaySquare size={20} strokeWidth={2.5} />
            </div>
            <span>CONCEPT<span style={{ color: 'var(--color-primary)' }}>IFYYY</span></span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav>
            <ul className="nav-links">
              {navLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                    style={{ position: 'relative' }}
                  >
                    {link.label}
                    {link.badge && (
                      <span style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-16px',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #4F46E5, #0EA5E9)',
                        color: '#FFFFFF',
                        padding: '1px 6px',
                        borderRadius: '6px',
                        textTransform: 'uppercase',
                        boxShadow: '0 2px 6px rgba(79, 70, 229, 0.3)'
                      }}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="nav-actions">
            {/* Global Search Button */}
            <button
              className="btn-icon"
              onClick={() => setIsSearchOpen(true)}
              title="Search Problems, Topics & Notes"
            >
              <Search size={18} />
            </button>

            {/* Notifications Toggle */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn-icon"
                onClick={() => setIsNotifOpen(prev => !prev)}
                title="Notifications"
              >
                <Bell size={18} />
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '7px',
                  height: '7px',
                  background: 'var(--color-primary)',
                  borderRadius: '50%'
                }} />
              </button>
              {isNotifOpen && <NotificationDropdown onClose={() => setIsNotifOpen(false)} />}
            </div>

            {/* Dark / Light Theme Switcher */}
            <button
              className="btn-icon"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
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
                  <span className="navbar-user-name desktop-only" style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
                  <span className="navbar-user-xp desktop-only" style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    background: '#EEF2FF',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {user.xp} XP
                  </span>
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
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{user.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{user.role}</span>
                        <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>🔥 {user.streak}d Streak</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '6px 0' }}>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn-secondary"
                        style={{ justifyContent: 'flex-start', border: 'none', padding: '8px 12px', fontSize: '0.85rem' }}
                      >
                        <User size={16} /> My Dashboard & Stats
                      </Link>

                      <Link
                        to="/my-purchases"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn-secondary"
                        style={{ justifyContent: 'flex-start', border: 'none', padding: '8px 12px', fontSize: '0.85rem' }}
                      >
                        <ShoppingBag size={16} /> My Purchased Library
                      </Link>

                      <Link
                        to="/bookmarks"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn-secondary"
                        style={{ justifyContent: 'flex-start', border: 'none', padding: '8px 12px', fontSize: '0.85rem' }}
                      >
                        <BookOpen size={16} /> Bookmarks
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
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
                          <ShieldCheck size={16} /> Admin CMS Portal
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
                          width: '100%'
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
                  <div className="brand-logo-icon" style={{ width: '28px', height: '28px' }}>
                    <PlaySquare size={16} />
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
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="nav-link"
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: isActive(link.path) ? '#EEF2FF' : 'transparent',
                      color: isActive(link.path) ? 'var(--color-primary)' : 'var(--text-secondary)',
                      fontWeight: 700,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{link.badge}</span>
                    )}
                  </Link>
                ))}
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
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>{user.xp} XP</div>
                    </div>
                  </div>
                  <Link to="/dashboard" onClick={() => setIsMobileDrawerOpen(false)} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                    Dashboard
                  </Link>
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

      {/* Global Search Modal */}
      {isSearchOpen && <GlobalSearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};
