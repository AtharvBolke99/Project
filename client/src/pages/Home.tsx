import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Download,
  Search,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { api } from '../services/api';
import { getAssetUrl, handleImageError } from '../utils/imageUrl';

export const Home: React.FC<{ onOpenAuth: () => void }> = () => {
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/store');
    }
  };

  const fetchTopProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/store/products');
      if (res.success && Array.isArray(res.data)) {
        // Filter test mode items
        const real = res.data.filter((p: any) => 
          p.category !== 'Test Mode' && 
          p.slug !== 'conceptifyyy-test-product' &&
          p.id !== 'prod_test_mode_item'
        );
        setTopProducts(real.slice(0, 4));
      } else {
        setError(res.message || 'Unable to load resources.');
      }
    } catch (err: any) {
      console.error('[HOME] Failed to fetch top products:', err);
      setError('Unable to connect to the backend server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const numberColors = ['#5B3DF5', '#FF8A6B', '#19C8A0', '#FFC933'];
  const tagBgs = ['#E3DDFF', '#FFE9A8', '#C9F7E8', '#FFD4C8'];

  return (
    <div className="home-page animate-fade-in" style={{ width: '100%', overflow: 'hidden' }}>
      
      {/* ================= 1. HERO SECTION (REFERENCE MATCH) ================= */}
      <section className="wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center', paddingTop: '48px', paddingBottom: '76px' }}>
        
        {/* Left Column: Heading, Subtitle & Search */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <span className="tag" style={{ background: '#C9F7E8' }}>
            Notes by toppers · for every exam
          </span>

          <h1 className="d" style={{ fontSize: 'clamp(40px, 5.5vw, 76px)', lineHeight: 1.04, fontWeight: 800 }}>
            Don't just study.<br />
            Get <span className="chip" style={{ background: '#FFC933' }}>the concept</span> <span className="chip" style={{ background: '#FF8A6B', transform: 'rotate(2deg)' }}>right.</span>
          </h1>

          <p className="mu" style={{ fontSize: '19px', lineHeight: 1.6, maxWidth: '520px' }}>
            India's student marketplace for clear, exam-ready notes, placement cheat sheets, and full-stack projects. Buy what you need, prepare what matters.
          </p>

          {/* Search Box with Pop Border and Shadow */}
          <form onSubmit={handleSearchSubmit} className="pop" style={{ display: 'flex', background: '#FFFFFF', borderRadius: '18px', padding: '6px', maxWidth: '560px', gap: '6px' }}>
            <input 
              aria-label="Search notes" 
              placeholder='Try "Company-Wise DSA", "Python", "Aptitude"...' 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1, minWidth: 0, border: 0, outline: 0, fontSize: '16px', padding: '0 16px', fontFamily: 'inherit', background: 'transparent', color: '#1B1740' }}
            />
            <button type="submit" className="btn v" style={{ borderRadius: '12px', boxShadow: 'none', minHeight: '44px' }}>
              Search
            </button>
          </form>

          {/* Quick Filter Tags */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '14px', fontWeight: 600, alignItems: 'center' }}>
            <span className="mu">Popular:</span>
            <Link to="/store?category=DSA+Notes" className="tag">DSA Notes</Link>
            <Link to="/store?search=Python" className="tag">Python</Link>
            <Link to="/store?search=MySQL" className="tag">MySQL</Link>
            <Link to="/store?category=Aptitude+Notes" className="tag">Aptitude</Link>
            <Link to="/store?category=Projects" className="tag">MERN Projects</Link>
            <Link to="/store?search=Resume" className="tag">92+ ATS Resume</Link>
          </div>
        </div>

        {/* Right Column: Playful Rotated Resource Cards */}
        <div style={{ flex: '1 1 400px', position: 'relative', minHeight: '480px', maxWidth: '520px', width: '100%' }}>
          
          {/* Card 1: Purple DSA Notes */}
          <Link to="/store/conceptifyyy-company-wise-dsa-placement-preparation-2026" className="pop" style={{ position: 'absolute', left: 0, top: '25px', width: '64%', background: '#5B3DF5', color: '#FFFFFF', borderRadius: '24px', padding: '22px', transform: 'rotate(-6deg)', minHeight: '230px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2, cursor: 'pointer' }}>
            <span className="tag" style={{ background: '#FFC933', color: '#1B1740' }}>DSA PLACEMENT</span>
            <h3 className="d" style={{ fontSize: '24px', lineHeight: 1.15, color: '#FFFFFF' }}>Company-Wise DSA Preparation</h3>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#EDE9FF' }}>192 pages · FREE Placement PDF</span>
          </Link>

          {/* Card 2: Yellow Python Mastery */}
          <Link to="/store/conceptifyyy-python-mastery-2026" className="pop" style={{ position: 'absolute', right: 0, top: '5px', width: '58%', background: '#FFC933', borderRadius: '24px', padding: '22px', transform: 'rotate(5deg)', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 1, cursor: 'pointer' }}>
            <span className="tag" style={{ background: '#FFFFFF' }}>PYTHON 2026</span>
            <h3 className="d" style={{ fontSize: '22px', lineHeight: 1.15, color: '#1B1740' }}>Complete Python Mastery Course</h3>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1B1740' }}>140 pages · ₹9 Instant PDF</span>
          </Link>

          {/* Card 3: Mint Projects */}
          <Link to="/store/centralized-realestate-management-system" className="pop" style={{ position: 'absolute', left: '14%', bottom: '15px', width: '66%', background: '#19C8A0', borderRadius: '24px', padding: '22px', transform: 'rotate(-2deg)', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 3, cursor: 'pointer' }}>
            <span className="tag" style={{ background: '#FFFFFF' }}>MERN PROJECTS</span>
            <h3 className="d" style={{ fontSize: '22px', lineHeight: 1.15, color: '#1B1740' }}>Centralized RealEstate System</h3>
            <span style={{ fontSize: '13px', fontWeight: 700, background: '#FFFFFF', border: '2px solid #1B1740', borderRadius: '99px', padding: '4px 12px', width: 'fit-content' }}>
              Full Source Code · Live Demo
            </span>
          </Link>

          {/* Floating Pill: Instant PDF */}
          <div className="pop" style={{ position: 'absolute', right: '4%', bottom: '115px', background: '#FFFFFF', borderRadius: '16px', padding: '10px 18px', fontWeight: 800, fontSize: '14px', transform: 'rotate(4deg)', zIndex: 4, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} color="#5B3DF5" />
            <span>Instant Access</span>
          </div>

        </div>

      </section>

      {/* ================= 2. VALUE TRUST STRIP ================= */}
      <section style={{ background: '#1B1740', color: '#FFFFFF', borderTop: '2px solid #1B1740', borderBottom: '2px solid #1B1740' }}>
        <div className="wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 36px', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', paddingBottom: '20px', fontWeight: 700, fontSize: '15px' }}>
          <span>✓ Quality-checked by Toppers</span>
          <span>✓ Instant PDF & Source Code Delivery</span>
          <span>✓ Secure UPI & Cards Checkout</span>
          <span>✓ 100% Student-Verified Notes</span>
        </div>
      </section>

      {/* ================= 3. BENTO SUBJECTS GRID ================= */}
      <section id="subjects" className="wrap" style={{ paddingTop: '84px', paddingBottom: '40px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '34px', maxWidth: '640px' }}>
          <span className="tag" style={{ background: '#E3DDFF' }}>Pick your zone</span>
          <h2 className="d" style={{ fontSize: 'clamp(32px, 4.2vw, 52px)', fontWeight: 800, lineHeight: 1.05 }}>
            What are you cracking today?
          </h2>
        </div>

        <div className="bento">
          {/* Main Big Bento Card */}
          <Link 
            to="/store?category=DSA+Notes" 
            className="bt pop" 
            style={{ gridColumn: 'span 2', gridRow: 'span 2', background: '#5B3DF5', color: '#FFFFFF' }}
          >
            <span className="tag" style={{ background: '#FFC933', color: '#1B1740' }}>POPULAR</span>
            <div>
              <h3 className="d" style={{ fontSize: '42px', lineHeight: 1, color: '#FFFFFF' }}>DSA & Placement</h3>
              <p style={{ marginTop: '10px', fontSize: '17px', color: '#EDE9FF' }}>
                Company-Wise Coding Questions · 40 Master Revision Problems · Big-O Cheat Sheets
              </p>
            </div>
          </Link>

          {/* Bento Card 2: DBMS / SQL */}
          <Link to="/store?search=MySQL" className="bt pop" style={{ background: '#FF8A6B' }}>
            <span className="tag">DATABASE</span>
            <h3 className="d" style={{ color: '#1B1740' }}>MySQL & DBMS Mastery</h3>
          </Link>

          {/* Bento Card 3: Engineering Projects */}
          <Link to="/store?category=Projects" className="bt pop" style={{ background: '#FFFFFF' }}>
            <span className="tag" style={{ background: '#C9F7E8' }}>FULL STACK</span>
            <h3 className="d" style={{ color: '#1B1740' }}>MERN Projects & Code</h3>
          </Link>

          {/* Bento Card 4: Aptitude */}
          <Link to="/store?category=Aptitude+Notes" className="bt pop" style={{ background: '#19C8A0' }}>
            <span className="tag">SPEED PACK</span>
            <h3 className="d" style={{ color: '#1B1740' }}>Aptitude & Reasoning</h3>
          </Link>

          {/* Bento Card 5: Python & Java */}
          <Link to="/store?search=Python" className="bt pop" style={{ background: '#FFC933' }}>
            <span className="tag">PROGRAMMING</span>
            <h3 className="d" style={{ color: '#1B1740' }}>Python Mastery Course</h3>
          </Link>

          {/* Bento Card 6: Campus Recruiter Packs */}
          <Link 
            to="/store?category=DSA+Notes" 
            className="bt pop" 
            style={{ gridColumn: 'span 4', background: '#1B1740', color: '#FFFFFF', flexDirection: 'row', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}
          >
            <div>
              <h3 className="d" style={{ fontSize: '28px', color: '#FFFFFF' }}>Top IT Hiring Exams</h3>
              <p style={{ fontSize: '14px', color: '#EDE9FF', marginTop: '4px' }}>Targeted question banks for off-campus & on-campus drives</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginLeft: 'auto' }}>
              <span className="tag" style={{ background: '#FFC933', color: '#1B1740' }}>TCS</span>
              <span className="tag" style={{ background: '#19C8A0', color: '#1B1740' }}>Cognizant</span>
              <span className="tag" style={{ background: '#FF8A6B', color: '#1B1740' }}>Infosys</span>
              <span className="tag" style={{ background: '#FFFFFF', color: '#1B1740' }}>Wipro</span>
              <span className="tag" style={{ background: '#E3DDFF', color: '#1B1740' }}>Accenture</span>
            </div>
          </Link>
        </div>

      </section>

      {/* ================= 4. TOP NOTES THIS WEEK (DYNAMIC DATABASE) ================= */}
      <section id="browse" className="wrap" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap', marginBottom: '34px' }}>
          <div>
            <span className="tag" style={{ background: '#C9F7E8', marginBottom: '8px' }}>Verified Materials</span>
            <h2 className="d" style={{ fontSize: 'clamp(32px, 4.2vw, 52px)', fontWeight: 800, lineHeight: 1.05 }}>
              Top notes this week
            </h2>
          </div>
          <Link to="/store" className="btn y">
            See all notes →
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gap: '20px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="pop skeleton-pop" style={{ height: '110px' }}></div>
            ))}
          </div>
        ) : error ? (
          <div className="pop" style={{ background: '#FFFFFF', borderRadius: '26px', padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--coral)', fontWeight: 700, marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchTopProducts} className="btn v btn-sm">
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : topProducts.length === 0 ? (
          <div className="pop" style={{ background: '#FFFFFF', borderRadius: '26px', padding: '3.5rem', textAlign: 'center' }}>
            <ShoppingBag size={42} color="var(--ink)" style={{ margin: '0 auto 1rem' }} />
            <h3 className="d" style={{ fontSize: '24px', fontWeight: 800 }}>No materials available currently</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {topProducts.map((prod, index) => {
              const numStr = String(index + 1).padStart(2, '0');
              const numColor = numberColors[index % numberColors.length];
              const tagBg = tagBgs[index % tagBgs.length];

              return (
                <Link
                  key={prod.id}
                  to={`/store/${prod.slug}`}
                  className="pop"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '26px',
                    padding: '22px 28px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    flexWrap: 'wrap',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                >
                  {/* Giant Number from Reference */}
                  <span className="d" style={{ fontSize: '56px', fontWeight: 800, color: numColor, lineHeight: 1, minWidth: '70px' }}>
                    {numStr}
                  </span>

                  {/* Thumbnail */}
                  <div style={{ width: '64px', height: '64px', borderRadius: '16px', border: '2px solid var(--ink)', overflow: 'hidden', flexShrink: 0, background: 'var(--lavender)' }}>
                    <img
                      src={getAssetUrl(prod.thumbnail)}
                      alt={prod.title}
                      onError={handleImageError}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span className="tag" style={{ background: tagBg }}>
                      {prod.category}
                    </span>
                    <h3 className="d" style={{ fontSize: '22px', fontWeight: 800, lineHeight: 1.2 }}>
                      {prod.title}
                    </h3>
                    <p className="mu" style={{ fontSize: '14px', lineHeight: 1.4 }}>
                      {prod.cardDescription || prod.shortDescription || prod.description}
                    </p>
                  </div>

                  {/* Price */}
                  <span className="d" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)' }}>
                    {prod.price === 0 ? 'FREE' : `₹${prod.price}`}
                  </span>

                  {/* CTA Button */}
                  <span className="btn v" style={{ minHeight: '44px', padding: '0 20px' }}>
                    {prod.price === 0 ? 'Download' : 'Buy now'}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

      </section>

      {/* ================= 5. FROM STUCK TO SORTED IN 3 MOVES ================= */}
      <section id="how" className="wrap" style={{ paddingTop: '88px', paddingBottom: '40px' }}>
        
        <h2 className="d" style={{ fontSize: 'clamp(32px, 4.2vw, 52px)', fontWeight: 800, lineHeight: 1.05, marginBottom: '40px' }}>
          From stuck to sorted in 3 moves
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
          
          {/* Step 1 */}
          <div className="step pop" style={{ background: '#E3DDFF' }}>
            <span className="d" style={{ fontSize: '56px', fontWeight: 800 }}>1</span>
            <h3 className="d" style={{ fontSize: '24px' }}>Find</h3>
            <p className="mu" style={{ lineHeight: 1.6, fontSize: '15px' }}>
              Search your placement topic, inspect chapter summaries, and review cheat sheet index outlines.
            </p>
          </div>

          {/* Step 2 (Staggered s2) */}
          <div className="step pop s2" style={{ background: '#FFE9A8', marginTop: '44px' }}>
            <span className="d" style={{ fontSize: '56px', fontWeight: 800 }}>2</span>
            <h3 className="d" style={{ fontSize: '24px' }}>Pay</h3>
            <p className="mu" style={{ lineHeight: 1.6, fontSize: '15px' }}>
              Checkout in seconds with seamless UPI, Google Pay, cards, or net banking via Razorpay.
            </p>
          </div>

          {/* Step 3 (Staggered s3) */}
          <div className="step pop s3" style={{ background: '#C9F7E8', marginTop: '88px' }}>
            <span className="d" style={{ fontSize: '56px', fontWeight: 800 }}>3</span>
            <h3 className="d" style={{ fontSize: '24px' }}>Ace it</h3>
            <p className="mu" style={{ lineHeight: 1.6, fontSize: '15px' }}>
              Download instantly and keep lifetime perpetual access in your private student download vault.
            </p>
          </div>

        </div>

      </section>

      {/* ================= 6. COMMUNITY / CREATOR SECTION ================= */}
      <section id="sell" className="wrap" style={{ paddingTop: '96px', paddingBottom: '96px' }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
          
          {/* Left Purple Card */}
          <div 
            className="pop" 
            style={{ 
              flex: '1 1 440px', 
              background: '#5B3DF5', 
              color: '#FFFFFF', 
              borderRadius: '30px', 
              padding: 'clamp(28px, 4vw, 52px)', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '18px', 
              justifyContent: 'center' 
            }}
          >
            <span className="tag" style={{ width: 'fit-content', background: '#FFFFFF', color: '#1B1740' }}>
              FOR TOPPERS & TEACHERS
            </span>
            <h2 className="d" style={{ fontSize: 'clamp(32px, 4vw, 50px)', fontWeight: 800, lineHeight: 1.05, color: '#FFFFFF' }}>
              Your notes can help thousands.
            </h2>
            <p style={{ fontSize: '17px', lineHeight: 1.6, color: '#EDE9FF' }}>
              Have comprehensive handwritten notes or production-grade engineering projects? Join our student creator circle. We handle digital delivery, hosting, and Razorpay payouts.
            </p>
            <Link to="/store" className="btn y" style={{ width: 'fit-content', minHeight: '52px', padding: '0 28px' }}>
              Explore Resources
            </Link>
          </div>

          {/* Right Yellow Stats Card with Bar Chart */}
          <div 
            className="pop" 
            style={{ 
              flex: '1 1 320px', 
              background: '#FFC933', 
              borderRadius: '30px', 
              padding: '32px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '14px', 
              justifyContent: 'center', 
              transform: 'rotate(1.5deg)' 
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '14px', color: '#1B1740', letterSpacing: '0.04em' }}>
              ENGINEERING STUDENTS PREPARING
            </span>
            <span className="d" style={{ fontSize: '56px', fontWeight: 800, lineHeight: 1, color: '#1B1740' }}>
              5,000+
            </span>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1B1740' }}>
              Placed in TCS, Cognizant, Infosys, Wipro & Accenture with Conceptifyyy placement notes.
            </p>
            {/* Playful Chart Bars from Reference */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', height: '80px', marginTop: '10px' }}>
              <div style={{ flex: 1, height: '35%', background: '#1B1740', borderRadius: '6px' }}></div>
              <div style={{ flex: 1, height: '55%', background: '#1B1740', borderRadius: '6px' }}></div>
              <div style={{ flex: 1, height: '45%', background: '#1B1740', borderRadius: '6px' }}></div>
              <div style={{ flex: 1, height: '75%', background: '#1B1740', borderRadius: '6px' }}></div>
              <div style={{ flex: 1, height: '100%', background: '#5B3DF5', borderRadius: '6px' }}></div>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
};
