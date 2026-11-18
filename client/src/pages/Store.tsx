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
  Sparkles,
  ShieldCheck,
  Tag,
  GraduationCap,
  Download,
  FileCheck,
  Bell,
  Clock,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { getAssetUrl, handleImageError } from '../utils/imageUrl';

export const Store: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'All';
  const initialSubCat = searchParams.get('subcategory') || 'All';

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [homepageData, setHomepageData] = useState<any>(null);

  const [category, setCategory] = useState<string>(initialCat);
  const [subcategory, setSubcategory] = useState<string>(initialSubCat);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes, hpRes] = await Promise.all([
        api.get('/store/products'),
        api.get('/store/categories'),
        api.get('/store/homepage')
      ]);

      if (prodRes.success && Array.isArray(prodRes.data)) {
        setAllProducts(prodRes.data);
      } else {
        setError(prodRes.message || 'Unable to load notes. Please try again.');
      }

      if (catRes.success && Array.isArray(catRes.data)) {
        setCategories(catRes.data);
      }

      if (hpRes.success && hpRes.data) {
        setHomepageData(hpRes.data);
      }
    } catch (e: any) {
      console.warn('[STORE] Failed to fetch store data:', e);
      setError('Unable to connect to the backend server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setCategory(cat);
    }
    const sub = searchParams.get('subcategory');
    if (sub) {
      setSubcategory(sub);
    }
    const q = searchParams.get('search');
    if (q) {
      setSearch(q);
    }
  }, [searchParams]);

  // Selected Category Object to extract dynamic subcategories
  const selectedCategoryObj = useMemo(() => {
    return categories.find(c => c.name.toLowerCase() === category.toLowerCase());
  }, [categories, category]);

  const availableSubcategories = useMemo(() => {
    return selectedCategoryObj?.subcategories || [];
  }, [selectedCategoryObj]);

  const handleCategorySelect = (catName: string) => {
    setCategory(catName);
    setSubcategory('All');
    const newParams: Record<string, string> = {};
    if (catName !== 'All') {
      newParams.category = catName;
    }
    if (search) {
      newParams.search = search;
    }
    setSearchParams(newParams);
  };

  const handleSubcategorySelect = (subName: string) => {
    setSubcategory(subName);
    const newParams: Record<string, string> = {};
    if (category !== 'All') {
      newParams.category = category;
    }
    if (subName !== 'All') {
      newParams.subcategory = subName;
    }
    if (search) {
      newParams.search = search;
    }
    setSearchParams(newParams);
  };

  // Dynamic matching function
  const matchesCategoryAndSub = (p: any, cat: string, sub: string): boolean => {
    if (cat !== 'All') {
      const catLower = cat.toLowerCase().trim();
      const pCatLower = (p.category || '').toLowerCase().trim();
      const pSubLower = (p.subcategory || '').toLowerCase().trim();
      if (pCatLower !== catLower && pSubLower !== catLower) return false;
    }
    if (sub !== 'All') {
      const subLower = sub.toLowerCase().trim();
      const pSubLower = (p.subcategory || '').toLowerCase().trim();
      if (pSubLower !== subLower) return false;
    }
    return true;
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allProducts.length };
    categories.forEach(c => {
      counts[c.name] = allProducts.filter(p => matchesCategoryAndSub(p, c.name, 'All')).length;
    });
    return counts;
  }, [allProducts, categories]);

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(p => matchesCategoryAndSub(p, category, subcategory));

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
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
        (p.targetAudience && p.targetAudience.toLowerCase().includes(q)) ||
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
  }, [allProducts, category, subcategory, priceFilter, search, sortBy]);

  const defaultTrustItems = [
    {
      title: 'Curated Learning Resources',
      description: 'Every resource is selected and organized to help students prepare for academics, technical interviews, and placements.',
      icon: 'BookOpen'
    },
    {
      title: 'Clear Product Information',
      description: 'Students can check the topics, file format, learning outcomes, and pricing before purchasing.',
      icon: 'FileCheck'
    },
    {
      title: 'Student-Focused Platform',
      description: 'Resources are organized around real student learning and placement preparation needs.',
      icon: 'GraduationCap'
    },
    {
      title: 'Transparent Pricing',
      description: 'Display accurate prices without hidden charges. Zero surprise fees.',
      icon: 'Tag'
    },
    {
      title: 'Secure Payments',
      description: 'Official 256-bit SSL encrypted checkout powered securely by Razorpay.',
      icon: 'ShieldCheck'
    },
    {
      title: 'Easy Access to Resources',
      description: 'Instant digital downloads and lifetime perpetual access in your personal student vault.',
      icon: 'Download'
    }
  ];

  const trustItems = (homepageData?.whyTrustSection?.items && homepageData.whyTrustSection.items.length > 0)
    ? homepageData.whyTrustSection.items
    : defaultTrustItems;

  const announcement = homepageData?.announcement;

  const renderTrustIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileCheck': return <FileCheck size={22} color="var(--mint)" />;
      case 'GraduationCap': return <GraduationCap size={22} color="var(--yellow)" />;
      case 'Tag': return <Tag size={22} color="var(--coral)" />;
      case 'ShieldCheck': return <ShieldCheck size={22} color="var(--mint)" />;
      case 'Download': return <Download size={22} color="var(--yellow)" />;
      default: return <BookOpen size={22} color="var(--yellow)" />;
    }
  };

  return (
    <div className="store-page animate-fade-in" style={{ paddingBottom: '96px', background: 'var(--bg-cosmic)', minHeight: '100vh', color: '#FFFFFF' }}>
      
      {/* ================= 1. OPTIONAL ANNOUNCEMENT BANNER ================= */}
      {announcement?.enabled && announcement.text && (
        <div style={{ background: '#4F46E5', color: '#FFFFFF', padding: '10px 16px', textAlign: 'center', fontSize: '13.5px', fontWeight: 700 }}>
          <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Bell size={16} />
            <span>{announcement.text}</span>
            {announcement.link && (
              <Link to={announcement.link} style={{ color: '#FFD700', textDecoration: 'underline', marginLeft: '6px' }}>
                Learn More →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ================= 2. STORE HERO BANNER (COSMIC DARK THEME) ================= */}
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
            Comprehensive handwritten study notes, campus company question packs, and production-ready project source code.
          </p>

        </div>
      </section>

      {/* ================= 3. SEARCH & CONTROLS ================= */}
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
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

          </div>

        </div>

        {/* Dynamic Category Pills Strip */}
        <div className="tags-scroll" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: availableSubcategories.length > 0 ? '12px' : '24px' }}>
          
          {/* All Resources Pill */}
          <button
            onClick={() => handleCategorySelect('All')}
            className={`btn ${category === 'All' ? 'btn-yellow' : 'btn-dark'}`}
            style={{
              minHeight: '40px',
              padding: '0 16px',
              fontSize: '13px',
              fontWeight: 700,
              gap: '8px',
              flexShrink: 0
            }}
          >
            <span>All Resources</span>
            <span 
              style={{ 
                fontSize: '11px', 
                padding: '2px 8px', 
                borderRadius: '99px', 
                background: category === 'All' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.12)',
                color: category === 'All' ? 'var(--ink)' : '#FFFFFF'
              }}
            >
              {allProducts.length}
            </span>
          </button>

          {/* Dynamic Categories */}
          {categories.map(cat => {
            const isSelected = category.toLowerCase() === cat.name.toLowerCase();
            const count = categoryCounts[cat.name] ?? 0;
            return (
              <button
                key={cat.id || cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                className={`btn ${isSelected ? 'btn-yellow' : 'btn-dark'}`}
                style={{
                  minHeight: '40px',
                  padding: '0 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  gap: '8px',
                  flexShrink: 0
                }}
              >
                <span>{cat.name}</span>
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

        {/* Dynamic Dependent Subcategory Pills Strip */}
        {availableSubcategories.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '4px', flexShrink: 0 }}>
              Topics:
            </span>
            <button
              onClick={() => handleSubcategorySelect('All')}
              className={`btn btn-sm ${subcategory === 'All' ? 'btn-yellow' : 'btn-dark'}`}
              style={{ minHeight: '32px', padding: '0 12px', fontSize: '12px', flexShrink: 0 }}
            >
              All {category}
            </button>
            {availableSubcategories.map((sub: string) => {
              const isSubSelected = subcategory.toLowerCase() === sub.toLowerCase();
              return (
                <button
                  key={sub}
                  onClick={() => handleSubcategorySelect(sub)}
                  className={`btn btn-sm ${isSubSelected ? 'btn-yellow' : 'btn-dark'}`}
                  style={{ minHeight: '32px', padding: '0 12px', fontSize: '12px', flexShrink: 0 }}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}

        {/* Active Filters Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: 700 }}>
            Showing {filteredProducts.length} verified {filteredProducts.length === 1 ? 'material' : 'materials'}
          </span>

          {(category !== 'All' || subcategory !== 'All' || search || priceFilter !== 'all') && (
            <button
              onClick={() => {
                setCategory('All');
                setSubcategory('All');
                setSearch('');
                setPriceFilter('all');
                searchParams.delete('category');
                searchParams.delete('subcategory');
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

      {/* ================= 4. PRODUCT CARDS GRID (COSMIC DARK THEME) ================= */}
      <section className="wrap">
        
        {loading ? (
          <div className="store-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="pop" style={{ height: '360px', borderRadius: '24px', opacity: 0.5, background: 'var(--bg-card)', border: '2px solid var(--bg-card-border)' }}></div>
            ))}
          </div>
        ) : error ? (
          <div className="pop" style={{ borderRadius: '24px', padding: '3.5rem', textAlign: 'center', background: 'var(--bg-card)', border: '2px solid var(--bg-card-border)' }}>
            <p style={{ color: 'var(--coral)', fontWeight: 800, fontSize: '17px', marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchData} className="btn btn-yellow btn-sm">
              <RefreshCw size={14} /> Refresh Catalog
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="pop" style={{ borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center', maxWidth: '580px', margin: '2rem auto', background: 'var(--bg-card)', border: '2px solid var(--bg-card-border)' }}>
            <ShoppingBag size={48} color="var(--yellow)" style={{ margin: '0 auto 1.25rem' }} />
            <h3 className="d" style={{ fontSize: '26px', fontWeight: 800, marginBottom: '0.5rem', color: '#FFFFFF' }}>
              No notes match your selection
            </h3>
            <p className="mu" style={{ fontSize: '15px', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              {search ? `No materials found matching "${search}".` : 'No materials available in this category yet.'}
            </p>
            <button
              onClick={() => {
                setCategory('All');
                setSubcategory('All');
                setSearch('');
                setPriceFilter('all');
                searchParams.delete('category');
                searchParams.delete('subcategory');
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
                  border: '2px solid var(--bg-card-border)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 0,
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
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
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap', zIndex: 2 }}>
                    <span className="tag" style={{ background: 'var(--yellow)', color: 'var(--ink)', fontWeight: 800 }}>
                      {prod.category}
                    </span>
                    {prod.subcategory && (
                      <span className="tag" style={{ background: 'rgba(10, 9, 21, 0.85)', color: '#FFFFFF', border: '1px solid var(--bg-card-border-subtle)' }}>
                        {prod.subcategory}
                      </span>
                    )}
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
                        background: 'rgba(10, 9, 21, 0.85)',
                        color: '#FFFFFF',
                        border: '1px solid var(--bg-card-border-subtle)',
                        zIndex: 2
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
                      marginBottom: '14px',
                      color: 'var(--text-muted)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {prod.cardDescription || prod.description}
                  </p>

                  {/* Quality & Transparency Indicators */}
                  {Array.isArray(prod.qualityIndicators) && prod.qualityIndicators.length > 0 && (
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '14px' }}>
                      {prod.qualityIndicators.slice(0, 2).map((indicator: string) => (
                        <span 
                          key={indicator} 
                          className="tag" 
                          style={{ 
                            fontSize: '10.5px', 
                            background: 'rgba(255, 255, 255, 0.06)', 
                            border: '1px solid var(--bg-card-border-subtle)',
                            color: indicator === 'Beginner Friendly' ? 'var(--mint)' : (indicator === 'Interview Focused' ? 'var(--yellow)' : '#FFFFFF')
                          }}
                        >
                          {indicator}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {prod.tags && prod.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                      {prod.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="tag" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
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
                        Instant Digital Access
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

      {/* ================= 5. "WHY TRUST CONCEPTIFYYY?" SECTION (COSMIC DARK MATCH) ================= */}
      <section className="wrap" style={{ marginTop: '72px', paddingTop: '48px', borderTop: '1px solid var(--bg-card-border)' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <div className="hero-pill-badge" style={{ marginBottom: '14px' }}>
            <span className="dot"></span>
            <span>Transparent Student Platform</span>
          </div>
          <h2 className="d" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
            {homepageData?.whyTrustSection?.heading || 'Why Trust Conceptifyyy?'}
          </h2>
          <p className="mu" style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {homepageData?.whyTrustSection?.subtitle || 'Built with academic rigor, full transparency, and student-focused preparation.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px' }}>
          {trustItems.map((item: any, idx: number) => (
            <div 
              key={idx} 
              className="pop" 
              style={{ 
                background: 'var(--bg-card)', 
                border: '2px solid var(--bg-card-border)', 
                borderRadius: '20px', 
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '12px', 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1.5px solid var(--bg-card-border-subtle)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {renderTrustIcon(item.icon)}
              </div>
              <h3 className="d" style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                {item.title}
              </h3>
              <p className="mu" style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Store;
