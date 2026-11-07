import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Star, 
  FileText, 
  FolderGit2, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  Sparkles,
  Code2,
  Database,
  Brain,
  X,
  Download,
  SlidersHorizontal
} from 'lucide-react';
import { api } from '../services/api';
import { getAssetUrl, handleImageError } from '../utils/imageUrl';

export const Store: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'All';

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<string>(initialCat);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/store/products');
      if (res.success && Array.isArray(res.data)) {
        // Filter out internal test products
        const storeProducts = res.data.filter((p: any) => 
          p.category !== 'Test Mode' && 
          p.slug !== 'conceptifyyy-test-product' && 
          p.id !== 'prod_test_mode_item'
        );
        setAllProducts(storeProducts);
      } else {
        setError(res.message || 'Unable to load notes. Please try again.');
      }
    } catch (e: any) {
      console.warn('[STORE] Failed to fetch store products:', e);
      setError('Unable to connect to the backend server. Please try again.');
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
    const q = searchParams.get('search');
    if (q) {
      setSearch(q);
    }
  }, [searchParams]);

  const categories = [
    { id: 'All', label: 'All Resources' },
    { id: 'DSA Notes', label: 'DSA Placement Prep' },
    { id: 'Python', label: 'Python Course' },
    { id: 'MySQL / DBMS', label: 'MySQL & DBMS' },
    { id: 'Aptitude Notes', label: 'Aptitude & Reasoning' },
    { id: 'Projects', label: 'Full-Stack Projects' },
    { id: 'Placement Bundles', label: 'Resume & Bundles' }
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

  const matchesCategory = (p: any, cat: string): boolean => {
    if (cat === 'All') return true;
    const catLower = cat.toLowerCase();
    const titleLower = (p.title || '').toLowerCase();
    const tagsLower = (p.tags || []).map((t: string) => t.toLowerCase());

    if (cat === 'Python') {
      return titleLower.includes('python') || tagsLower.includes('python');
    }
    if (cat === 'MySQL / DBMS') {
      return titleLower.includes('sql') || titleLower.includes('database') || tagsLower.includes('mysql');
    }
    if (cat === 'Projects') {
      return p.category === 'Projects' || tagsLower.includes('mern') || tagsLower.includes('project');
    }
    if (cat === 'Placement Bundles') {
      return p.category === 'Placement Bundles' || titleLower.includes('resume');
    }
    return (p.category || '').toLowerCase() === catLower;
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allProducts.length };
    categories.forEach(c => {
      if (c.id !== 'All') {
        counts[c.id] = allProducts.filter(p => matchesCategory(p, c.id)).length;
      }
    });
    return counts;
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(p => matchesCategory(p, category));

    if (priceFilter === 'free') {
      result = result.filter(p => p.price === 0);
    } else if (priceFilter === 'under20') {
      result = result.filter(p => p.price > 0 && p.price <= 20);
    } else if (priceFilter === 'under50') {
      result = result.filter(p => p.price > 0 && p.price <= 50);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.cardDescription && p.cardDescription.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(q))) ||
        (p.techStack && p.techStack.some((t: string) => t.toLowerCase().includes(q)))
      );
    }

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else {
      result.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    }

    return result;
  }, [allProducts, category, priceFilter, search, sortBy]);

  return (
    <div className="store-page animate-fade-in" style={{ paddingBottom: '96px', background: 'var(--bg-cosmic)' }}>
      
      {/* ================= 1. STORE HEADER BANNER ================= */}
      <section className="wrap" style={{ paddingTop: '40px', paddingBottom: '32px' }}>
        <div style={{ maxWidth: '820px' }}>
          
          <div className="hero-pill-badge" style={{ marginBottom: '16px' }}>
            <span className="dot"></span>
            <span>Instant Digital Download Store</span>
          </div>

          <h1 className="d" style={{ fontSize: 'clamp(36px, 5.2vw, 64px)', lineHeight: 1.05, fontWeight: 800, marginBottom: '14px', color: '#FFFFFF' }}>
            Find your next <span style={{ color: 'var(--yellow)', fontStyle: 'italic' }}>placement ace.</span>
          </h1>

          <p className="mu" style={{ fontSize: '18px', lineHeight: 1.6, maxWidth: '640px', color: 'var(--text-muted)' }}>
            Comprehensive handwritten study notes, campus company question packs, and production-ready MERN project source code.
          </p>

        </div>
      </section>

      {/* ================= 2. SEARCH & CONTROLS ================= */}
      <section className="wrap" style={{ paddingBottom: '24px' }}>
        
        {/* Search & Sort Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          
          {/* Cosmic Search Input */}
          <div className="pop" style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: '18px', padding: '6px', flex: '1 1 340px', maxWidth: '520px', gap: '6px', alignItems: 'center', border: '2px solid var(--bg-card-border)' }}>
            <Search size={18} color="var(--yellow)" style={{ marginLeft: '10px' }} />
            <input
              type="text"
              placeholder="Search Python, MySQL, Aptitude, Projects, Resume..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 0, border: 0, outline: 0, fontSize: '15px', padding: '0 8px', fontFamily: 'inherit', background: 'transparent', color: '#FFFFFF' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', color: 'var(--text-muted)' }}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
            <button className="btn btn-yellow" style={{ minHeight: '38px', padding: '0 18px', borderRadius: '12px' }}>
              Search
            </button>
          </div>

          {/* Sort & Price Filter Dropdowns */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            
            {/* Price Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <select
                value={priceFilter}
                onChange={e => setPriceFilter(e.target.value)}
                style={{ 
                  minHeight: '44px', 
                  padding: '0 14px', 
                  borderRadius: '14px', 
                  fontSize: '14px', 
                  fontWeight: 700,
                  background: 'var(--bg-card)',
                  color: '#FFFFFF',
                  border: '2px solid var(--bg-card-border)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Prices</option>
                <option value="free">Free Only</option>
                <option value="under20">Under ₹20</option>
                <option value="under50">Under ₹50</option>
              </select>
            </div>

            {/* Sorting */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ 
                  minHeight: '44px', 
                  padding: '0 14px', 
                  borderRadius: '14px', 
                  fontSize: '14px', 
                  fontWeight: 700,
                  background: 'var(--bg-card)',
                  color: '#FFFFFF',
                  border: '2px solid var(--bg-card-border)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

          </div>

        </div>

        {/* Category Pills Strip */}
        <div className="tags-scroll" style={{ marginBottom: '24px' }}>
          {categories.map(cat => {
            const isSelected = category === cat.id;
            const count = categoryCounts[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`btn ${isSelected ? 'btn-yellow' : 'btn-dark'}`}
                style={{
                  minHeight: '40px',
                  padding: '0 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  gap: '8px'
                }}
              >
                <span>{cat.label}</span>
                <span 
                  style={{ 
                    fontSize: '11px', 
                    padding: '2px 8px', 
                    borderRadius: '99px', 
                    background: isSelected ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.12)',
                    color: isSelected ? 'var(--ink)' : '#FFFFFF'
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Filters Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: 700 }}>
            Showing {filteredProducts.length} verified {filteredProducts.length === 1 ? 'material' : 'materials'}
          </span>

          {(category !== 'All' || search || priceFilter !== 'all') && (
            <button
              onClick={() => {
                setCategory('All');
                setSearch('');
                setPriceFilter('all');
                searchParams.delete('category');
                searchParams.delete('search');
                setSearchParams(searchParams);
              }}
              className="btn btn-dark btn-sm"
              style={{ gap: '4px', color: 'var(--yellow)' }}
            >
              <X size={14} /> Clear All Filters
            </button>
          )}
        </div>

      </section>

      {/* ================= 3. PRODUCT CARDS GRID ================= */}
      <section className="wrap">
        
        {loading ? (
          <div className="store-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="pop" style={{ height: '360px', borderRadius: '24px', opacity: 0.5 }}></div>
            ))}
          </div>
        ) : error ? (
          <div className="pop" style={{ borderRadius: '24px', padding: '3.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--coral)', fontWeight: 800, fontSize: '17px', marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchProducts} className="btn btn-yellow btn-sm">
              <RefreshCw size={14} /> Refresh Catalog
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="pop" style={{ borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center', maxWidth: '580px', margin: '2rem auto' }}>
            <ShoppingBag size={48} color="var(--yellow)" style={{ margin: '0 auto 1.25rem' }} />
            <h3 className="d" style={{ fontSize: '26px', fontWeight: 800, marginBottom: '0.5rem', color: '#FFFFFF' }}>
              No notes match your selection
            </h3>
            <p className="mu" style={{ fontSize: '15px', marginBottom: '1.5rem' }}>
              {search ? `No materials found matching "${search}".` : 'No materials available in this category yet.'}
            </p>
            <button
              onClick={() => {
                setCategory('All');
                setSearch('');
                setPriceFilter('all');
                searchParams.delete('category');
                searchParams.delete('search');
                setSearchParams(searchParams);
              }}
              className="btn btn-yellow"
            >
              View All Resources
            </button>
          </div>
        ) : (
          <div className="store-grid">
            {filteredProducts.map(prod => (
              <div
                key={prod.id}
                className="pop"
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 0
                }}
              >
                {/* Image Cover Container */}
                <div style={{ position: 'relative', width: '100%', height: '190px', background: '#0E0D22', borderBottom: '1px solid var(--bg-card-border)', overflow: 'hidden' }}>
                  <img
                    src={getAssetUrl(prod.thumbnail)}
                    alt={prod.title}
                    onError={handleImageError}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Badges on Top */}
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="tag" style={{ background: 'var(--yellow)', color: 'var(--ink)', fontWeight: 800 }}>
                      {prod.category}
                    </span>
                    {prod.discountPercent > 0 && prod.price > 0 && (
                      <span className="tag" style={{ background: 'var(--coral)', color: 'var(--ink)', fontWeight: 800 }}>
                        {prod.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {prod.fileFormat && (
                    <span 
                      className="tag" 
                      style={{ 
                        position: 'absolute', 
                        bottom: '10px', 
                        right: '12px', 
                        background: 'rgba(10, 9, 21, 0.8)',
                        color: '#FFFFFF'
                      }}
                    >
                      {prod.fileFormat}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  
                  {/* Reviews & Star Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} color="#FFC933" fill="#FFC933" />
                      ))}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                      {prod.rating || 4.9}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                      ({prod.reviewsCount || 120} reviews)
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3 
                    className="d" 
                    style={{ 
                      fontSize: '19px', 
                      fontWeight: 800, 
                      lineHeight: 1.3, 
                      marginBottom: '8px',
                      color: '#FFFFFF',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {prod.title}
                  </h3>

                  {/* Description */}
                  <p 
                    className="mu" 
                    style={{ 
                      fontSize: '13.5px', 
                      lineHeight: 1.5, 
                      marginBottom: '16px',
                      color: 'var(--text-muted)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {prod.cardDescription || prod.description}
                  </p>

                  {/* Tags */}
                  {prod.tags && prod.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                      {prod.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="tag" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.06)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Pricing and Action Strip */}
                  <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--bg-card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span className="d" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--yellow)' }}>
                          {prod.price === 0 ? 'FREE' : `₹${prod.price}`}
                        </span>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <span style={{ fontSize: '13px', color: 'var(--text-sub)', textDecoration: 'line-through' }}>
                            ₹{prod.originalPrice}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-sub)' }}>
                        Instant PDF Access
                      </span>
                    </div>

                    <Link
                      to={`/store/${prod.slug}`}
                      className="btn btn-yellow btn-sm"
                      style={{ padding: '0 20px', gap: '6px' }}
                    >
                      <span>{prod.price === 0 ? 'Get Free' : 'View'}</span>
                      <ArrowRight size={14} />
                    </Link>

                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </section>

    </div>
  );
};

export default Store;
