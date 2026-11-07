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
  SlidersHorizontal,
  ArrowUpDown
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
    { id: 'All', label: 'All Resources', color: '#FFFFFF', tagBg: '#FFFFFF' },
    { id: 'Python', label: 'Python Course', color: '#FFC933', tagBg: '#FFE9A8' },
    { id: 'MySQL / DBMS', label: 'MySQL & DBMS', color: '#FF8A6B', tagBg: '#FFD4C8' },
    { id: 'DSA Notes', label: 'DSA Placement Prep', color: '#5B3DF5', tagBg: '#E3DDFF' },
    { id: 'Aptitude Notes', label: 'Aptitude & Reasoning', color: '#19C8A0', tagBg: '#C9F7E8' },
    { id: 'Placement Bundles', label: 'Resume & Bundles', color: '#FFC933', tagBg: '#FFE9A8' },
    { id: 'Projects', label: 'Full-Stack Projects', color: '#19C8A0', tagBg: '#C9F7E8' }
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
      return titleLower.includes('python') || tagsLower.some((t: string) => t.includes('python'));
    }
    if (cat === 'MySQL / DBMS') {
      return titleLower.includes('mysql') || titleLower.includes('dbms') || titleLower.includes('sql') || tagsLower.some((t: string) => t.includes('mysql') || t.includes('sql') || t.includes('dbms'));
    }
    if (cat === 'DSA Notes') {
      return p.category === 'DSA Notes' || titleLower.includes('dsa') || tagsLower.some((t: string) => t.includes('dsa'));
    }
    if (cat === 'Aptitude Notes') {
      return p.category === 'Aptitude Notes' || titleLower.includes('aptitude') || tagsLower.some((t: string) => t.includes('aptitude'));
    }
    if (cat === 'Placement Bundles') {
      return p.category === 'Placement Bundles' || titleLower.includes('resume') || tagsLower.some((t: string) => t.includes('resume'));
    }
    if (cat === 'Projects') {
      return p.category === 'Projects' || tagsLower.some((t: string) => t.includes('mern') || t.includes('project'));
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
    <div className="store-page animate-fade-in" style={{ paddingBottom: '96px' }}>
      
      {/* ================= 1. STORE HEADER BANNER ================= */}
      <section className="wrap" style={{ paddingTop: '40px', paddingBottom: '32px' }}>
        <div style={{ maxWidth: '820px' }}>
          
          <span className="tag" style={{ background: '#C9F7E8', marginBottom: '14px' }}>
            Instant Digital Download Store
          </span>

          <h1 className="d" style={{ fontSize: 'clamp(36px, 5.2vw, 64px)', lineHeight: 1.05, fontWeight: 800, marginBottom: '14px' }}>
            Find your next <span className="chip" style={{ background: '#FFC933' }}>placement ace.</span>
          </h1>

          <p className="mu" style={{ fontSize: '18px', lineHeight: 1.6, maxWidth: '640px' }}>
            Comprehensive handwritten study notes, campus company question packs, and production-ready MERN project source code.
          </p>

        </div>
      </section>

      {/* ================= 2. SEARCH & CONTROLS ================= */}
      <section className="wrap" style={{ paddingBottom: '24px' }}>
        
        {/* Search & Sort Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          
          {/* Pop Search Input */}
          <div className="pop" style={{ display: 'flex', background: '#FFFFFF', borderRadius: '18px', padding: '6px', flex: '1 1 340px', maxWidth: '520px', gap: '6px', alignItems: 'center' }}>
            <Search size={18} color="var(--muted)" style={{ marginLeft: '10px' }} />
            <input
              type="text"
              placeholder="Search Python, MySQL, Aptitude, Projects, Resume..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 0, border: 0, outline: 0, fontSize: '15px', padding: '0 8px', fontFamily: 'inherit', background: 'transparent', color: '#1B1740' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', color: 'var(--muted)' }}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
            <button className="btn v" style={{ minHeight: '38px', padding: '0 18px', borderRadius: '12px', boxShadow: 'none' }}>
              Filter
            </button>
          </div>

          {/* Sort & Price Filter Dropdowns */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            
            {/* Price Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <select
                value={priceFilter}
                onChange={e => setPriceFilter(e.target.value)}
                className="select"
                style={{ minHeight: '44px', padding: '0 14px', borderRadius: '14px', fontSize: '14px', fontWeight: 700 }}
              >
                <option value="all">All Prices</option>
                <option value="free">Free Only (₹0)</option>
                <option value="under20">Under ₹20</option>
                <option value="under50">Under ₹50</option>
              </select>
            </div>

            {/* Sorting */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="select"
                style={{ minHeight: '44px', padding: '0 14px', borderRadius: '14px', fontSize: '14px', fontWeight: 700 }}
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
                className={`btn ${isSelected ? 'v' : ''}`}
                style={{
                  minHeight: '40px',
                  padding: '0 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: isSelected ? 'var(--purple)' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : 'var(--ink)'
                }}
              >
                <span>{cat.label}</span>
                <span 
                  style={{ 
                    fontSize: '11px', 
                    padding: '2px 8px', 
                    borderRadius: '99px', 
                    border: '1.5px solid var(--ink)', 
                    background: isSelected ? '#FFC933' : 'var(--lavender-accent)',
                    color: '#1B1740'
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
          <span style={{ fontSize: '15px', color: 'var(--ink)', fontWeight: 700 }}>
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
              className="btn y btn-sm"
              style={{ gap: '4px' }}
            >
              <X size={14} /> Clear All Filters
            </button>
          )}
        </div>

      </section>

      {/* ================= 3. PRODUCT CARDS GRID (POPPING NEOBRUTALISM) ================= */}
      <section className="wrap">
        
        {loading ? (
          <div className="store-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="pop skeleton-pop" style={{ height: '360px', borderRadius: '26px' }}></div>
            ))}
          </div>
        ) : error ? (
          <div className="pop" style={{ background: '#FFFFFF', borderRadius: '26px', padding: '3.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--coral)', fontWeight: 800, fontSize: '17px', marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchProducts} className="btn v btn-sm">
              <RefreshCw size={14} /> Refresh Catalog
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="pop" style={{ background: '#FFFFFF', borderRadius: '26px', padding: '4rem 2rem', textAlign: 'center', maxWidth: '580px', margin: '2rem auto' }}>
            <ShoppingBag size={48} color="var(--ink)" style={{ margin: '0 auto 1.25rem' }} />
            <h3 className="d" style={{ fontSize: '26px', fontWeight: 800, marginBottom: '0.5rem' }}>
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
              className="btn y"
            >
              View All Resources
            </button>
          </div>
        ) : (
          <div className="store-grid">
            {filteredProducts.map(prod => (
              <div
                key={prod.id}
                className="pop card-hover"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '26px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 0
                }}
              >
                {/* Image Cover Container */}
                <div style={{ position: 'relative', width: '100%', height: '190px', background: 'var(--lavender-accent)', borderBottom: '2px solid var(--ink)', overflow: 'hidden' }}>
                  <img
                    src={getAssetUrl(prod.thumbnail)}
                    alt={prod.title}
                    onError={handleImageError}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Badges on Top */}
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="tag" style={{ background: '#E3DDFF' }}>
                      {prod.category}
                    </span>
                    {prod.discountPercent > 0 && prod.price > 0 && (
                      <span className="tag" style={{ background: '#FF8A6B' }}>
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
                        background: '#FFFFFF' 
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
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ink)' }}>
                      {prod.rating || 4.9}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      ({prod.reviewsCount || 120} reviews)
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3 
                    className="d" 
                    style={{ 
                      fontSize: '20px', 
                      fontWeight: 800, 
                      lineHeight: 1.25, 
                      marginBottom: '8px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {prod.title}
                  </h3>

                  {/* Short Description */}
                  <p 
                    className="mu" 
                    style={{ 
                      fontSize: '14px', 
                      lineHeight: 1.5, 
                      marginBottom: '14px',
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {prod.cardDescription || prod.shortDescription || prod.description}
                  </p>

                  {/* Highlights Bullets */}
                  {prod.whatIncluded && Array.isArray(prod.whatIncluded) && prod.whatIncluded.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '16px' }}>
                      {prod.whatIncluded.slice(0, 2).map((item: string, idx: number) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink)', fontWeight: 600 }}>
                          <CheckCircle2 size={14} color="#19C8A0" style={{ flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Price & CTA Action Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '2px solid var(--lavender-accent)', marginTop: 'auto' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span className="d" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--ink)' }}>
                          {prod.price === 0 ? 'FREE' : `₹${prod.price}`}
                        </span>
                        {prod.originalPrice > prod.price && (
                          <span style={{ fontSize: '13px', color: 'var(--muted)', textDecoration: 'line-through' }}>
                            ₹{prod.originalPrice}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', color: '#19C8A0', fontWeight: 800, textTransform: 'uppercase' }}>
                        {prod.price === 0 ? 'Free Placement PDF' : 'Instant Download'}
                      </span>
                    </div>

                    <Link
                      to={`/store/${prod.slug}`}
                      className="btn v btn-sm"
                      style={{ gap: '6px' }}
                    >
                      {prod.price === 0 || prod.isPurchased ? (
                        <>
                          <Download size={14} /> Download
                        </>
                      ) : (
                        <>
                          <span>Get access</span>
                          <ArrowRight size={14} />
                        </>
                      )}
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
