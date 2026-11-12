import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ArrowRight, 
  Star, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  Download,
  Code2,
  Brain,
  ShoppingBag
} from 'lucide-react';
import { api } from '../services/api';
import { getAssetUrl, handleImageError } from '../utils/imageUrl';

export const Home: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [emailInput, setEmailInput] = useState<string>('');
  const [quizSelected, setQuizSelected] = useState<'linear' | 'constant'>('constant');
  const [explainLevel, setExplainLevel] = useState<'quick' | 'deep' | 'exam'>('quick');

  const navigate = useNavigate();

  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/store/products');
      if (res.success && Array.isArray(res.data)) {
        const real = res.data.filter((p: any) => 
          p.isPublished && 
          p.category !== 'Test Mode' && 
          p.slug !== 'conceptifyyy-test-product' &&
          p.id !== 'prod_test_mode_item'
        );
        setTopProducts(real.slice(0, 6));
      }
    } catch (err: any) {
      console.error('[HOME] Failed to fetch top products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenAuth();
  };

  return (
    <div style={{ width: '100%', overflow: 'hidden', background: 'var(--bg-cosmic)' }}>
      
      {/* ================= 1. HERO SECTION (REFERENCE SCREENSHOT MATCH) ================= */}
      <section className="wrap" style={{ paddingTop: 'clamp(40px, 6vw, 72px)', paddingBottom: 'clamp(48px, 6vw, 84px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', gap: '48px', alignItems: 'center' }}>
          
          {/* Left Hero Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Top Pill: "● Verified Notes & Placement Vault" */}
            <div className="hero-pill-badge">
              <span className="dot"></span>
              <span>Verified Notes & Placement Vault</span>
            </div>

            {/* Giant Title: "Learn the idea. Not just the answer." */}
            <h1 className="d" style={{ fontSize: 'clamp(44px, 6vw, 76px)', lineHeight: 1.05, color: '#FFFFFF', fontWeight: 800 }}>
              Learn the<br />
              idea.<br />
              <span style={{ color: 'var(--yellow)', fontStyle: 'italic', fontWeight: 800 }}>Not just</span><br />
              the answer.
            </h1>

            {/* Subtitle */}
            <p className="mu" style={{ fontSize: 'clamp(16px, 2vw, 19px)', lineHeight: 1.6, maxWidth: '480px', color: 'var(--text-muted)' }}>
              Master Python, MySQL, DSA, Aptitude, and Full-Stack projects with verified concept-first notes, interview cheat sheets, and source code.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/store" className="btn btn-yellow btn-lg">
                Explore Notes & Vault
              </Link>
              <a href="#how-it-works" className="btn btn-dark btn-lg">
                How It Works
              </a>
            </div>

          </div>

          {/* Right Hero Graphic: Cosmic Concept Planetary System */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', width: '100%', minHeight: '440px' }}>
            
            <div style={{ position: 'relative', width: '380px', height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Outer Orbit 3 */}
              <div 
                style={{ 
                  position: 'absolute', 
                  width: '380px', 
                  height: '380px', 
                  borderRadius: '50%', 
                  border: '1.5px dashed rgba(255, 255, 255, 0.15)',
                  animation: 'spin 40s linear infinite'
                }}
              >
                {/* Planet Dot on Outer Orbit */}
                <div style={{ position: 'absolute', top: '15px', right: '70px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--mint)' }}></div>
                <div style={{ position: 'absolute', bottom: '60px', right: '20px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--purple-light)' }}></div>
              </div>

              {/* Middle Orbit 2 */}
              <div 
                style={{ 
                  position: 'absolute', 
                  width: '280px', 
                  height: '280px', 
                  borderRadius: '50%', 
                  border: '1.5px dashed rgba(255, 255, 255, 0.18)' 
                }}
              >
                {/* Planet Dot on Middle Orbit */}
                <div style={{ position: 'absolute', top: '40px', left: '20px', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--coral)' }}></div>
              </div>

              {/* Inner Orbit 1 */}
              <div 
                style={{ 
                  position: 'absolute', 
                  width: '190px', 
                  height: '190px', 
                  borderRadius: '50%', 
                  border: '1.5px dashed rgba(255, 255, 255, 0.22)' 
                }}
              >
                {/* Planet Dot on Inner Orbit */}
                <div style={{ position: 'absolute', top: '20px', right: '24px', width: '16px', height: '16px', borderRadius: '50%', background: '#38E7AF' }}></div>
              </div>

              {/* Center Sun: "Conceptifyyy Notes" */}
              <div 
                style={{ 
                  width: '104px', 
                  height: '104px', 
                  borderRadius: '50%', 
                  background: 'var(--yellow)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  textAlign: 'center',
                  color: 'var(--ink)', 
                  fontWeight: 800, 
                  fontSize: '15px', 
                  lineHeight: 1.15,
                  boxShadow: '0 0 35px rgba(255, 201, 51, 0.45)',
                  zIndex: 10
                }}
              >
                <span>Conceptifyyy</span>
                <span>Notes</span>
              </div>

              {/* Orbiting Pill 1: "Deep Intuition" (Top Left) */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '18px', 
                  left: '-10px', 
                  background: '#FFFFFF', 
                  color: 'var(--ink)', 
                  fontWeight: 700, 
                  fontSize: '13px', 
                  padding: '8px 16px', 
                  borderRadius: '999px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                  zIndex: 12
                }}
              >
                Deep Intuition
              </div>

              {/* Orbiting Pill 2: "Verified Code & PDF" (Right Side) */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '42%', 
                  right: '-25px', 
                  background: 'var(--coral)', 
                  color: 'var(--ink)', 
                  fontWeight: 700, 
                  fontSize: '13px', 
                  padding: '8px 16px', 
                  borderRadius: '999px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                  zIndex: 12
                }}
              >
                Verified Code & PDF
              </div>

              {/* Orbiting Pill 3: "Placement Ready" (Bottom Left) */}
              <div 
                style={{ 
                  position: 'absolute', 
                  bottom: '30px', 
                  left: '10px', 
                  background: '#FFFFFF', 
                  color: 'var(--ink)', 
                  fontWeight: 700, 
                  fontSize: '13px', 
                  padding: '8px 18px', 
                  borderRadius: '999px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                  zIndex: 12
                }}
              >
                Placement Ready
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= 2. TICKER MARQUEE (EXACT STUDENT SUBJECTS) ================= */}
      <div 
        style={{ 
          background: 'var(--yellow)', 
          color: 'var(--ink)', 
          padding: '14px 0', 
          overflow: 'hidden', 
          whiteSpace: 'nowrap',
          borderTop: '2px solid #000000',
          borderBottom: '2px solid #000000',
          fontSize: '16px',
          fontWeight: 800,
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.02em'
        }}
      >
        <div style={{ display: 'inline-block', animation: 'marquee 25s linear infinite' }}>
          Python Mastery ✦ MySQL & DBMS ✦ DSA Placement Prep ✦ Quantitative Aptitude ✦ Full-Stack MERN Projects ✦ 92+ ATS Resumes ✦ Logical Reasoning ✦ Interview Cheat Sheets ✦ Python Mastery ✦ MySQL & DBMS ✦ DSA Placement Prep ✦ Quantitative Aptitude ✦ Full-Stack MERN Projects ✦ 92+ ATS Resumes ✦
        </div>
      </div>

      {/* ================= 3. HOW IT WORKS (STUDENT NOTES WORKFLOW) ================= */}
      <section id="how-it-works" className="wrap" style={{ paddingTop: '80px', paddingBottom: '70px' }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: '40px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            HOW IT WORKS
          </span>
          <h2 className="d" style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', color: '#FFFFFF', fontWeight: 800 }}>
            Three moves to <span className="title-box">“oh, I get it!”</span>
          </h2>
        </div>

        {/* 3 Moves Cards */}
        <div className="moves-grid">
          
          {/* Card 1 */}
          <div className="pop" style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="d" style={{ fontSize: '64px', color: 'var(--mint)', lineHeight: 1, fontWeight: 800 }}>
              1
            </div>
            <h3 className="d" style={{ fontSize: '24px', color: '#FFFFFF', margin: 0 }}>
              Pick your subject
            </h3>
            <p className="mu" style={{ fontSize: '15px', lineHeight: 1.6, margin: 0, color: 'var(--text-muted)' }}>
              Select verified notes in Python, MySQL, DSA, Aptitude, or MERN full-stack projects.
            </p>
          </div>

          {/* Card 2 */}
          <div className="pop" style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="d" style={{ fontSize: '64px', color: 'var(--coral)', lineHeight: 1, fontWeight: 800 }}>
              2
            </div>
            <h3 className="d" style={{ fontSize: '24px', color: '#FFFFFF', margin: 0 }}>
              Master the intuition
            </h3>
            <p className="mu" style={{ fontSize: '15px', lineHeight: 1.6, margin: 0, color: 'var(--text-muted)' }}>
              Understand fundamental logic, visual algorithm flowcharts, and high-frequency interview patterns.
            </p>
          </div>

          {/* Card 3 */}
          <div className="pop" style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="d" style={{ fontSize: '64px', color: 'var(--yellow)', lineHeight: 1, fontWeight: 800 }}>
              3
            </div>
            <h3 className="d" style={{ fontSize: '24px', color: '#FFFFFF', margin: 0 }}>
              Instant vault access
            </h3>
            <p className="mu" style={{ fontSize: '15px', lineHeight: 1.6, margin: 0, color: 'var(--text-muted)' }}>
              Instant PDF download and perpetual access to digital files, source code, and updates in your personal vault.
            </p>
          </div>

        </div>

      </section>

      {/* ================= 4. FEATURES BENTO ================= */}
      <section id="features" className="wrap" style={{ paddingTop: '20px', paddingBottom: '70px' }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: '40px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            FEATURES
          </span>
          <h2 className="d" style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', color: '#FFFFFF', fontWeight: 800 }}>
            Built for how <br />
            students <span style={{ fontStyle: 'italic', fontWeight: 800 }}>really</span> think
          </h2>
        </div>

        {/* 4 Feature Cards Bento Grid */}
        <div className="bento-features">
          
          {/* Card 1 (Yellow): Concept maps */}
          <div className="pop-yellow" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{ maxWidth: '320px' }}>
                <h3 className="d" style={{ fontSize: '28px', color: 'var(--ink)', marginBottom: '8px' }}>
                  Concept maps
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
                  Visual algorithmic flows, database schemas, and structured placement roadmaps in one clear view.
                </p>
              </div>

              {/* Constellation Network Diagram */}
              <div style={{ position: 'relative', width: '130px', height: '100px', flexShrink: 0 }}>
                {/* Connecting Lines */}
                <svg width="130" height="100" style={{ position: 'absolute', inset: 0 }}>
                  <line x1="65" y1="50" x2="25" y2="25" stroke="#1B1740" strokeWidth="2.5" />
                  <line x1="65" y1="50" x2="105" y2="25" stroke="#1B1740" strokeWidth="2.5" />
                  <line x1="65" y1="50" x2="25" y2="75" stroke="#1B1740" strokeWidth="2.5" />
                  <line x1="65" y1="50" x2="105" y2="75" stroke="#1B1740" strokeWidth="2.5" />
                </svg>
                {/* Center Node */}
                <div style={{ position: 'absolute', left: '53px', top: '38px', width: '24px', height: '24px', borderRadius: '50%', background: '#1B1740', border: '2px solid #1B1740' }}></div>
                {/* Satellite Nodes */}
                <div style={{ position: 'absolute', left: '16px', top: '16px', width: '18px', height: '18px', borderRadius: '50%', background: '#00E5FF', border: '2px solid #1B1740' }}></div>
                <div style={{ position: 'absolute', right: '16px', top: '16px', width: '18px', height: '18px', borderRadius: '50%', background: '#FF8A6B', border: '2px solid #1B1740' }}></div>
                <div style={{ position: 'absolute', left: '16px', bottom: '16px', width: '18px', height: '18px', borderRadius: '50%', background: '#A78BFA', border: '2px solid #1B1740' }}></div>
                <div style={{ position: 'absolute', right: '16px', bottom: '16px', width: '18px', height: '18px', borderRadius: '50%', background: '#FFFFFF', border: '2px solid #1B1740' }}></div>
              </div>
            </div>
          </div>

          {/* Card 2 (Mint): Explain it your way */}
          <div className="pop-mint" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
            <div>
              <h3 className="d" style={{ fontSize: '28px', color: 'var(--ink)', marginBottom: '8px' }}>
                Explain it your way
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
                {explainLevel === 'quick' && 'Intuitive bullet points, key takeaways & visual diagrams.'}
                {explainLevel === 'deep' && 'Complete chapter coverage, code flow & architectural concepts.'}
                {explainLevel === 'exam' && 'Time complexities, edge cases & placement interview questions.'}
              </p>
            </div>

            {/* Pill Toggles */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '24px' }}>
              {(['quick', 'deep', 'exam'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setExplainLevel(lvl)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    border: '1.5px solid var(--ink)',
                    background: explainLevel === lvl ? 'var(--ink)' : 'rgba(255,255,255,0.7)',
                    color: explainLevel === lvl ? '#FFFFFF' : 'var(--ink)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {lvl === 'quick' ? 'Quick Notes' : lvl === 'deep' ? 'Deep Dive' : 'Exam-Ready'}
                </button>
              ))}
            </div>
          </div>

          {/* Card 3 (Dark Navy): Mini quizzes */}
          <div className="pop" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
            <div>
              <h3 className="d" style={{ fontSize: '28px', color: '#FFFFFF', marginBottom: '8px' }}>
                Placement Quizzes
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                What is the average time complexity of a HashMap lookup?
              </p>
            </div>

            {/* Quiz Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => setQuizSelected('linear')}
                style={{
                  width: '100%',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: quizSelected === 'linear' ? '1.5px solid var(--coral)' : '1.5px solid var(--bg-card-border-subtle)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '14px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                O(N) - Linear scan
              </button>
              <button
                onClick={() => setQuizSelected('constant')}
                style={{
                  width: '100%',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--mint)',
                  background: 'var(--mint)',
                  color: 'var(--ink)',
                  fontWeight: 800,
                  fontSize: '14px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                O(1) - Constant time ✓
              </button>
            </div>
          </div>

          {/* Card 4 (Coral): Streak garden */}
          <div className="pop-coral" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
            <div>
              <h3 className="d" style={{ fontSize: '28px', color: 'var(--ink)', marginBottom: '8px' }}>
                Streak garden
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
                Track your daily placement preparation, coding practice, and revision milestones.
              </p>
            </div>

            {/* Streak Grid Blocks (From Reference Screenshot) */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '24px' }}>
              {[
                '#1B1740', '#1B1740', '#00E5FF', '#1B1740', '#1B1740',
                '#1B1740', '#1B1740', '#00E5FF', '#1B1740', '#FFFFFF', '#FFFFFF'
              ].map((color, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '5px',
                    background: color,
                    border: '1.5px solid rgba(0,0,0,0.15)'
                  }}
                />
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* ================= 5. LIVE STORE RESOURCES SHOWCASE ================= */}
      <section className="wrap" style={{ paddingTop: '20px', paddingBottom: '70px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              STUDENT MARKETPLACE
            </span>
            <h2 className="d" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: '#FFFFFF', fontWeight: 800 }}>
              Verified Notes & Projects
            </h2>
          </div>
          <Link to="/store" className="btn btn-yellow btn-sm">
            Explore All Materials <ArrowRight size={16} />
          </Link>
        </div>

        {/* Live Products Grid */}
        <div className="store-grid">
          {topProducts.map((prod) => (
            <div
              key={prod.id}
              className="pop"
              style={{
                background: 'var(--bg-card)',
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* Thumbnail */}
              <div style={{ height: '180px', width: '100%', position: 'relative', overflow: 'hidden', background: '#0E0D22' }}>
                <img
                  src={getAssetUrl(prod.thumbnail)}
                  alt={prod.title}
                  onError={handleImageError}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span 
                  className="tag" 
                  style={{ 
                    position: 'absolute', 
                    top: '12px', 
                    left: '12px', 
                    background: 'var(--yellow)', 
                    color: 'var(--ink)', 
                    fontWeight: 800 
                  }}
                >
                  {prod.category}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 
                    className="d" 
                    style={{ 
                      fontSize: '18px', 
                      color: '#FFFFFF', 
                      lineHeight: 1.3, 
                      marginBottom: '6px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {prod.title}
                  </h3>
                  <p 
                    className="mu" 
                    style={{ 
                      fontSize: '13px', 
                      lineHeight: 1.5, 
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {prod.cardDescription || prod.description || 'Comprehensive exam preparation materials.'}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--bg-card-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span className="d" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--yellow)' }}>
                      {prod.price === 0 ? 'FREE' : `₹${prod.price}`}
                    </span>
                    {prod.originalPrice && prod.originalPrice > prod.price && (
                      <span style={{ fontSize: '13px', color: 'var(--text-sub)', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                    )}
                  </div>

                  <Link to={`/store/${prod.slug}`} className="btn btn-yellow btn-sm">
                    {prod.price === 0 ? 'Get Free' : 'View Details'}
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ================= 6. BIG CTA BANNER (PAGE 2 BOTTOM SCREENSHOT) ================= */}
      <section className="wrap" style={{ paddingBottom: '90px' }}>
        
        <div className="pop-cta" style={{ padding: 'clamp(40px, 6vw, 64px) clamp(24px, 5vw, 48px)', textAlign: 'center' }}>
          
          <h2 className="d" style={{ fontSize: 'clamp(38px, 6vw, 64px)', lineHeight: 1.05, color: '#FFFFFF', fontWeight: 800, marginBottom: '16px' }}>
            Concepts,<br />
            <span style={{ color: 'var(--yellow)', fontStyle: 'italic', fontWeight: 800 }}>mastered.</span>
          </h2>

          <p className="mu" style={{ fontSize: '17px', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 28px' }}>
            Get instant lifetime access to verified notes, placement preparation cheat sheets, and full-stack projects.
          </p>

          {/* Email input + Start free button */}
          <form onSubmit={handleCtaSubmit} style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', maxWidth: '480px', margin: '0 auto' }}>
            <input
              type="email"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              placeholder="Enter your student email..."
              style={{
                flex: '1 1 240px',
                minHeight: '48px',
                padding: '0 20px',
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid var(--bg-card-border-subtle)',
                borderRadius: '999px',
                color: '#FFFFFF',
                fontSize: '15px',
                outline: 'none'
              }}
            />
            <button type="submit" className="btn btn-yellow btn-lg" style={{ padding: '0 28px' }}>
              Start Learning
            </button>
          </form>

        </div>

      </section>

      {/* Marquee Keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

    </div>
  );
};

export default Home;
