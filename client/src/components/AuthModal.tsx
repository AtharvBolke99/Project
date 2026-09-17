import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, KeyRound, ArrowLeft } from 'lucide-react';
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
        showToast('Account created! 50 Welcome XP awarded.', 'success');
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
      <div className="modal-content glass-card glowing-border" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Create Account'}
              {mode === 'forgot' && 'Reset Password'}
              {mode === 'reset' && 'Set New Password'}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {mode === 'login' && 'Continue your visual learning journey'}
              {mode === 'register' && 'Join thousands of engineers mastering DSA'}
              {mode === 'forgot' && 'Enter your registered email to receive reset instructions'}
              {mode === 'reset' && 'Create a strong, secure new password'}
            </p>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher (Visible on login / register) */}
        {(mode === 'login' || mode === 'register') && (
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '4px', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                background: mode === 'login' ? 'var(--bg-card)' : 'transparent',
                color: mode === 'login' ? 'var(--color-cyan)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none'
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
                background: mode === 'register' ? 'var(--bg-card)' : 'transparent',
                color: mode === 'register' ? 'var(--color-cyan)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: mode === 'register' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Register
            </button>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid var(--color-rose)',
            color: 'var(--color-rose)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid var(--color-emerald)',
            color: 'var(--color-emerald)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Alex Sharma"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  className="input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: '38px' }}
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
                    style={{ background: 'none', border: 'none', color: 'var(--color-cyan)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px' }}
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
                  <KeyRound size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter reset token"
                    value={resetToken}
                    onChange={e => setResetToken(e.target.value)}
                    style={{ paddingLeft: '38px' }}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="password"
                    className="input"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    style={{ paddingLeft: '38px' }}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (
              mode === 'login' ? 'Sign In' :
              mode === 'register' ? 'Create Account' :
              mode === 'forgot' ? 'Send Reset Instructions' :
              'Set New Password'
            )}
          </button>

          {(mode === 'forgot' || mode === 'reset') && (
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '8px', gap: '6px' }}
            >
              <ArrowLeft size={14} /> Back to Sign In
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
