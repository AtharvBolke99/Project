import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Code2, BrainCircuit, PlaySquare, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MobileNav: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="mobile-bottom-dock">
      <Link to="/" className={`mobile-dock-item ${isActive('/') ? 'active' : ''}`}>
        <Home size={18} />
        <span>Home</span>
      </Link>

      <Link to="/dsa" className={`mobile-dock-item ${isActive('/dsa') ? 'active' : ''}`}>
        <Code2 size={18} />
        <span>DSA</span>
      </Link>

      <Link to="/visual-lab" className={`mobile-dock-item ${isActive('/visual-lab') ? 'active' : ''}`}>
        <PlaySquare size={18} />
        <span>Lab</span>
      </Link>

      <Link to="/aptitude" className={`mobile-dock-item ${isActive('/aptitude') ? 'active' : ''}`}>
        <BrainCircuit size={18} />
        <span>Aptitude</span>
      </Link>

      <Link to="/store" className={`mobile-dock-item ${isActive('/store') ? 'active' : ''}`}>
        <ShoppingBag size={18} />
        <span>Store</span>
      </Link>

      {isAuthenticated ? (
        <Link to="/dashboard" className={`mobile-dock-item ${isActive('/dashboard') ? 'active' : ''}`}>
          <User size={18} />
          <span>Profile</span>
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
