import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Download, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MobileNav: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  const isActive = (path: string) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/store')) return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="mobile-bottom-dock">
      <Link to="/" className={`mobile-dock-item ${isActive('/') ? 'active' : ''}`}>
        <ShoppingBag size={18} />
        <span>Store</span>
      </Link>

      <Link to="/my-purchases" className={`mobile-dock-item ${isActive('/my-purchases') ? 'active' : ''}`}>
        <Download size={18} />
        <span>Purchases</span>
      </Link>

      {isAdmin && (
        <Link to="/admin/products" className={`mobile-dock-item ${isActive('/admin') ? 'active' : ''}`}>
          <ShieldCheck size={18} />
          <span>Admin</span>
        </Link>
      )}

      {isAuthenticated ? (
        <Link to="/my-purchases" className="mobile-dock-item">
          <User size={18} />
          <span>Account</span>
        </Link>
      ) : (
        <button
          onClick={onOpenAuth}
          className="mobile-dock-item"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <User size={18} />
          <span>Login</span>
        </button>
      )}
    </div>
  );
};
