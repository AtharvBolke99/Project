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
        const res = await api.post('/auth/reset-password', {
          token: resetToken,
          newPassword
        });
        if (res.success) {
          showToast('Password reset successfully! Please log in.', 'success');
          setMode('login');
          setPassword('');
          setError('');
          setSuccessMsg('Password reset successfully. You can now log in.');
        } else {
          setError(res.message || 'Failed to reset password.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content pop" 
        style={{ 
          background: 'var(--bg-card)', 
          borderRadius: '26px', 
          border: '2px solid var(--bg-card-border)', 
          padding: '2rem',
          color: '#FFFFFF' 
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div className="hero-pill-badge" style={{ marginBottom: '8px', padding: '4px 12px', fontSize: '11px' }}>
              <span className="dot"></span>
              <span>Student Portal</span>
            </div>
            <h3 className="d" style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
              {mode === 'login' && 'Welcome back'}
              {mode === 'register' && 'Create your account'}
              {mode === 'forgot' && 'Reset Password'}
              {mode === 'reset' && 'Set New Password'}
            </h3>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ minWidth: '36px', minHeight: '36px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        {(mode === 'login' || mode === 'register') && (
          <div style={{ display: 'flex', gap: '6px', background: '#0E0D22', border: '1.5px solid var(--bg-card-border)', borderRadius: '999px', padding: '4px', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                background: mode === 'login' ? 'var(--yellow)' : 'transparent',
                color: mode === 'login' ? 'var(--ink)' : 'var(--text-muted)',
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
                background: mode === 'register' ? 'var(--yellow)' : 'transparent',
                color: mode === 'register' ? 'var(--ink)' : 'var(--text-muted)',
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
            background: 'rgba(255, 138, 107, 0.15)',
            border: '1.5px solid var(--coral)',
            color: 'var(--coral)',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'rgba(78, 237, 184, 0.15)',
            border: '1.5px solid var(--mint)',
            color: 'var(--mint)',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-muted)' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-sub)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="inp"
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
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-muted)' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-sub)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="inp"
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
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--yellow)', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-sub)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  className="inp"
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
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-muted)' }}>Reset Token</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} color="var(--text-sub)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="inp"
                    placeholder="Enter reset token"
                    value={resetToken}
                    onChange={e => setResetToken(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-muted)' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--text-sub)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    className="inp"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-yellow btn-lg"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (
              mode === 'login' ? 'Log In to Conceptifyyy' :
              mode === 'register' ? 'Create My Account' :
              mode === 'forgot' ? 'Send Reset Token' :
              'Update Password'
            )}
          </button>
        </form>

        {(mode === 'forgot' || mode === 'reset') && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={14} /> Back to Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuthModal;
