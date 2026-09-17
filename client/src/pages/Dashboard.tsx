import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Flame, 
  Trophy, 
  Code2, 
  BrainCircuit, 
  ShoppingBag, 
  Zap, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SkeletonLoader } from '../components/SkeletonLoader';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/user/dashboard');
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (e) {
        console.error('Failed to load dashboard:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="page-wrapper dashboard-page animate-fade-in">
      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Student Hub
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Welcome back, {user?.name || 'Engineer'} 👋
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/dsa" className="btn btn-primary btn-sm">
              <Code2 size={16} /> Solve Daily DSA
            </Link>
            <Link to="/my-purchases" className="btn btn-secondary btn-sm">
              <ShoppingBag size={16} /> My Notes
            </Link>
          </div>
        </div>

        {/* 4 Stat Metric Cards */}
        {loading ? (
          <div className="admin-stats-grid">
            <SkeletonLoader rows={1} height="90px" />
            <SkeletonLoader rows={1} height="90px" />
            <SkeletonLoader rows={1} height="90px" />
            <SkeletonLoader rows={1} height="90px" />
          </div>
        ) : (
          <div className="admin-stats-grid" style={{ marginBottom: '2.5rem' }}>
            {/* Total XP */}
            <div className="card glass-card glowing-border">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Experience Points</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {stats?.totalXp || user?.xp || 0} XP
                  </div>
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(0, 229, 255, 0.12)', color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={22} />
                </div>
              </div>
            </div>

            {/* Daily Streak */}
            <div className="card glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current Streak</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-amber)', fontFamily: 'var(--font-mono)' }}>
                    {stats?.streak || user?.streak || 0} Days
                  </div>
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', color: 'var(--color-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={22} />
                </div>
              </div>
            </div>

            {/* DSA Solved */}
            <div className="card glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DSA Solved</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {stats?.dsa?.totalSolved || 0} / {stats?.dsa?.totalAvailable || 0}
                  </div>
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Code2 size={22} />
                </div>
              </div>
            </div>

            {/* Aptitude Accuracy */}
            <div className="card glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Aptitude Accuracy</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-purple)', fontFamily: 'var(--font-mono)' }}>
                    {stats?.aptitude?.accuracy || 0}%
                  </div>
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.12)', color: 'var(--color-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BrainCircuit size={22} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Breakdown & Recent Activity */}
        <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
          {/* Difficulty Mastery */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>DSA Difficulty Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--color-emerald)', fontWeight: 600 }}>Easy Problems</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{stats?.dsa?.easy || 0} Solved</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, ((stats?.dsa?.easy || 0) / 4) * 100)}%`, height: '100%', background: 'var(--color-emerald)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--color-amber)', fontWeight: 600 }}>Medium Problems</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{stats?.dsa?.medium || 0} Solved</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, ((stats?.dsa?.medium || 0) / 3) * 100)}%`, height: '100%', background: 'var(--color-amber)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--color-rose)', fontWeight: 600 }}>Hard Problems</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{stats?.dsa?.hard || 0} Solved</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, ((stats?.dsa?.hard || 0) / 2) * 100)}%`, height: '100%', background: 'var(--color-rose)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Unlocked Badges */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Earned Achievement Badges</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {user?.badges?.map((badge: string) => (
                <div
                  key={badge}
                  style={{
                    background: 'rgba(0, 229, 255, 0.1)',
                    border: '1px solid var(--border-highlight)',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Trophy size={16} color="var(--color-cyan)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Solved History & Account Security */}
        <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
          {/* Recent Submissions */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Recent Submission Activity</h3>
            {stats?.recentActivity?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {stats.recentActivity.map((act: any) => (
                  <div
                    key={act.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CheckCircle2 size={18} color={act.status === 'Accepted' ? 'var(--color-emerald)' : 'var(--color-rose)'} />
                      <Link to={`/dsa/${act.problemSlug}`} style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>
                        {act.problemTitle}
                      </Link>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{act.language}</span>
                    </div>
                    <span className={`badge ${act.status === 'Accepted' ? 'badge-easy' : 'badge-hard'}`}>
                      {act.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No submissions yet. Head over to the DSA Arena to start practicing!</p>
            )}
          </div>

          {/* Account Security & Password Change */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="var(--color-cyan)" /> Security & Password
            </h3>
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
};

const ChangePasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (newPassword !== confirmPassword) {
      setMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setMsg({ text: 'New password must be at least 6 characters.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/change-password', { currentPassword, newPassword });
      if (res.success) {
        setMsg({ text: 'Password updated successfully!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMsg({ text: res.message || 'Failed to update password.', type: 'error' });
      }
    } catch (err: any) {
      setMsg({ text: err.message || 'Failed to update password.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {msg && (
        <div style={{
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '0.8rem',
          background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
          color: msg.type === 'success' ? 'var(--color-emerald)' : 'var(--color-rose)',
          border: `1px solid ${msg.type === 'success' ? 'var(--color-emerald)' : 'var(--color-rose)'}`
        }}>
          {msg.text}
        </div>
      )}

      <div>
        <label className="form-label" style={{ fontSize: '0.75rem' }}>Current Password</label>
        <input
          type="password"
          className="input"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
          required
          style={{ fontSize: '0.85rem' }}
        />
      </div>

      <div>
        <label className="form-label" style={{ fontSize: '0.75rem' }}>New Password</label>
        <input
          type="password"
          className="input"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="Minimum 6 characters"
          required
          minLength={6}
          style={{ fontSize: '0.85rem' }}
        />
      </div>

      <div>
        <label className="form-label" style={{ fontSize: '0.75rem' }}>Confirm New Password</label>
        <input
          type="password"
          className="input"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Repeat new password"
          required
          minLength={6}
          style={{ fontSize: '0.85rem' }}
        />
      </div>

      <button type="submit" className="btn btn-secondary btn-sm" disabled={loading} style={{ marginTop: '4px' }}>
        {loading ? 'Updating Password...' : 'Update Password'}
      </button>
    </form>
  );
};
