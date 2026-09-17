import React from 'react';
import { Sparkles, Inbox, Search } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3.5rem 1.5rem',
      background: 'var(--bg-card)',
      border: '1px dashed var(--border-medium)',
      borderRadius: 'var(--radius-xl)',
      maxWidth: '480px',
      margin: '2rem auto'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'rgba(0, 229, 255, 0.1)',
        color: 'var(--color-cyan)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.25rem auto'
      }}>
        {icon || <Inbox size={28} />}
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginBottom: actionText ? '1.5rem' : '0' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          <Sparkles size={14} /> {actionText}
        </button>
      )}
    </div>
  );
};
