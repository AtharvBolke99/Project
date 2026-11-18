import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Star, 
  FileText, 
  ArrowRight,
  RefreshCw,
  X,
  CheckCircle2,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { getAssetUrl, handleImageError } from '../utils/imageUrl';

export const Store: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'All';

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<string>(initialCat);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/store/products');
      if (res.success && Array.isArray(res.data)) {
        setAllProducts(res.data);
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
    const pCatLower = (p.category || '').toLowerCase();
    if (pCatLower === catLower) return true;

    const titleLower = (p.title || '').toLowerCase();
    const tagsLower = (p.tags || []).map((t: string) => t.toLowerCase());

    if (cat === 'Python') {
      return pCatLower.includes('python') || titleLower.includes('python') || tagsLower.includes('python');
    }
    if (cat === 'MySQL / DBMS') {
      return pCatLower.includes('sql') || pCatLower.includes('dbms') || titleLower.includes('sql') || titleLower.includes('database') || tagsLower.includes('mysql');
    }
    if (cat === 'DSA Notes') {
      return pCatLower.includes('dsa') || titleLower.includes('dsa') || tagsLower.includes('dsa');
    }
    if (cat === 'Aptitude Notes') {
      return pCatLower.includes('aptitude') || titleLower.includes('aptitude') || tagsLower.includes('aptitude');
    }
    if (cat === 'Projects') {
      return pCatLower.includes('project') || tagsLower.includes('mern') || tagsLower.includes('project');
    }
    if (cat === 'Placement Bundles') {
      return pCatLower.includes('placement') || pCatLower.includes('bundle') || titleLower.includes('resume');
    }
    return pCatLower === catLower;
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

  const getBadgeClass = (cat: string) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('dsa')) return 'store-badge store-badge-dsa';
    if (c.includes('python')) return 'store-badge store-badge-python';
    if (c.includes('sql') || c.includes('dbms')) return 'store-badge store-badge-mysql';
    if (c.includes('aptitude')) return 'store-badge store-badge-aptitude';
    if (c.includes('project')) return 'store-badge store-badge-projects';
    if (c.includes('placement') || c.includes('bundle') || c.includes('resume')) return 'store-badge store-badge-bundles';
    return 'store-badge store-badge-default';
  };

  return (
    <div className="store-modern-page animate-fade-in" style={{ paddingBottom: '96px' }}>
      
      {/* ================= 1. STORE HERO BANNER ================= */}
      <section className="store-hero">
        <div className="store-container">
          <div className="store-pill-badge">
            <span className="store-pill-dot"></span>
            <span>Instant Digital Download Store</span>
          </div>

          <h1 className="store-title">
            Find your next <span className="store-title-highlight">placement ace.</span>
          </h1>

          <p className="store-subtitle">
            Comprehensive handwritten study notes, campus company question packs, and production-ready project source code.
          </p>
        </div>
      </section>

      {/* ================= 2. SEARCH & CONTROLS ================= */}
      <section className="store-controls-section">
        <div className="store-container">
          
          {/* Search Bar & Dropdowns Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
            
            {/* Search Input */}
            <div className="store-search-bar">
              <Search size={18} color="#64748B" />
              <input
                type="text"
                className="store-search-input"
                placeholder="Search Python, MySQL, Aptitude, Projects, Resume..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', color: '#94A3B8' }}
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort & Price Filter Dropdowns */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <select
                className="store-select"
                value={priceFilter}
                onChange={e => setPriceFilter(e.target.value)}
                aria-label="Filter by price"
              >
                <option value="all">All Prices</option>
                <option value="free">Free Only</option>
                <option value="under20">Under ₹20</option>
                <option value="under50">Under ₹50</option>
              </select>

              <select
                className="store-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                aria-label="Sort products"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* Category Pills Strip */}
          <div className="store-category-scroll">
            {categories.map(cat => {
              const isSelected = category === cat.id;
              const count = categoryCounts[cat.id] ?? 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`store-cat-pill ${isSelected ? 'active' : ''}`}
                >
                  <span>{cat.label}</span>
                  <span className="store-cat-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Active Filter Counter & Clear Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 600 }}>
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
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  background: 'none', 
                  border: 'none', 
                  color: '#4F46E5', 
                  fontSize: '13px', 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>

        </div>
      </section>

      {/* ================= 3. PRODUCT CARDS GRID ================= */}
      <section>
        <div className="store-container">
          
          {loading ? (
            <div className="store-products-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="store-skeleton-card"></div>
              ))}
            </div>
          ) : error ? (
            <div className="store-empty-card">
              <p style={{ color: '#EF4444', fontWeight: 700, fontSize: '16px', marginBottom: '16px' }}>{error}</p>
              <button onClick={fetchProducts} className="store-btn-action">
                <RefreshCw size={14} /> Refresh Catalog
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="store-empty-card">
              <ShoppingBag size={48} color="#4F46E5" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                No materials match your selection
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '20px' }}>
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
                className="store-btn-action"
              >
                View All Resources
              </button>
            </div>
          ) : (
            <div className="store-products-grid">
              {filteredProducts.map(prod => {
                const isFree = prod.price === 0;
                const thumbnailSrc = getAssetUrl(prod.thumbnail);

                return (
                  <article key={prod.id} className="store-card">
                    
                    {/* Cover Container */}
                    <div className="store-card-cover">
                      {thumbnailSrc ? (
                        <img
                          src={thumbnailSrc}
                          alt={prod.title}
                          className="store-card-img"
                          onError={handleImageError}
                          loading="lazy"
                        />
                      ) : (
                        <div className="store-placeholder-cover">
                          <BookOpen size={36} />
                          <span style={{ fontSize: '13px', fontWeight: 700, marginTop: '8px' }}>{prod.category}</span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="store-card-badges">
                        <span className={getBadgeClass(prod.category)}>
                          {prod.category}
                        </span>
                        {prod.discountPercent > 0 && prod.price > 0 && (
                          <span className="store-badge store-badge-discount">
                            {prod.discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      {/* File Format Tag */}
                      {prod.fileFormat && (
                        <span className="store-badge-format">
                          {prod.fileFormat}
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="store-card-body">
                      
                      {/* Rating & Reviews */}
                      <div className="store-card-rating">
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={13} color="#F59E0B" fill="#F59E0B" />
                          ))}
                        </div>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>
                          {prod.rating || 4.9}
                        </span>
                        <span>({prod.reviewsCount || 120})</span>
                      </div>

                      {/* Title */}
                      <h3 className="store-card-title" title={prod.title}>
                        {prod.title}
                      </h3>

                      {/* Card Description */}
                      <p className="store-card-desc">
                        {prod.cardDescription || prod.shortDescription || prod.description}
                      </p>

                      {/* Card Footer: Pricing & Action */}
                      <div className="store-card-footer">
                        <div>
                          {isFree ? (
                            <span className="store-price-free">FREE</span>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                              <span className="store-price-main">₹{prod.price}</span>
                              {prod.originalPrice && prod.originalPrice > prod.price && (
                                <span className="store-price-original">₹{prod.originalPrice}</span>
                              )}
                            </div>
                          )}
                          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                            Instant PDF Download
                          </div>
                        </div>

                        <Link
                          to={`/store/${prod.slug}`}
                          className={`store-btn-action ${isFree ? 'free' : ''}`}
                        >
                          <span>{isFree ? 'Get Free' : 'View'}</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>

                    </div>

                  </article>
                );
              })}
            </div>
          )}

        </div>
      </section>

    </div>
  );
};

export default Store;
