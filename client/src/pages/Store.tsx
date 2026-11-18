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
  DownloadCloud,
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

  return (
    <div className="store-modern-page animate-fade-in" style={{ paddingBottom: '96px' }}>
      
      {/* ================= 1. OPTIONAL ANNOUNCEMENT BANNER ================= */}
      {announcement?.enabled && announcement.text && (
        <div style={{ background: '#4F46E5', color: '#FFFFFF', padding: '10px 16px', textAlign: 'center', fontSize: '13.5px', fontWeight: 700 }}>
          <div className="store-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
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

      {/* ================= 2. STORE HERO BANNER ================= */}
      <section className="store-hero">
        <div className="store-container">
          <div className="store-pill-badge">
            <span className="store-pill-dot"></span>
            <span>Transparent Student Digital Store</span>
          </div>

          <h1 className="store-title">
            Find your next <span className="store-title-highlight">placement ace.</span>
          </h1>

          <p className="store-subtitle">
            Curated handwritten study notes, campus company question packs, and production-ready project source code with complete learning breakdown.
          </p>
        </div>
      </section>

      {/* ================= 3. SEARCH & CONTROLS ================= */}
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
                placeholder="Search notes, topics, languages, target companies..."
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

          {/* Dynamic Main Category Pills Strip */}
          <div className="store-category-scroll">
            <button
              onClick={() => handleCategorySelect('All')}
              className={`store-cat-pill ${category === 'All' ? 'active' : ''}`}
            >
              <span>All Resources</span>
              <span className="store-cat-count">{categoryCounts['All'] || 0}</span>
            </button>
            {categories.map(cat => {
              const isSelected = category.toLowerCase() === cat.name.toLowerCase();
              const count = categoryCounts[cat.name] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`store-cat-pill ${isSelected ? 'active' : ''}`}
                >
                  <span>{cat.name}</span>
                  <span className="store-cat-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Dependent Subcategory Pills Strip (Appears only when category has subcategories) */}
          {availableSubcategories.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', padding: '2px 0 16px', scrollbarWidth: 'none' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '6px' }}>
                Topics:
              </span>
              <button
                onClick={() => handleSubcategorySelect('All')}
                className={`store-cat-pill ${subcategory === 'All' ? 'active' : ''}`}
                style={{ height: '32px', fontSize: '12px', padding: '0 12px' }}
              >
                All Topics in {category}
              </button>
              {availableSubcategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => handleSubcategorySelect(sub)}
                  className={`store-cat-pill ${subcategory === sub ? 'active' : ''}`}
                  style={{ height: '32px', fontSize: '12px', padding: '0 12px' }}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Active Filter Counter & Clear Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 600 }}>
              Showing {filteredProducts.length} verified {filteredProducts.length === 1 ? 'material' : 'materials'}
              {category !== 'All' && ` in ${category}`}
              {subcategory !== 'All' && ` > ${subcategory}`}
            </span>

            {(category !== 'All' || subcategory !== 'All' || search || priceFilter !== 'all') && (
              <button
                onClick={() => {
                  setCategory('All');
                  setSubcategory('All');
                  setSearch('');
                  setPriceFilter('all');
                  setSearchParams({});
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

      {/* ================= 4. PRODUCT CARDS GRID ================= */}
      <section style={{ marginBottom: '60px' }}>
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
              <button onClick={fetchData} className="store-btn-action">
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
                {search ? `No materials found matching "${search}".` : 'No materials available in this filter yet.'}
              </p>
              <button
                onClick={() => {
                  setCategory('All');
                  setSubcategory('All');
                  setSearch('');
                  setPriceFilter('all');
                  setSearchParams({});
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
                        <span className="store-badge store-badge-dsa">
                          {prod.category}
                        </span>
                        {prod.subcategory && (
                          <span className="store-badge" style={{ background: '#F8FAFC', color: '#334155', border: '1px solid #E2E8F0' }}>
                            {prod.subcategory}
                          </span>
                        )}
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
                      
                      {/* Quality Indicators (Only if explicitly selected by Admin) */}
                      {prod.qualityIndicators && prod.qualityIndicators.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                          {prod.qualityIndicators.slice(0, 2).map((qi: string) => (
                            <span 
                              key={qi} 
                              style={{ 
                                fontSize: '10.5px', 
                                fontWeight: 800, 
                                padding: '2px 8px', 
                                borderRadius: '6px', 
                                background: '#ECFDF5', 
                                color: '#059669',
                                border: '1px solid #D1FAE5'
                              }}
                            >
                              ✓ {qi}
                            </span>
                          ))}
                        </div>
                      )}

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

                      {/* Target Audience / Difficulty if available */}
                      {(prod.targetAudience || prod.difficulty) && (
                        <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <GraduationCap size={13} color="#4F46E5" />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {prod.difficulty ? `${prod.difficulty} • ` : ''}
                            {prod.targetAudience ? `For: ${prod.targetAudience}` : ''}
                          </span>
                        </div>
                      )}

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

      {/* ================= 5. DEDICATED "WHY TRUST CONCEPTIFYYY?" SECTION ================= */}
      <section style={{ background: '#FFFFFF', padding: '64px 0', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="store-container">
          
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '4px 12px', borderRadius: '999px', marginBottom: '12px' }}>
              <ShieldCheck size={14} /> Academic Transparency Standard
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0' }}>
              {homepageData?.whyTrustSection?.heading || 'Why Trust Conceptifyyy?'}
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              {homepageData?.whyTrustSection?.subtitle || 'Built with academic rigor, verified learning outcomes, and student-focused preparation.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '24px' }}>
            
            <div style={{ background: '#F8FAFC', padding: '28px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <BookOpen size={22} color="#4F46E5" />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Curated Learning Resources
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                Every resource is selected and organized to help students prepare for academics, technical interviews, and placements.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', padding: '28px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <FileCheck size={22} color="#059669" />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Clear Product Information
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                Students can check the topics, file format, learning outcomes, and pricing before purchasing.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', padding: '28px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <GraduationCap size={22} color="#7C3AED" />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Student-Focused Platform
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                Resources are organized around real student learning and placement preparation needs.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', padding: '28px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Tag size={22} color="#D97706" />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Transparent Pricing
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                Display accurate prices without hidden charges. Zero surprise fees or forced recurring subscriptions.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', padding: '28px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ShieldCheck size={22} color="#0891B2" />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Secure Payments
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                Official 256-bit SSL encrypted checkout powered securely by Razorpay with instant payment verification.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', padding: '28px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <DownloadCloud size={22} color="#DC2626" />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Easy Access to Resources
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                Instant digital downloads and permanent lifetime access in your personal student vault.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Store;
