import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Download, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  Calendar, 
  Key,
  FolderGit2
} from 'lucide-react';
import { api } from '../services/api';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
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
    const url = `/api/downloads/${productId}?download=true${token ? `&token=${token}` : ''}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleView = (productId: string) => {
    const token = localStorage.getItem('conceptifyyy_token') || '';
    const url = `/api/downloads/${productId}?view=true${token ? `&token=${token}` : ''}`;
    window.open(url, '_blank');
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container" style={{ paddingTop: '2rem', maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <ShoppingBag size={22} color="var(--color-cyan)" />
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              My Purchases & Digital Library
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            All your verified notes, cheat sheets, and source code projects with perpetual re-download access.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SkeletonLoader rows={3} height="100px" />
          </div>
        ) : purchases.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag size={28} />}
            title="No Purchases Found"
            description="You have not unlocked any digital notes or project bundles yet."
            actionText="Explore Notes Store"
            onAction={() => window.location.href = '/store'}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {purchases.map(item => (
              <div key={item.purchaseId} className="card glass-card card-hover" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: 'var(--bg-tertiary)',
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
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                        <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{item.category}</span>
                        <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{item.fileFormat}</span>
                      </div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {item.productTitle}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>Order: {item.orderNumber}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Key size={12} /> {item.licenseKey}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleView(item.productId)}
                      className="btn btn-primary btn-sm"
                    >
                      <ExternalLink size={15} /> View Resource
                    </button>
                    <button
                      onClick={() => handleDownload(item.productId)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Download size={15} /> Download
                    </button>
                    {item.productSlug && (
                      <Link to={`/store/${item.productSlug}`} className="btn btn-outline btn-sm">
                        Product Details
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
