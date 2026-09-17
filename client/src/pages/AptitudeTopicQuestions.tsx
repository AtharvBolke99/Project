import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  BrainCircuit, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  Timer, 
  Building2, 
  SlidersHorizontal,
  ChevronRight,
  Zap,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { SkeletonLoader } from '../components/SkeletonLoader';

const TOPIC_TARGET_COMPANIES: Record<string, string[]> = {
  'time-and-work': ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Capgemini', 'Amazon'],
  'percentages': ['Accenture', 'TCS', 'Deloitte', 'HCL', 'Tech Mahindra'],
  'profit-and-loss': ['Infosys', 'Cognizant', 'Amazon', 'EY', 'PwC'],
  'speed-time-distance': ['TCS Ninja', 'Wipro Elite', 'LTIMindtree', 'Capgemini'],
  'ratio-and-proportion': ['TCS Digital', 'Infosys', 'Cognizant', 'Accenture'],
  'probability': ['Amazon', 'Microsoft', 'Goldman Sachs', 'Oracle', 'Deloitte'],
  'permutations-combinations': ['Amazon', 'Google', 'Morgan Stanley', 'TCS Digital'],
  'simple-compound-interest': ['SBI', 'HDFC', 'TCS', 'Cognizant', 'Capgemini'],
  'number-series': ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Tech Mahindra'],
  'blood-relations': ['TCS Ninja', 'Wipro', 'Capgemini', 'Accenture'],
  'coding-decoding': ['TCS', 'Infosys', 'Cognizant', 'LTIMindtree'],
  'syllogism': ['Deloitte', 'PwC', 'KPMG', 'EY', 'TCS Digital'],
  'seating-arrangement': ['Amazon', 'TCS Digital', 'Wipro Turbo', 'Accenture'],
  'direction-sense': ['TCS', 'Infosys', 'Cognizant', 'Capgemini'],
  'reading-comprehension': ['Deloitte', 'Cognizant', 'TCS', 'Wipro', 'Accenture'],
  'sentence-correction': ['TCS', 'Infosys', 'Cognizant', 'Tech Mahindra'],
  'vocabulary-synonyms': ['Deloitte', 'Amazon', 'TCS', 'Accenture']
};

export const AptitudeTopicQuestions: React.FC = () => {
  const { topicSlug = '' } = useParams<{ topicSlug: string }>();
  const [topic, setTopic] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [sortOrder, setSortOrder] = useState<'diff-asc' | 'diff-desc' | 'natural'>('diff-asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/aptitude/topics/${topicSlug}?limit=100`);
        if (response.success) {
          setTopic(response.topic);
          setQuestions(response.questions || []);
        }
      } catch (err) {
        console.error('Failed to load topic questions:', err);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [topicSlug]);

  // Compute difficulty counts
  const counts = useMemo(() => {
    const easy = questions.filter(q => q.difficulty?.toLowerCase() === 'easy').length;
    const medium = questions.filter(q => q.difficulty?.toLowerCase() === 'medium').length;
    const hard = questions.filter(q => q.difficulty?.toLowerCase() === 'hard').length;
    const solved = questions.filter(q => q.isSolved).length;
    return { total: questions.length, easy, medium, hard, solved };
  }, [questions]);

  // Sort and filter questions
  const sortedAndFilteredQuestions = useMemo(() => {
    const diffWeights: Record<string, number> = { easy: 1, medium: 2, hard: 3 };

    let list = [...questions];

    // Filter by Difficulty
    if (difficultyFilter !== 'All') {
      list = list.filter(q => q.difficulty?.toLowerCase() === difficultyFilter.toLowerCase());
    }

    // Filter by Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(item => 
        item.question.toLowerCase().includes(q) ||
        (item.options && item.options.some((opt: string) => opt.toLowerCase().includes(q)))
      );
    }

    // Apply Sorting Order
    if (sortOrder === 'diff-asc') {
      list.sort((a, b) => (diffWeights[a.difficulty?.toLowerCase()] || 2) - (diffWeights[b.difficulty?.toLowerCase()] || 2));
    } else if (sortOrder === 'diff-desc') {
      list.sort((a, b) => (diffWeights[b.difficulty?.toLowerCase()] || 2) - (diffWeights[a.difficulty?.toLowerCase()] || 2));
    }

    return list;
  }, [questions, difficultyFilter, search, sortOrder]);

  const targetCompanies = TOPIC_TARGET_COMPANIES[topicSlug] || ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture'];

  return (
    <div className="page-wrapper aptitude-page animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/aptitude" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} /> All Aptitude Topics
          </Link>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link to={`/aptitude/test?topicId=${topic?.id || ''}&count=10`} className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
              <Zap size={14} /> Start Timed Topic Test
            </Link>
          </div>
        </div>

        {/* Hero Topic Header Card */}
        <div className="card glass-card glowing-border" style={{ marginBottom: '2rem', padding: '2rem', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(14, 165, 233, 0.04) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div className="topic-hero-main" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-purple" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700 }}>
                  <BrainCircuit size={13} /> {topic?.category || 'Placement Aptitude'}
                </span>
                <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
                  {counts.total} Placement Questions
                </span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                {topic?.title || 'Practice Questions'}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '680px', margin: 0 }}>
                {topic?.description || 'Build speed, accuracy, and shortcut techniques with curated placement questions and step-by-step visual explanations.'}
              </p>

              {/* Target Companies Strip */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building2 size={14} /> Frequent in:
                </span>
                {targetCompanies.map(comp => (
                  <span key={comp} className="badge" style={{ background: '#EEF2FF', color: 'var(--color-primary)', fontSize: '0.75rem', padding: '3px 10px', fontWeight: 700, borderRadius: '6px' }}>
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats Metrics Column */}
            <div className="topic-hero-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Easy</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--color-emerald)', fontWeight: 800 }}>{counts.easy}</strong>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Medium</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--color-amber)', fontWeight: 800 }}>{counts.medium}</strong>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Hard</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--color-rose)', fontWeight: 800 }}>{counts.hard}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar: Difficulty Tabs, Search & Sort Selector */}
        <div className="card glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Difficulty Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => {
              const isActive = difficultyFilter === d;
              const count = d === 'All' ? counts.total : counts[d.toLowerCase() as keyof typeof counts];
              return (
                <button
                  key={d}
                  onClick={() => setDifficultyFilter(d)}
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.8125rem', padding: '6px 14px', borderRadius: '8px', fontWeight: isActive ? 700 : 500 }}
                >
                  {d} <span style={{ opacity: 0.8, fontSize: '0.75rem', marginLeft: '4px' }}>({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search and Sort Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                placeholder="Search question keyword..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input"
                style={{ paddingLeft: '32px', fontSize: '0.85rem', width: '100%', height: '36px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SlidersHorizontal size={15} color="var(--text-muted)" />
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as any)}
                className="input"
                style={{ height: '36px', fontSize: '0.8125rem', padding: '4px 10px', background: 'var(--bg-card)', cursor: 'pointer' }}
              >
                <option value="diff-asc">Difficulty: Easy ➔ Hard</option>
                <option value="diff-desc">Difficulty: Hard ➔ Easy</option>
                <option value="natural">Original Sequential Order</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions Grid / List */}
        {loading ? (
          <div className="card" style={{ padding: '2rem' }}>
            <SkeletonLoader rows={8} height="70px" />
          </div>
        ) : sortedAndFilteredQuestions.length === 0 ? (
          <div className="card glass-card" style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
            <BookOpen size={36} color="var(--color-primary)" style={{ margin: '0 auto 12px auto', opacity: 0.7 }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>No questions match your filter</h3>
            <p style={{ fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1rem auto' }}>
              Try adjusting your search keyword or switching the difficulty filter.
            </p>
            <button onClick={() => { setDifficultyFilter('All'); setSearch(''); }} className="btn btn-secondary btn-sm">
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sortedAndFilteredQuestions.map((question, index) => {
              const diff = (question.difficulty || 'Medium').toLowerCase();
              const badgeClass = diff === 'easy' ? 'badge-emerald' : diff === 'hard' ? 'badge-rose' : 'badge-amber';

              return (
                <div
                  key={question.id}
                  className="card glass-card card-hover"
                  style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    borderLeft: `4px solid ${diff === 'easy' ? 'var(--color-emerald)' : diff === 'hard' ? 'var(--color-rose)' : 'var(--color-amber)'}`
                  }}
                >
                  {/* Left Info */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: '280px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      color: 'var(--text-primary)',
                      flexShrink: 0
                    }}>
                      Q{String(index + 1).padStart(2, '0')}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span className={`badge ${badgeClass}`} style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                          {question.difficulty || 'Medium'}
                        </span>
                        {question.hasVisualExplanation && (
                          <span className="badge badge-cyan" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Sparkles size={12} /> Visual Breakdown
                          </span>
                        )}
                        {question.isSolved && (
                          <span className="badge badge-emerald" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} /> Solved
                          </span>
                        )}
                      </div>

                      <Link 
                        to={`/aptitude/${topicSlug}/${question.slug}`}
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                          lineHeight: '1.5',
                          display: 'block'
                        }}
                      >
                        {question.question}
                      </Link>

                      {/* Options preview chips */}
                      {question.options && question.options.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                          {question.options.slice(0, 4).map((opt: string, optIdx: number) => (
                            <span 
                              key={optIdx} 
                              style={{ 
                                fontSize: '0.75rem', 
                                background: 'var(--bg-tertiary)', 
                                border: '1px solid var(--border-subtle)', 
                                padding: '2px 8px', 
                                borderRadius: '4px',
                                color: 'var(--text-secondary)'
                              }}
                            >
                              <strong style={{ color: 'var(--color-primary)' }}>{String.fromCharCode(65 + optIdx)}:</strong> {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Action */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Link
                      to={`/aptitude/${topicSlug}/${question.slug}`}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '8px 16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <span>Practice</span>
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
