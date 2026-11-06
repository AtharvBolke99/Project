import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Download, 
  ExternalLink, 
  Calendar, 
  Key
} from 'lucide-react';
import { api, getApiUrl } from '../services/api';
import { getAssetUrl, handleImageError } from '../utils/imageUrl';

export const MyPurchases: React.FC = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await api.get('/user/purchases');
        if (res.success && res.data) {
          setPurchases(res.data);
        }
      } catch (e) {
        console.error('Failed to load purchases:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const handleDownload = (productId: string) => {
    const token = localStorage.getItem('conceptifyyy_token') || '';
    const url = getApiUrl(`/downloads/${productId}?download=true${token ? `&token=${token}` : ''}`);
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleView = (productId: string) => {
    const token = localStorage.getItem('conceptifyyy_token') || '';
    const url = getApiUrl(`/downloads/${productId}?view=true${token ? `&token=${token}` : ''}`);
    window.open(url, '_blank');
  };

  return (
    <div className="my-purchases-page animate-fade-in" style={{ paddingBottom: '96px' }}>
      <div className="wrap" style={{ paddingTop: '36px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <span className="tag" style={{ background: '#C9F7E8', marginBottom: '10px' }}>
            Perpetual Student Access
          </span>
          <h1 className="d" style={{ fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '8px' }}>
            My Download <span className="chip" style={{ background: '#FFC933' }}>Vault</span>
          </h1>
          <p className="mu" style={{ fontSize: '16px', maxWidth: '620px' }}>
            All your unlocked notes, interview formula cheat sheets, and source code projects with lifetime re-download access.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="pop skeleton-pop" style={{ height: '100px', borderRadius: '24px' }}></div>
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div 
            className="pop" 
            style={{ 
              background: '#FFFFFF', 
              borderRadius: '26px', 
              padding: '4rem 2rem', 
              textAlign: 'center', 
              maxWidth: '560px', 
              margin: '2rem auto' 
            }}
          >
            <ShoppingBag size={48} color="var(--ink)" style={{ margin: '0 auto 1.25rem' }} />
            <h3 className="d" style={{ fontSize: '24px', fontWeight: 800, marginBottom: '0.5rem' }}>
              No purchases unlocked yet
            </h3>
            <p className="mu" style={{ fontSize: '15px', marginBottom: '1.5rem' }}>
              Your digital library is currently empty. Explore our verified placement notes and source code packs to get started.
            </p>
            <Link to="/store" className="btn v">
              Explore Resources Store
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '18px' }}>
            {purchases.map(item => (
              <div 
                key={item.purchaseId} 
                className="pop card-hover" 
                style={{ 
                  background: '#FFFFFF', 
                  borderRadius: '24px', 
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flex: '1 1 300px' }}>
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '2px solid var(--ink)',
                    background: 'var(--lavender-accent)',
                    flexShrink: 0
                  }}>
                    <img
                      src={getAssetUrl(item.thumbnail)}
                      alt={item.productTitle}
                      onError={handleImageError}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div>
                    <h3 className="d" style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
                      {item.productTitle}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} />
                        {new Date(item.accessGrantedAt).toLocaleDateString()}
                      </span>
                      {item.licenseKey && (
                        <span className="tag" style={{ background: '#FFE9A8', fontSize: '11px', padding: '2px 8px' }}>
                          <Key size={11} /> {item.licenseKey}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleView(item.productId)}
                    className="btn y btn-sm"
                    style={{ gap: '6px' }}
                  >
                    <ExternalLink size={15} /> Open Online
                  </button>
                  <button
                    onClick={() => handleDownload(item.productId)}
                    className="btn v btn-sm"
                    style={{ gap: '6px' }}
                  >
                    <Download size={15} /> Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
