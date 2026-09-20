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

const DEFAULT_STORE_PRODUCTS = [
  {
    id: "prod_794c11b7",
    title: "92+ ATS Score Resume Template",
    slug: "92-ats-score-resume-template",
    category: "Placement Bundles",
    cardDescription: "Create a clean, modern, and professional resume with our LaTeX Resume Template - designed for students, freshers, developers, and job seekers who want a polished resume without spending hours designing from scratch.",
    shortDescription: "Create a clean, modern, and professional resume with our LaTeX Resume Template - designed for students, freshers, developers, and job seekers who want a polished resume without spending hours designing from scratch.",
    price: 19,
    originalPrice: 49,
    discountPercent: 61,
    thumbnail: "/uploads/thumbnails/Screenshot_2026-09-18_131742_1789747839292_gh3a9jp.png",
    fileFormat: "DOCX",
    rating: 4.9,
    reviewsCount: 142,
    tags: ["Resume", "Placement", "ATS", "LaTeX"]
  },
  {
    id: "prod_aptitude_mastery",
    title: "Conceptifyyy Aptitude Mastery 2026–2027 | Complete Placement Preparation PDF",
    slug: "conceptifyyy-aptitude-mastery-2026-2027-complete-placement-preparation-pdf",
    category: "Aptitude Notes",
    cardDescription: "Master aptitude for campus placements and competitive exams with shortcuts, formulas, and solved question sets.",
    shortDescription: "Master aptitude for campus placements and competitive exams with shortcuts, formulas, and solved question sets.",
    price: 9,
    originalPrice: 49,
    discountPercent: 82,
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
    fileFormat: "PDF",
    rating: 4.9,
    reviewsCount: 113,
    tags: ["Aptitude", "Quantitative", "Logical Reasoning", "TCS NQT", "Placement"]
  },
  {
    id: "prod_python_mastery",
    title: "Conceptifyyy Python Mastery 2026 | Complete Python Programming Course PDF",
    slug: "conceptifyyy-python-mastery-2026-complete-python-programming-course-pdf",
    category: "Placement Bundles",
    cardDescription: "Complete Python programming notes from basics to advanced, OOPs, data structures, and top 50 coding questions.",
    shortDescription: "Complete Python programming notes from basics to advanced, OOPs, data structures, and top 50 coding questions.",
    price: 9,
    originalPrice: 49,
    discountPercent: 82,
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80",
    fileFormat: "PDF",
    rating: 4.9,
    reviewsCount: 146,
    tags: ["Python", "Placement", "Interview Prep", "Cheat Sheet"]
  },
  {
    id: "prod_mysql_mastery",
    title: "Conceptifyyy MySQL Mastery | Complete SQL & Database Programming PDF",
    slug: "conceptifyyy-mysql-mastery-complete-sql-database-programming-pdf",
    category: "Placement Bundles",
    cardDescription: "Master SQL and MySQL from beginner to advanced with schema designs, complex queries, indexing, and interview questions.",
    shortDescription: "Master SQL and MySQL from beginner to advanced with schema designs, complex queries, indexing, and interview questions.",
    price: 9,
    originalPrice: 49,
    discountPercent: 82,
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80",
    fileFormat: "PDF",
    rating: 4.9,
    reviewsCount: 140,
    tags: ["MySQL", "SQL", "DBMS", "Database", "Placement"]
  },
  {
    id: "prod_centralized_realestate",
    title: "Centralized RealEstate Management System | MERN Stack Project with Source Code , Live Demo & Documentation",
    slug: "centralized-realestate-management-system-mern-stack-project-with-source-code-live-demo-documentation",
    category: "Projects",
    cardDescription: "Build and explore a complete RealEstate Management System with React, Node.js, Express, and MongoDB including full source code.",
    shortDescription: "Build and explore a complete RealEstate Management System with React, Node.js, Express, and MongoDB including full source code.",
    price: 49,
    originalPrice: 199,
    discountPercent: 75,
    thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80",
    fileFormat: "ZIP",
    rating: 4.9,
    reviewsCount: 187,
    tags: ["MERN", "React", "Node.js", "MongoDB", "Real Estate", "Major Project"]
  },
  {
    id: "prod_helpora_booking",
    title: "Helpora Service Booking Platform | MERN Stack Project with Source Code, Live Demo & Documentation",
    slug: "helpora-service-booking-platform-mern-stack-project-with-source-code-live-demo-documentation",
    category: "Projects",
    cardDescription: "Helpora is a complete MERN Stack service marketplace platform connecting customers with service professionals.",
    shortDescription: "Helpora is a complete MERN Stack service marketplace platform connecting customers with service professionals.",
    price: 49,
    originalPrice: 199,
    discountPercent: 75,
    thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&auto=format&fit=crop&q=80",
    fileFormat: "ZIP",
    rating: 4.9,
    reviewsCount: 197,
    tags: ["MERN", "React", "Node.js", "MongoDB", "Service Booking", "Major Project"]
  }
];

const cleanProductList = (list: any[]): any[] => {
  return list.filter((p: any) => 
    p &&
    p.category !== 'Test Mode' && 
    p.slug !== 'conceptifyyy-test-product' && 
    p.id !== 'prod_test_mode_item' &&
    !p.title?.toLowerCase().includes('dsa handbook') &&
    !p.title?.toLowerCase().includes('speed tricks')
  );
};

const getCachedProducts = (): any[] => {
  try {
    const cached = localStorage.getItem(STORE_CACHE_KEY) || localStorage.getItem(VAULT_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleaned = cleanProductList(parsed);
        if (cleaned.length >= 6) {
          return cleaned;
        }
      }
    }
  } catch (e) {
    // Ignore storage parse errors
  }
  return DEFAULT_STORE_PRODUCTS;
};

export const Store: React.FC = () => {
  const [allProducts, setAllProducts] = useState<any[]>(getCachedProducts);
  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/store/products');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const cleaned = cleanProductList(res.data);
        if (cleaned.length > 0) {
          setAllProducts(cleaned);
          try {
            localStorage.setItem(STORE_CACHE_KEY, JSON.stringify(cleaned));
          } catch (e) {}
        }
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
    'Placement Bundles',
    'Aptitude Notes',
    'Projects',
    'Python',
    'MySQL / DBMS',
    'Resume'
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
      } else if (category === 'Resume') {
        const isResume = p.title?.toLowerCase().includes('resume') || 
                         (p.tags && p.tags.some((t: string) => t.toLowerCase().includes('resume')));
        if (!isResume) return false;
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
