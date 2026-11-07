import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, ShoppingBag, Download, ShieldCheck, User, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MobileNav: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const location = useLocation();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const isHomeActive = location.pathname === '/';
  const isStoreActive = location.pathname.startsWith('/store') || location.pathname.startsWith('/notes') || location.pathname.startsWith('/projects');
  const isPurchasesActive = location.pathname.startsWith('/my-purchases') || location.pathname.startsWith('/purchases');
  const isAdminActive = location.pathname.startsWith('/admin');

  return (
    <nav className="mobile-bottom-dock" aria-label="Mobile Navigation Bar">
      {/* 1. Home */}
      <Link to="/" className={`mobile-dock-item ${isHomeActive ? 'active' : ''}`}>
        <HomeIcon size={20} />
        <span>Home</span>
      </Link>

      {/* 2. Store */}
      <Link to="/store" className={`mobile-dock-item ${isStoreActive ? 'active' : ''}`}>
        <ShoppingBag size={20} />
        <span>Store</span>
      </Link>

      {/* 3. My Downloads / Purchases */}
      <Link to="/my-purchases" className={`mobile-dock-item ${isPurchasesActive ? 'active' : ''}`}>
        <Download size={20} />
        <span>Vault</span>
      </Link>

      {/* 4. Admin or Account / Login */}
      {isAdmin ? (
        <Link to="/admin/products" className={`mobile-dock-item ${isAdminActive ? 'active' : ''}`}>
          <ShieldCheck size={20} color="var(--purple)" />
          <span>Admin</span>
        </Link>
      ) : isAuthenticated ? (
        <Link to="/my-purchases" className="mobile-dock-item">
          <User size={20} />
          <span>{user?.name ? user.name.split(' ')[0] : 'Account'}</span>
        </Link>
      ) : (
        <button
          onClick={onOpenAuth}
          className="mobile-dock-item"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <LogIn size={20} />
          <span>Login</span>
        </button>
      )}
    </nav>
  );
};

export default MobileNav;
