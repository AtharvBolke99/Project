import React, { useEffect, useState } from 'react';
import { Bell, Trophy, Zap, Info, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export const NotificationDropdown: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/user/notifications');
        if (res.success && res.data) {
          setNotifications(res.data);
        }
      } catch (e) {
        console.error('Failed to load notifications:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.put(`/user/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) {}
  };

  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: '44px',
        width: '320px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 100,
        overflow: 'hidden',
        animation: 'fadeIn 0.15s ease'
      }}
    >
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Notifications</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 600 }}>Live Feed</span>
      </div>

      <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '6px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading...</p>
        ) : notifications.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No notifications yet.</p>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: n.isRead ? 'transparent' : 'rgba(0, 229, 255, 0.05)',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '4px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                {n.type === 'achievement' && <Trophy size={14} color="var(--color-amber)" />}
                {n.type === 'success' && <CheckCircle2 size={14} color="var(--color-emerald)" />}
                {n.type === 'challenge' && <Zap size={14} color="var(--color-cyan)" />}
                {n.type === 'info' && <Info size={14} color="var(--color-cyan)" />}
                <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{n.title}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{n.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
