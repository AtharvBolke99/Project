import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const PaymentFailed: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'Transaction was declined or cancelled by the user.';

  return (
    <div className="payment-failed-page animate-fade-in flex-center" style={{ minHeight: '80vh', padding: '3rem 1.5rem' }}>
      <div 
        className="pop" 
        style={{ 
          maxWidth: '520px', 
          width: '100%', 
          background: '#FFFFFF', 
          borderRadius: '26px', 
          padding: '2.5rem', 
          textAlign: 'center' 
        }}
      >
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'var(--coral-light)',
          border: '2px solid var(--ink)',
          boxShadow: '3px 3px 0 var(--ink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <AlertCircle size={40} color="var(--ink)" />
        </div>

        <span className="tag" style={{ background: '#FFD4C8', marginBottom: '10px' }}>
          Checkout Notice
        </span>

        <h1 className="d" style={{ fontSize: '30px', fontWeight: 800, marginBottom: '8px' }}>
          Payment Incomplete
        </h1>
        <p className="mu" style={{ marginBottom: '1.75rem', fontSize: '15px', lineHeight: 1.6 }}>
          {reason}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/store" className="btn v btn-lg" style={{ gap: '8px' }}>
            <RotateCcw size={16} /> Try Again in Store
          </Link>
        </div>
      </div>
    </div>
  );
};
