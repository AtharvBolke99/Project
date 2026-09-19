import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Star, 
  FileText, 
  FolderGit2, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { api } from '../services/api';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { getAssetUrl, handleImageError } from '../utils/imageUrl';

const STORE_CACHE_KEY = 'conceptifyyy_store_catalog_cache';
const VAULT_KEY = 'conceptifyyy_admin_products_vault';

const getCachedProducts = (): any[] => {
  try {
    const cached = localStorage.getItem(STORE_CACHE_KEY) || localStorage.getItem(VAULT_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((p: any) => 
          p.category !== 'Test Mode' && 
          p.slug !== 'conceptifyyy-test-product' && 
          p.id !== 'prod_test_mode_item'
        );
      }
    }
  } catch (e) {
    // Ignore storage parse errors
  }
  return [];
};

export const Store: React.FC = () => {
  const [allProducts, setAllProducts] = useState<any[]>(getCachedProducts);
  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(() => getCachedProducts().length === 0);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/store/products');
      if (res.success && Array.isArray(res.data)) {
        const realProducts = res.data.filter((p: any) => 
          p.category !== 'Test Mode' && 
          p.slug !== 'conceptifyyy-test-product' && 
          p.id !== 'prod_test_mode_item'
        );
        setAllProducts(realProducts);
        try {
          localStorage.setItem(STORE_CACHE_KEY, JSON.stringify(realProducts));
        } catch (e) {}
      }
    } catch (e) {
      console.warn('Backend waking up from sleep, using cached store products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [
    'All',
    'Python',
    'MySQL / DBMS',
    'DSA Notes',
    'Aptitude Notes',
    'Placement Bundles',
    'Projects'
  ];

  // Real-time filtering across categories, title, tags, and descriptions
  const filteredProducts = allProducts.filter(p => {
    if (category !== 'All') {
      if (category === 'Python') {
        const isPython = p.title?.toLowerCase().includes('python') || 
                         (p.tags && p.tags.some((t: string) => t.toLowerCase().includes('python')));
        if (!isPython) return false;
      } else if (category === 'MySQL / DBMS') {
        const isSql = p.title?.toLowerCase().includes('mysql') || 
                      p.title?.toLowerCase().includes('dbms') || 
                      (p.tags && p.tags.some((t: string) => t.toLowerCase().includes('mysql') || t.toLowerCase().includes('dbms') || t.toLowerCase().includes('sql')));
        if (!isSql) return false;
      } else if (p.category?.toLowerCase() !== category.toLowerCase()) {
        return false;
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      const matches = p.title?.toLowerCase().includes(q) ||
                      (p.cardDescription && p.cardDescription.toLowerCase().includes(q)) ||
                      (p.description && p.description.toLowerCase().includes(q)) ||
                      (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(q))) ||
                      (p.techStack && p.techStack.some((t: string) => t.toLowerCase().includes(q)));
      if (!matches) return false;
    }

    return true;
  });

  return (
    <div className="page-wrapper store-page animate-fade-in">
      <div className="container" style={{ paddingTop: '1.5rem' }}>
        {/* Header Title */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <ShoppingBag size={22} color="var(--color-primary)" />
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800 }}>
              CONCEPTIFYYY Digital Store
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Curated handwritten DSA visual notes, aptitude cheat sheets, and production-grade placement project source codes.
          </p>
        </div>

        {/* Category Pills & Search Toolbar - Responsive Mobile Layout */}
        <div className="store-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div className="tabs-header-wrapper" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', maxWidth: '100%', paddingBottom: '4px' }}>
            <div className="tabs-header" style={{ margin: 0, border: 'none', display: 'inline-flex', flexWrap: 'nowrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`tab-btn ${category === cat ? 'active' : ''}`}
                  style={{ fontSize: '0.85rem', padding: '6px 14px', whiteSpace: 'nowrap' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="store-search-box" style={{ position: 'relative', width: '280px', flexGrow: 1, maxWidth: '100%' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            <input
              type="text"
              placeholder="Search notes or projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: '36px', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid-3">
            <SkeletonLoader rows={3} height="280px" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title="No Resources Found"
            description="No digital products match your filter criteria."
            actionText="View All Notes"
            onAction={() => { setCategory('All'); setSearch(''); }}
          />
        ) : (
          <div className="grid-3">
            {filteredProducts.map(prod => (
              <div key={prod.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Thumbnail Image */}
                <div style={{
                  height: '160px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '1.25rem',
                  background: 'var(--bg-tertiary)'
                }}>
                  <img
                    src={getAssetUrl(prod.thumbnail)}
                    alt={prod.title}
                    onError={handleImageError}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    display: 'flex',
                    gap: '6px'
                  }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{prod.category}</span>
                    {prod.isPurchased && (
                      <span className="badge badge-easy" style={{ fontSize: '0.65rem' }}>
                        ✓ UNLOCKED
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{prod.rating}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({prod.reviewsCount || 120} reviews)</span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                    {prod.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1, lineHeight: '1.5' }}>
                    {prod.cardDescription || prod.shortDescription || prod.description}
                  </p>

                  {/* Price & Action */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: 'auto' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                          ₹{prod.price}
                        </span>
                        {prod.originalPrice > prod.price && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            ₹{prod.originalPrice}
                          </span>
                        )}
                      </div>
                      {prod.discountPercent > 0 && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-emerald)', fontWeight: 700 }}>
                          {prod.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <Link to={`/store/${prod.slug}`} className="btn btn-primary btn-sm">
                      {prod.isPurchased ? 'Access Files' : 'Buy Now'} <ArrowRight size={14} />
                    </Link>
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
