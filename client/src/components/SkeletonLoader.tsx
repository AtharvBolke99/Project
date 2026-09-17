import React from 'react';

export const SkeletonLoader: React.FC<{ rows?: number; height?: string }> = ({ rows = 4, height = '40px' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height,
            width: '100%',
            background: 'linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-card-hover) 50%, var(--bg-tertiary) 75%)',
            backgroundSize: '200% 100%',
            borderRadius: 'var(--radius-md)',
            animation: 'pulseGlow 1.5s infinite linear'
          }}
        />
      ))}
    </div>
  );
};
