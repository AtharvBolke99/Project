import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  BrainCircuit, 
  Code2, 
  Zap, 
  ShieldCheck, 
  Target, 
  Users, 
  Award,
  Layers,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header Banner */}
      <section style={{ padding: '4rem 0 3rem 0', textAlign: 'center', position: 'relative' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 229, 255, 0.08)',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            marginBottom: '1.25rem'
          }}>
            <Sparkles size={14} color="var(--color-cyan)" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-cyan)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Our Story & Mission
            </span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            Don't just learn it. <br />
            <span className="text-gradient">Understand it.</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            CONCEPTIFYYY was born from a simple realization: engineering students spend countless hours memorizing solutions on competitive coding websites without truly developing the mental intuition required to solve new, unseen problems in high-stakes interviews.
          </p>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section style={{ padding: '3rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
            <h2>The 3 Pillars of Conceptifyyy</h2>
            <p>Our curriculum is built around cognitive retention principles rather than rote memorization.</p>
          </div>

          <div className="grid-3">
            <div className="card glass-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 229, 255, 0.12)', color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <BrainCircuit size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>1. Visual Cognitive Modeling</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Every data structure and algorithm is accompanied by step-by-step interactive animations that show pointer shifts, memory allocations, and tree balances in real-time.
              </p>
            </div>

            <div className="card glass-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.12)', color: 'var(--color-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Code2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>2. Active Try-First Practice</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Solutions are locked until students actively engage with the problem. Sandboxed multi-language compilation provides instant telemetry on runtime, memory, and hidden edge cases.
              </p>
            </div>

            <div className="card glass-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Target size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>3. Placement Readiness</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                From quantitative aptitude shortcuts to verified handwritten notes and full-stack MERN major projects, we provide the complete toolkit needed to clear campus placement drives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Methodology Breakdown */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '920px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>Pedagogy</span>
            <h2>How Our Cognitive Engine Works</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              {
                step: '01',
                title: 'Problem Framing & Intuition',
                desc: 'We break down complex problem descriptions into core algorithmic patterns (Two Pointers, Sliding Window, Monotonic Stack, DP Memoization) rather than presenting raw code.'
              },
              {
                step: '02',
                title: 'Interactive Visual Execution',
                desc: 'Our visual player renders memory diagrams, hash lookups, and pointer movements with playback controls (play, pause, speed control, scrubber timeline) so you see how state changes across iterations.'
              },
              {
                step: '03',
                title: 'Isolated Multi-Language Sandbox',
                desc: 'Write solutions in JavaScript, Python, C++, or Java. The code executes in an isolated environment with public test cases, hidden edge cases, and runtime profiling.'
              },
              {
                step: '04',
                title: 'Deep Complexity Analysis',
                desc: 'Every solution explains time and space complexities, common pitfalls to avoid during technical interviews, and trade-offs between space and time optimization.'
              }
            ].map(item => (
              <div key={item.step} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', background: 'var(--bg-secondary)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)', minWidth: '40px' }}>
                  {item.step}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section style={{ padding: '3.5rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 style={{ marginBottom: '1rem' }}>Ready to understand concepts deeply?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Start with our signature interactive visualizers or solve today's daily DSA challenge.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/dsa" className="btn btn-primary btn-lg">
              <Code2 size={18} /> Start Learning
            </Link>
            <Link to="/store" className="btn btn-secondary btn-lg">
              <ArrowRight size={18} /> Explore Resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
