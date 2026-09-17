import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Code2, 
  Play, 
  ChevronLeft, 
  Sparkles, 
  Clock, 
  Layers, 
  Copy, 
  Check, 
  Cpu, 
  Building2, 
  Lightbulb, 
  BookOpen,
  ArrowRight,
  Bookmark,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { VisualizationPlayer, VisualStep } from '../components/VisualizationPlayer';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { getProblemKnowledge } from '../services/dsaKnowledgeBase';

export const DsaProblem: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Multi-Language Code State
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'cpp' | 'java' | 'javascript'>('python');
  const [isCopied, setIsCopied] = useState(false);
  const [activeCodeLine, setActiveCodeLine] = useState<number | null>(null);

  const { showToast } = useToast();

  const fetchProblem = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/dsa/problems/${slug}`);
      if (res.success && res.data) {
        setProblem(res.data);
      }
    } catch (err: any) {
      console.warn('Backend problem load fallback to knowledge base:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProblem();
    }
  }, [slug]);

  // Combine backend response with client knowledge base for rich, flawless rendering
  const kbData = getProblemKnowledge(slug, problem?.title, problem?.topics?.[0]);
  const activeProblem = problem || kbData;

  const handleCopyCode = (codeStr: string) => {
    navigator.clipboard.writeText(codeStr);
    setIsCopied(true);
    showToast('Optimal code copied to clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleStepChange = (step: VisualStep) => {
    if (step.codeLine) {
      setActiveCodeLine(step.codeLine);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <SkeletonLoader rows={8} height="50px" />
      </div>
    );
  }

  const solution = activeProblem.solution || kbData;
  const currentCode = solution?.code?.[selectedLanguage] || 
                      activeProblem.starterCode?.[selectedLanguage] || 
                      kbData.code[selectedLanguage];

  const codeLines = currentCode.split('\n');

  // Related algorithms pool
  const relatedSlugs = [
    { title: 'Two Sum', slug: 'two-sum', diff: 'Easy', topic: 'Arrays' },
    { title: 'Binary Search', slug: 'binary-search', diff: 'Easy', topic: 'Binary Search' },
    { title: 'Maximum Subarray', slug: 'maximum-subarray', diff: 'Medium', topic: 'DP' },
    { title: 'Valid Parentheses', slug: 'valid-parentheses', diff: 'Easy', topic: 'Stack' },
    { title: 'Container With Most Water', slug: 'container-with-most-water', diff: 'Medium', topic: 'Two Pointers' },
    { title: 'Climbing Stairs', slug: 'climbing-stairs', diff: 'Easy', topic: 'Dynamic Programming' }
  ].filter(p => p.slug !== slug).slice(0, 3);

  return (
    <div className="page-wrapper animate-fade-in" style={{ paddingBottom: '5rem' }}>
      {/* Top Header Bar */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '1rem 1.25rem'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
            <Link to="/dsa" className="btn btn-secondary btn-sm" title="Back to All Algorithms" style={{ padding: '6px 10px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
              <ChevronLeft size={16} /> <span className="desktop-only">All Algorithms</span><span className="mobile-only">DSA</span>
            </Link>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 'clamp(1.15rem, 3.5vw, 1.45rem)', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                  {activeProblem.title}
                </h1>
                <span className={`badge badge-${(activeProblem.difficulty || 'Medium').toLowerCase()}`} style={{ fontSize: '0.75rem' }}>
                  {activeProblem.difficulty || 'Medium'}
                </span>
                {(activeProblem.topics || [activeProblem.topic]).slice(0, 2).map((t: string) => (
                  <span key={t} className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Target Companies (Desktop Only to keep mobile header clean) */}
              {activeProblem.companies?.length > 0 && (
                <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  <Building2 size={13} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top Companies:</span>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {activeProblem.companies.map((c: string) => (
                      <span key={c} className="badge" style={{ background: '#EEF2FF', color: 'var(--color-primary)', fontSize: '0.7rem', padding: '2px 8px', fontWeight: 600 }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Complexity Badges Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {solution?.timeComplexity && (
              <span className="badge badge-primary" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px' }}>
                <Clock size={13} /> Time: {solution.timeComplexity}
              </span>
            )}
            {solution?.spaceComplexity && (
              <span className="badge badge-purple desktop-only" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px' }}>
                <Layers size={13} /> Space: {solution.spaceComplexity}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container" style={{ paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* 1. Problem Statement, Examples & Constraints */}
        <div className="card glass-card dsa-detail-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Problem Statement
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
            {activeProblem.description || kbData.description}
          </p>

          {/* Examples */}
          {(activeProblem.examples || kbData.examples)?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                Examples & Test Cases:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(activeProblem.examples || kbData.examples).map((ex: any, idx: number) => (
                  <div key={idx} style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem'
                  }}>
                    <div><strong style={{ color: 'var(--color-primary)' }}>Input:</strong> <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{ex.input}</span></div>
                    <div><strong style={{ color: 'var(--color-emerald)' }}>Output:</strong> <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{ex.output}</span></div>
                    {ex.explanation && (
                      <div style={{ color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }}>
                        💡 <em>{ex.explanation}</em>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Constraints */}
          {(activeProblem.constraints || kbData.constraints)?.length > 0 && (
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Constraints:
              </h3>
              <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                {(activeProblem.constraints || kbData.constraints).map((c: string, idx: number) => (
                  <li key={idx}><code>{c}</code></li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 2. Algorithmic Approach & Step-by-Step Logic */}
        {solution && (
          <div className="card glass-card dsa-detail-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <Lightbulb size={20} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Optimal Approach: {solution.approach || activeProblem.approach}
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {/* Intuition */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>
                  💡 Core Intuition
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                  {solution.intuition || kbData.intuition}
                </p>
              </div>

              {/* Step-by-Step */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-emerald)', marginBottom: '6px' }}>
                  📋 Step-by-Step Execution Plan
                </div>
                <ol style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                  {(solution.stepByStep || kbData.stepByStep).map((s: string, idx: number) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* 3. Interactive Algorithmic Visualizer */}
        <div>
          <VisualizationPlayer
            data={activeProblem.visualizeData}
            problemTitle={activeProblem.title}
            problemSlug={activeProblem.slug || slug}
            problemInput={activeProblem.examples?.[0]?.input}
            topic={activeProblem.topics?.[0] || activeProblem.topic}
            onStepChange={handleStepChange}
          />
        </div>

        {/* 4. Complete Multi-Language Solution Code with Line Highlighter */}
        <div className="card glass-card glowing-border dsa-detail-card">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code2 size={20} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Production-Ready Solution Code
              </h3>
            </div>

            {/* Language Selector Tabs */}
            <div style={{
              display: 'inline-flex',
              background: 'var(--bg-tertiary)',
              padding: '4px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              maxWidth: '100%',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}>
              {(['python', 'cpp', 'java', 'javascript'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`btn btn-sm ${selectedLanguage === lang ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : lang}
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer with Line Numbers & Active Line Highlighting */}
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2 }}>
              <button
                onClick={() => handleCopyCode(currentCode)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '5px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                {isCopied ? <Check size={14} color="var(--color-emerald)" /> : <Copy size={14} />}
                <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <pre style={{
              background: 'var(--code-bg)',
              padding: '2.75rem 1rem 1.25rem 0.5rem',
              borderRadius: '12px',
              border: '1px solid var(--border-medium)',
              overflowX: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              lineHeight: '1.65',
              color: 'var(--code-text)',
              margin: 0
            }}>
              <code>
                {codeLines.map((line: string, lineIdx: number) => {
                  const lineNum = lineIdx + 1;
                  const isHighlighted = activeCodeLine === lineNum;
                  return (
                    <div
                      key={lineIdx}
                      style={{
                        display: 'flex',
                        background: isHighlighted ? 'rgba(79, 70, 229, 0.28)' : 'transparent',
                        borderLeft: isHighlighted ? '3px solid #818CF8' : '3px solid transparent',
                        padding: '0 8px',
                        transition: 'background 0.2s ease'
                      }}
                    >
                      <span style={{
                        width: '32px',
                        color: isHighlighted ? '#A5B4FC' : 'var(--text-muted)',
                        userSelect: 'none',
                        textAlign: 'right',
                        marginRight: '16px',
                        fontSize: '0.8rem',
                        fontWeight: isHighlighted ? 700 : 400
                      }}>
                        {lineNum}
                      </span>
                      <span style={{ flex: 1 }}>{line}</span>
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>

          {/* Complexity Breakdown & Senior Interview Takeaways */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
                ⏱️ Asymptotic Complexity Analysis
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 6px 0' }}>
                <strong>Time Complexity:</strong> {solution?.timeComplexity || kbData.timeComplexity}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                <strong>Space Complexity:</strong> {solution?.spaceComplexity || kbData.spaceComplexity}
              </p>
            </div>

            <div style={{ background: '#EEF2FF', padding: '1.25rem', borderRadius: '10px', borderLeft: '4px solid var(--color-primary)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '6px' }}>
                🎯 Senior Technical Interview Takeaways
              </div>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
                {(solution?.interviewTips || kbData.interviewTips).map((tip: string, idx: number) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 5. Related Algorithmic Problems */}
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={20} color="var(--color-primary)" />
            <span>Recommended Related Problems</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {relatedSlugs.map(rel => (
              <Link
                key={rel.slug}
                to={`/dsa/${rel.slug}`}
                className="card glass-card hover-glow"
                style={{ padding: '1.25rem', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <span className="badge badge-purple" style={{ fontSize: '0.65rem', marginBottom: '4px' }}>
                    {rel.topic}
                  </span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {rel.title}
                  </h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge badge-${rel.diff.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                    {rel.diff}
                  </span>
                  <ArrowRight size={16} color="var(--color-primary)" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
