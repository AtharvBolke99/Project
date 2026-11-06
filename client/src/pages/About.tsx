import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  BrainCircuit, 
  Code2, 
  Target, 
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle2
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div style={{ padding: '2rem 1.5rem 5rem' }}>
      <div className="wrap" style={{ maxWidth: '1000px' }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <span className="chip" style={{ background: 'var(--yellow)', transform: 'rotate(-2deg)' }}>
              ✦ OUR PEDAGOGY & MISSION
            </span>
          </div>

          <h1 className="d" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            Don't just memorize. <br />
            <span style={{ color: 'var(--purple)' }}>Get the concept right.</span>
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--muted)', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
            Conceptifyyy was founded with a singular conviction: engineering students spend countless hours memorizing code snippets without developing the genuine intuition required to ace campus drives and high-stakes technical interviews.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 className="d" style={{ fontSize: '2rem' }}>The 3 Pillars of Conceptifyyy</h2>
            <p style={{ color: 'var(--muted)' }}>Built around deep cognitive retention rather than rote memorization.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="pop" style={{ background: '#FFFFFF', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--lavender-accent)', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BrainCircuit size={24} color="var(--purple)" />
              </div>
              <h3 className="d" style={{ fontSize: '1.3rem', margin: 0 }}>Visual Cognitive Modeling</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                Complex data structures, pointer shifts, memory allocations, and tree balances are visualized with crystal clarity so intuition replaces guesswork.
              </p>
            </div>

            <div className="pop" style={{ background: '#FFFFFF', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--yellow)', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={24} color="var(--ink)" />
              </div>
              <h3 className="d" style={{ fontSize: '1.3rem', margin: 0 }}>Verified Field-Tested Notes</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                Every handwritten note and algorithmic cheat sheet is battle-tested by top campus placement scorers and university toppers before publishing.
              </p>
            </div>

            <div className="pop" style={{ background: '#FFFFFF', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--mint-soft)', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={24} color="var(--ink)" />
              </div>
              <h3 className="d" style={{ fontSize: '1.3rem', margin: 0 }}>Placement-Driven Quality</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                From quantitative aptitude shortcuts to production-grade full-stack project source code, we supply the complete arsenal needed to secure day-1 offers.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Steps Section */}
        <div className="pop" style={{ background: '#FFFFFF', padding: '2.5rem', marginBottom: '3.5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span className="tag" style={{ background: 'var(--lavender-accent)', marginBottom: '0.75rem' }}>PEDAGOGY BREAKDOWN</span>
            <h2 className="d" style={{ fontSize: '2rem', margin: '0.5rem 0 0' }}>How Our Study Systems Work</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {[
              {
                num: '01',
                title: 'Pattern Recognition',
                desc: 'Break problems down into core algorithmic paradigms (Sliding Window, Two Pointers, Monotonic Stack, Dynamic Programming) instead of memorizing code lines.'
              },
              {
                num: '02',
                title: 'Intuitive Hand-Drawn Diagrams',
                desc: 'Flowcharts and step-by-step memory layouts that illuminate what the CPU and memory do on every line of execution.'
              },
              {
                num: '03',
                title: 'Multi-Language Mastery',
                desc: 'Solutions explained with Python, Java, C++, and JavaScript paradigms alongside edge-case checklists.'
              },
              {
                num: '04',
                title: 'Instant Perpetual Access',
                desc: 'Purchased materials land directly in your My Purchases download vault with lifetime download access and license tracking.'
              }
            ].map(s => (
              <div key={s.num} style={{ background: 'var(--lavender)', border: '2px solid var(--ink)', borderRadius: '18px', padding: '1.25rem' }}>
                <div className="d" style={{ fontSize: '2rem', color: 'var(--purple)', lineHeight: 1, marginBottom: '0.5rem' }}>
                  {s.num}
                </div>
                <h4 className="d" style={{ fontSize: '1.05rem', margin: '0 0 0.4rem' }}>{s.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="pop" style={{ background: 'var(--purple)', color: '#FFFFFF', padding: '3rem 2rem', textAlign: 'center' }}>
          <h2 className="d" style={{ fontSize: '2.25rem', color: '#FFFFFF', marginBottom: '0.75rem' }}>
            Ready to master your subjects?
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', maxWidth: '550px', margin: '0 auto 1.75rem' }}>
            Browse verified handwritten notes, exam cheat sheets, and full-stack projects on the Conceptifyyy Store.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/store" className="btn y" style={{ textDecoration: 'none' }}>
              Explore The Store <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
