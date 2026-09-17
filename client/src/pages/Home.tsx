import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Code2, 
  BrainCircuit, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Zap, 
  Layers, 
  Trophy,
  ShieldCheck,
  TrendingUp,
  FolderGit2,
  Cpu,
  BookOpen,
  HelpCircle,
  Clock,
  Compass
} from 'lucide-react';
import { HeroVisualizer } from '../components/HeroVisualizer';

export const Home: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper home-page animate-fade-in">
      {/* ================= 1. HERO SECTION ================= */}
      <section style={{ padding: '4.5rem 0 3.5rem 0', position: 'relative', overflow: 'hidden' }}>
        {/* Glow backdrop */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, rgba(14, 165, 233, 0.10) 50%, transparent 80%)',
          filter: 'blur(70px)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 3rem auto' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#EEF2FF',
              border: '1px solid #C7D2FE',
              padding: '6px 18px',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 6px rgba(79, 70, 229, 0.08)'
            }}>
              <Sparkles size={14} color="var(--color-primary)" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Next-Gen Educational Technology Platform
              </span>
            </div>

            <h1 style={{ marginBottom: '1.25rem', fontWeight: 800 }}>
              Don't just learn it. <br />
              <span className="text-gradient">Understand it.</span>
            </h1>

            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2.25rem' }}>
              Master Data Structures & Algorithms, Campus Placement Aptitude, and Engineering Projects through cognitive step-by-step visualizations, sandboxed multi-language execution, and verified placement notes.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* Primary CTA */}
              <Link to="/dsa" className="btn btn-primary btn-lg">
                <Code2 size={20} /> Start Learning
              </Link>
              {/* Secondary CTA */}
              <Link to="/store" className="btn btn-secondary btn-lg">
                <ShoppingBag size={20} /> Explore Resources
              </Link>
            </div>
          </div>

          {/* Interactive Hero Visualizer */}
          <HeroVisualizer />
        </div>
      </section>

      {/* ================= 2. WHY CONCEPTIFYYY ================= */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ marginBottom: '0.75rem' }}>Why CONCEPTIFYYY?</h2>
            <p>Traditional platforms offer static solutions. We convert algorithms and mathematical logic into interactive cognitive representations.</p>
          </div>

          <div className="grid-3">
            <div className="card card-hover glass-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 229, 255, 0.12)', color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Signature Algorithm Visualizers</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Watch pointers traverse arrays, HashMaps update in O(1) time, and trees balance in real-time with granular playback controls (Play, Pause, Speed Multiplier, Scrubber).
              </p>
            </div>

            <div className="card card-hover glass-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.12)', color: 'var(--color-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <BrainCircuit size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Visual Aptitude Solver</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Solve Time & Work with work-unit progress bars, percentages with comparative balances, and speed math shortcuts for top campus placement exams.
              </p>
            </div>

            <div className="card card-hover glass-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Real Digital Marketplace</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Verified placement notes, formula cheat sheets, and production-ready full-stack projects with official Razorpay Standard Web Checkout and instant downloads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. HOW CONCEPTIFYYY WORKS ================= */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>How It Works</span>
            <h2>Learn → Try → Solve → Visualize → Understand</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {[
              { step: '01', title: 'Learn Pattern', desc: 'Understand the underlying algorithmic intuition and Big-O trade-offs.' },
              { step: '02', title: 'Visualize State', desc: 'Step through animated pointers, memory frames, and state transitions.' },
              { step: '03', title: 'Study Code', desc: 'Inspect clean, optimal implementations in Python, C++, Java, & JS.' },
              { step: '04', title: 'Interview Insights', desc: 'Master common pitfalls, edge cases, and senior interview tips.' },
              { step: '05', title: 'Placement Ready', desc: 'Retain core concepts permanently to crack top tech company interviews.' },
            ].map((item, idx) => (
              <div key={idx} className="card card-hover glass-card" style={{ background: 'var(--bg-secondary)', borderLeft: '4px solid var(--color-primary)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
                  {item.step}
                </div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>{item.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. DSA LEARNING SECTION ================= */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>DSA Arena</span>
              <h2>Interactive Problem Solving</h2>
            </div>
            <Link to="/dsa" className="btn btn-outline btn-sm">
              View All Problems <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-3">
            {[
              { title: 'Two Sum', slug: 'two-sum', diff: 'Easy', topics: ['Arrays', 'Hashing'], companies: ['Amazon', 'Google'] },
              { title: 'Binary Search', slug: 'binary-search', diff: 'Easy', topics: ['Binary Search'], companies: ['Microsoft', 'Infosys'] },
              { title: 'Valid Parentheses', slug: 'valid-parentheses', diff: 'Easy', topics: ['Stack', 'Strings'], companies: ['Meta', 'TCS'] },
            ].map((p, i) => (
              <Link key={i} to={`/dsa/${p.slug}`} className="card card-hover card-interactive glass-card" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className={`badge badge-${p.diff.toLowerCase()}`}>{p.diff}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {p.companies.map(c => (
                      <span key={c} style={{ fontSize: '0.7rem', color: 'var(--color-primary)', background: '#EEF2FF', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>{c}</span>
                    ))}
                  </div>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{p.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700 }}>▶ Interactive Visualizer Available</span>
                  <ArrowRight size={16} color="var(--color-primary)" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5. APTITUDE & PLACEMENT SECTION ================= */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Placement Aptitude</span>
              <h2>Campus Recruitment Speed Mastery</h2>
            </div>
            <Link to="/aptitude" className="btn btn-outline btn-sm">
              Explore Aptitude Topics <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-3">
            <div className="card glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 229, 255, 0.12)', color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={20} />
                </div>
                <span className="badge badge-cyan">Quantitative</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Time & Work Units Method</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>Solve combined efficiency and pipes problems in seconds using LCM work-unit breakdown diagrams.</p>
              <Link to="/aptitude/time-and-work/person-a-and-b-together-work" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Solve Interactive Question
              </Link>
            </div>

            <div className="card glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.12)', color: 'var(--color-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={20} />
                </div>
                <span className="badge badge-purple">Percentages</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Price Hike & Budget Balance</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>Visual balance bars to instantly calculate consumption reductions without complex fractions.</p>
              <Link to="/aptitude/percentages/price-increase-consumption-reduction" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Solve Interactive Question
              </Link>
            </div>

            <div className="card glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={20} />
                </div>
                <span className="badge badge-emerald">Mock Test</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Timed Speed Drill (5-Q)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>Test your speed under timed exam conditions with question palette and accuracy metrics.</p>
              <Link to="/aptitude/test?count=5" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                Launch Timed Test
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. STRUCTURED LEARNING ROADMAPS ================= */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>Learning Paths</span>
              <h2>Step-by-Step Engineering Roadmaps</h2>
            </div>
            <Link to="/learning-paths" className="btn btn-outline btn-sm">
              View All Roadmaps <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-3">
            <div className="card glass-card">
              <span className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>DSA Roadmap</span>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>DSA Zero-to-Hero Roadmap</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>Structured 45-hour roadmap taking you from fundamental arrays up to advanced Dynamic Programming.</p>
              <Link to="/learning-paths" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Follow Roadmap
              </Link>
            </div>

            <div className="card glass-card">
              <span className="badge badge-purple" style={{ marginBottom: '0.75rem' }}>Aptitude Roadmap</span>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Campus Placement Aptitude</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>Complete step-by-step training for Quant, Logical Reasoning, and Verbal Ability for IT hiring exams.</p>
              <Link to="/learning-paths" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Follow Roadmap
              </Link>
            </div>

            <div className="card glass-card">
              <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>Full-Stack</span>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>MERN Developer Roadmap</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>From React fundamentals to Node.js microservices, payment gateways, and cloud deployment.</p>
              <Link to="/learning-paths" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Follow Roadmap
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. FEATURED DIGITAL PRODUCTS & PROJECTS ================= */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Store & Projects</span>
              <h2>Placement Preparation Resources</h2>
            </div>
            <Link to="/store" className="btn btn-outline btn-sm">
              Visit Store <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-3">
            <div className="card card-hover glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-purple">DSA Notes</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>₹39</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Complete DSA Placement Handbook</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>180+ pages of handwritten visual notes, code templates in Python/Java/C++, and top 100 questions.</p>
              <Link to="/store/dsa-placement-handbook" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                View Notes Details
              </Link>
            </div>

            <div className="card card-hover glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-cyan">Aptitude</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>₹29</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Master Aptitude Speed Tricks Pack</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>95 pages of Quantitative & Logical formulas and 10-second Vedic speed math tricks for TCS/Infosys/Wipro.</p>
              <Link to="/store/aptitude-formula-speed-tricks" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                View Formula Pack
              </Link>
            </div>

            <div className="card card-hover glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-easy">Super Pack</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>₹99</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Placement Ultimate Super Pack</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>All DSA Notes + Aptitude + Core CS (OS, DBMS, CN) + 500+ Interview Questions & Resume Templates.</p>
              <Link to="/store/placement-ultimate-super-pack" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Unlock Super Pack
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. FINAL CTA BANNER ================= */}
      <section style={{ padding: '4.5rem 0', background: 'radial-gradient(circle at center, rgba(0, 229, 255, 0.08) 0%, var(--bg-secondary) 80%)', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', fontWeight: 800 }}>
            Don't just learn it. <br />
            <span className="text-gradient">Understand it.</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Empower your engineering career with real cognitive understanding and placement readiness.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/dsa" className="btn btn-primary btn-lg">
              <Sparkles size={18} /> Start Learning
            </Link>
            <Link to="/store" className="btn btn-secondary btn-lg">
              <ShoppingBag size={18} /> Explore Resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
