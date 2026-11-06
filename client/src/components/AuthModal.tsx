import React, { useState } from 'react';
import { X, Lock, Mail, User, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register' | 'forgot' | 'reset';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode = 'login', onClose }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { login, register } = useAuth();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        showToast('Welcome back! Successfully logged in.', 'success');
        onClose();
      } else if (mode === 'register') {
        if (!name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        await register(name, email, password);
        showToast('Account created! Welcome to Conceptifyyy.', 'success');
        onClose();
      } else if (mode === 'forgot') {
        const res = await api.post('/auth/forgot-password', { email });
        if (res.success) {
          setSuccessMsg(res.message || 'Reset instructions sent.');
          if (res.resetToken) {
            setResetToken(String(res.resetToken));
            setMode('reset');
            showToast('Reset token generated! Enter your new password.', 'info');
          }
        } else {
          setError(res.message || 'Failed to process forgot password request.');
        }
      } else if (mode === 'reset') {
        const res = await api.post('/auth/reset-password', { token: resetToken, newPassword });
        if (res.success) {
          showToast('Password reset successfully! Please log in.', 'success');
          setMode('login');
          setPassword('');
        } else {
          setError(res.message || 'Failed to reset password.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content pop" 
        style={{ 
          background: '#FFFFFF', 
          borderRadius: '26px', 
          border: '2px solid var(--ink)', 
          boxShadow: '8px 8px 0 var(--ink)', 
          padding: '2rem' 
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <span className="tag" style={{ background: '#E3DDFF', marginBottom: '8px' }}>
              Student Portal
            </span>
            <h3 className="d" style={{ fontSize: '26px', fontWeight: 800 }}>
              {mode === 'login' && 'Welcome back'}
              {mode === 'register' && 'Create your account'}
              {mode === 'forgot' && 'Reset Password'}
              {mode === 'reset' && 'Set New Password'}
            </h3>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ minWidth: '38px', minHeight: '38px', padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        {(mode === 'login' || mode === 'register') && (
          <div style={{ display: 'flex', gap: '8px', background: 'var(--lavender-accent)', border: '2px solid var(--ink)', borderRadius: '999px', padding: '4px', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                background: mode === 'login' ? 'var(--purple)' : 'transparent',
                color: mode === 'login' ? '#FFFFFF' : 'var(--ink)',
                fontWeight: 800,
                fontSize: '14px',
                borderRadius: '999px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                background: mode === 'register' ? 'var(--purple)' : 'transparent',
                color: mode === 'register' ? '#FFFFFF' : 'var(--ink)',
                fontWeight: 800,
                fontSize: '14px',
                borderRadius: '999px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Register
            </button>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div style={{
            background: 'var(--coral-light)',
            border: '2px solid var(--ink)',
            color: 'var(--ink)',
            padding: '10px 14px',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '1rem',
            boxShadow: '3px 3px 0 var(--ink)'
          }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'var(--soft-mint)',
            border: '2px solid var(--ink)',
            color: 'var(--ink)',
            padding: '10px 14px',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '1rem',
            boxShadow: '3px 3px 0 var(--ink)'
          }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Alex Sharma"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'register') && (
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--purple)', fontSize: '12px', cursor: 'pointer', fontWeight: 800 }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>
          )}

          {mode === 'reset' && (
            <>
              <div className="form-group">
                <label className="form-label">Reset Token</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} color="var(--muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter reset token"
                    value={resetToken}
                    onChange={e => setResetToken(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    className="input"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn v btn-lg"
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (
              mode === 'login' ? 'Sign In' :
              mode === 'register' ? 'Create Account' :
              mode === 'forgot' ? 'Send Reset Token' :
              'Set New Password'
            )}
          </button>

          {(mode === 'forgot' || mode === 'reset') && (
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              className="btn btn-sm"
              style={{ width: '100%', marginTop: '10px', gap: '6px' }}
            >
              <ArrowLeft size={14} /> Back to Sign In
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
