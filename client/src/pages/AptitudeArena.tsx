import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  Calculator, 
  Binary, 
  BookOpen, 
  ChevronRight, 
  Clock, 
  Zap, 
  Percent, 
  TrendingUp, 
  Dice5,
  Users,
  CheckCircle2,
  Sparkles,
  Search,
  Timer
} from 'lucide-react';
import { api } from '../services/api';
import { SkeletonLoader } from '../components/SkeletonLoader';

export const AptitudeArena: React.FC = () => {
  const [categories, setCategories] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'Quantitative' | 'Logical Reasoning' | 'Verbal Ability'>('Quantitative');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAptitudeMeta = async () => {
      try {
        const res = await api.get('/aptitude/categories');
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (e) {
        console.error('Failed to load aptitude categories:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAptitudeMeta();
  }, []);

  const getCategoryIcon = (cat: string) => {
    if (cat === 'Quantitative') return <Calculator size={20} color="var(--color-cyan)" />;
    if (cat === 'Logical Reasoning') return <Binary size={20} color="var(--color-purple)" />;
    return <BookOpen size={20} color="var(--color-emerald)" />;
  };

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Clock': return <Clock size={20} color="var(--color-primary)" />;
      case 'Percent': return <Percent size={20} color="var(--color-primary)" />;
      case 'TrendingUp': return <TrendingUp size={20} color="var(--color-emerald)" />;
      case 'Dice5': return <Dice5 size={20} color="var(--color-purple)" />;
      case 'Users': return <Users size={20} color="var(--color-amber)" />;
      default: return <BrainCircuit size={20} color="var(--color-primary)" />;
    }
  };

  const rawTopics = categories[activeCategory] || [];
  const topics = rawTopics.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-wrapper aptitude-page animate-fade-in">
      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <BrainCircuit size={22} color="var(--color-primary)" />
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Campus Placement Aptitude Arena
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Practice company-pattern aptitude questions with step-by-step visual breakdowns, speed-math tricks, and shortcut formulas.
          </p>
        </div>

        {/* Timed Test Launch Hero Banner */}
        <div className="card glass-card glowing-border" style={{ marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.07) 0%, rgba(14, 165, 233, 0.06) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-primary">⚡ Timed Mock Tests</span>
                <span className="badge badge-purple">Company Pattern</span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Simulate Placement Aptitude Rounds
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '550px' }}>
                Timed countdown exams with question palette navigation, automated accuracy scoring, and visual step-by-step solutions.
              </p>
            </div>

            <div className="page-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link to="/aptitude/test?count=5" className="btn btn-secondary btn-sm" style={{ padding: '8px 14px' }}>
                <Timer size={14} color="var(--color-primary)" /> 5-Q Speed Drill
              </Link>
              <Link to="/aptitude/test?count=10" className="btn btn-primary btn-sm" style={{ padding: '8px 16px', fontWeight: 800 }}>
                <Zap size={14} /> 10-Q Placement Test
              </Link>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Category Switcher Tabs */}
          <div className="tabs-header-wrapper" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', maxWidth: '100%', paddingBottom: '4px' }}>
            <div className="tabs-header" style={{ margin: 0, border: 'none', display: 'inline-flex', flexWrap: 'nowrap' }}>
              {(['Quantitative', 'Logical Reasoning', 'Verbal Ability'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setSearchTerm(''); }}
                  className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', padding: '8px 14px', whiteSpace: 'nowrap' }}
                >
                  {getCategoryIcon(cat)}
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="page-search" style={{ position: 'relative', width: '260px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Filter topics..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input"
              style={{ paddingLeft: '32px', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Topics Grid */}
        {loading ? (
          <div className="grid-3">
            <SkeletonLoader rows={3} height="120px" />
          </div>
        ) : topics.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
            <p>No topics found matching "{searchTerm}".</p>
          </div>
        ) : (
          <div className="grid-3" style={{ marginBottom: '3rem' }}>
            {topics.map(topic => {
              return (
                <div
                  key={topic.id}
                  className="card card-hover"
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {getTopicIcon(topic.icon)}
                      </div>
                      <span className="badge badge-cyan">
                        Interactive Visuals
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      {topic.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                      {topic.description}
                    </p>
                    <span className="practice-count">
                      {topic.questionCount || topic.totalQuestions || 0} practice questions
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                    <Link
                      to={`/aptitude/topic/${topic.slug}`}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, fontSize: '0.75rem', justifyContent: 'center' }}
                    >
                      Practice Questions
                    </Link>
                    <Link
                      to={`/aptitude/test?topicId=${topic.id}&count=5`}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem' }}
                      title="Take Timed Topic Test"
                    >
                      <Timer size={14} /> Topic Test
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
