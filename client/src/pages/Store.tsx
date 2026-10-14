import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Star, 
  FileText, 
  FolderGit2, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Code2,
  Database,
  Brain,
  X,
  Lock,
  Download
} from 'lucide-react';
import { api } from '../services/api';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { getAssetUrl, handleImageError } from '../utils/imageUrl';

export const Store: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'All';

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<string>(initialCat);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/store/products');
      if (res.success && Array.isArray(res.data)) {
        const realProducts = res.data.filter((p: any) => 
          p.category !== 'Test Mode' && 
          p.slug !== 'conceptifyyy-test-product' && 
          p.id !== 'prod_test_mode_item'
        );
        setAllProducts(realProducts);
      } else {
        setError(res.message || 'Unable to load notes. Please try again.');
      }
    } catch (e: any) {
      console.warn('[NOTES] Failed to fetch store products:', e);
      setError('Unable to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setCategory(cat);
    }
  }, [searchParams]);

  const categories = [
    { id: 'All', label: 'All Resources', icon: Sparkles },
    { id: 'Python', label: 'Python Course', icon: Code2 },
    { id: 'MySQL / DBMS', label: 'MySQL & DBMS', icon: Database },
    { id: 'Aptitude Notes', label: 'Aptitude Speed Pack', icon: Brain },
    { id: 'Placement Bundles', label: 'Resume & Bundles', icon: FileText },
    { id: 'Projects', label: 'Full-Stack Projects', icon: FolderGit2 }
  ];

  const handleCategorySelect = (catId: string) => {
    setCategory(catId);
    if (catId === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  // Real-time filtering across categories, title, tags, and descriptions
  const filteredProducts = allProducts.filter(p => {
    if (category !== 'All') {
      if (category === 'Python') {
        const isPython = p.title?.toLowerCase().includes('python') || 
                         (p.tags && p.tags.some((t: string) => t.toLowerCase().includes('python')));
        if (!isPython) return false;
      } else if (category === 'MySQL / DBMS' || category === 'MySQL') {
        const isSql = p.title?.toLowerCase().includes('mysql') || 
                      p.title?.toLowerCase().includes('dbms') || 
                      (p.tags && p.tags.some((t: string) => t.toLowerCase().includes('mysql') || t.toLowerCase().includes('dbms') || t.toLowerCase().includes('sql')));
        if (!isSql) return false;
      } else if (category === 'Aptitude' || category === 'Aptitude Notes') {
        const isApt = p.category === 'Aptitude Notes' || p.title?.toLowerCase().includes('aptitude');
        if (!isApt) return false;
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
    <div className="page-wrapper store-page animate-fade-in" style={{ minHeight: '85vh', paddingBottom: '4rem' }}>
      {/* High-Converting Modern Storefront Hero */}
      <div 
        style={{
          background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.04) 50%, transparent 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '3rem 0 2.5rem'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '860px' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: 'var(--radius-full)', background: 'var(--gradient-brand-subtle)', border: '1px solid var(--border-highlight)', marginBottom: '1.25rem' }}>
            <Sparkles size={14} color="var(--color-primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.04em' }}>
              OFFICIAL CONCEPTIFYYY STORE
            </span>
          </div>

          {/* Main Title */}
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Handwritten Notes, Cheat Sheets & <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Full-Stack Projects</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto 1.75rem' }}>
            Instant digital access verified for campus placements, technical interviews, and final year semester submissions.
          </p>

          {/* Trust Metrics Pill Strip */}
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', padding: '10px 20px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-glass-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <Zap size={15} color="var(--color-cyan)" />
              <span>Instant PDF & ZIP Delivery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <Star size={15} color="#F59E0B" fill="#F59E0B" />
              <span>4.9/5 Rating (5,000+ Students)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <ShieldCheck size={15} color="var(--color-emerald)" />
              <span>Razorpay 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* Category Pills & Live Search Toolbar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
          {/* Search Box on Top */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '380px', maxWidth: '100%' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="text"
                placeholder="Search Python, MySQL, Aptitude, Projects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input"
                style={{ paddingLeft: '40px', paddingRight: search ? '36px' : '14px', height: '44px', fontSize: '0.9rem', borderRadius: 'var(--radius-md)' }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Showing <strong style={{ color: 'var(--color-primary)' }}>{filteredProducts.length}</strong> resources
            </div>
          </div>

          {/* Interactive Category Filter Pills */}
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '4px' }}>
            <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'nowrap' }}>
              {categories.map(cat => {
                const IconComponent = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`tab-btn ${isSelected ? 'active' : ''}`}
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      borderRadius: 'var(--radius-full)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: isSelected ? '1px solid transparent' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'var(--gradient-brand)' : 'var(--bg-card)',
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                      boxShadow: isSelected ? '0 4px 14px rgba(99, 102, 241, 0.35)' : 'var(--shadow-xs)',
                      cursor: 'pointer',
                      fontWeight: 700
                    }}
                  >
                    <IconComponent size={15} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
              <p style={{ fontWeight: 600 }}>Loading notes...</p>
            </div>
            <div className="grid-3">
              <SkeletonLoader rows={3} height="320px" />
            </div>
          </div>
        ) : error ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', maxWidth: '500px', margin: '2rem auto' }}>
            <AlertCircle size={40} color="var(--color-rose)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Unable to load notes</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</p>
            <button onClick={fetchProducts} className="btn btn-primary" style={{ margin: '0 auto', gap: '8px' }}>
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        ) : allProducts.length === 0 ? (
          <EmptyState
            title="No notes are available at the moment."
            description="The store currently has no published notes or projects. Please check back soon."
          />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title="No notes match your filter criteria."
            description="Try selecting another category or clearing your search keywords."
            actionText="Clear Filters"
            onAction={() => { handleCategorySelect('All'); setSearch(''); }}
          />
        ) : (
          <div className="grid-3" style={{ gap: '1.75rem' }}>
            {filteredProducts.map(prod => (
              <div 
                key={prod.id} 
                className="card card-hover" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Thumbnail Image Box */}
                <div style={{
                  height: '180px',
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
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  />
                  
                  {/* Floating Badges */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    display: 'flex',
                    gap: '6px'
                  }}>
                    <span 
                      style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: 700, 
                        background: 'rgba(15, 23, 42, 0.75)', 
                        backdropFilter: 'blur(8px)',
                        color: '#FFFFFF',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}
                    >
                      {prod.category}
                    </span>
                    {prod.isPurchased && (
                      <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                        ✓ UNLOCKED
                      </span>
                    )}
                  </div>

                  {prod.discountPercent > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'var(--color-rose)',
                      color: '#FFFFFF',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '6px',
                      boxShadow: '0 2px 6px rgba(244, 63, 94, 0.4)'
                    }}>
                      {prod.discountPercent}% OFF
                    </div>
                  )}
                </div>

                {/* Card Content Body */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Rating & Reviews */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={14} color="#F59E0B" fill="#F59E0B" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>{prod.rating || 4.9}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({prod.reviewsCount || 140} reviews)</span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                    {prod.title}
                  </h3>

                  {/* Short Description */}
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1, lineHeight: '1.5' }}>
                    {prod.cardDescription || prod.shortDescription || prod.description}
                  </p>

                  {/* Price & Action Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: 'auto' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                          ₹{prod.price}
                        </span>
                        {prod.originalPrice > prod.price && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            ₹{prod.originalPrice}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-emerald)', fontWeight: 700 }}>
                        Instant Digital Download
                      </span>
                    </div>

                    <Link 
                      to={`/store/${prod.slug}`} 
                      className="btn btn-primary btn-sm"
                      style={{ gap: '6px', padding: '8px 14px', borderRadius: 'var(--radius-md)' }}
                    >
                      {prod.isPurchased ? (
                        <>
                          <Download size={14} /> Download
                        </>
                      ) : (
                        <>
                          Buy Now <ArrowRight size={14} />
                        </>
                      )}
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
