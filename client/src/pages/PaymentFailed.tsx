import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertCircle, RotateCcw, ShoppingBag } from 'lucide-react';

export const PaymentFailed: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'Transaction was declined or cancelled by the user.';

  return (
    <div className="page-wrapper animate-fade-in flex-center" style={{ minHeight: '80vh', padding: '2rem 1.25rem' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(244, 63, 94, 0.15)',
          color: 'var(--color-rose)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <AlertCircle size={36} />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Payment Incomplete
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          {reason}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/store" className="btn btn-primary">
            <RotateCcw size={16} /> Try Again in Store
          </Link>
        </div>
      </div>
    </div>
  );
};
