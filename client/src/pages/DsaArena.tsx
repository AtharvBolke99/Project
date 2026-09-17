import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Search, 
  Sparkles, 
  Play, 
  ChevronRight, 
  Building2, 
  Layers,
  CheckCircle2,
  Terminal,
  Activity
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';

export const DsaArena: React.FC = () => {
  const [problems, setProblems] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const { showToast } = useToast();

  const fetchMeta = async () => {
    try {
      const res = await api.get('/dsa/meta');
      if (res.success) {
        setTopics(res.topics || []);
        setCompanies(res.companies || []);
      }
    } catch (e) {}
  };

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedTopic !== 'All') params.append('topic', selectedTopic);
      if (selectedCompany !== 'All') params.append('company', selectedCompany);
      if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty);
      params.append('limit', '100');

      const res = await api.get(`/dsa/problems?${params.toString()}`);
      if (res.success && res.data) {
        setProblems(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load DSA problems', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [selectedTopic, selectedCompany, selectedDifficulty]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProblems();
  };

  return (
    <div className="page-wrapper arena-page animate-fade-in">
      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Header Title */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Sparkles size={22} color="var(--color-primary)" />
            <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, margin: 0 }}>
              DSA Practice Arena
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.925rem', lineHeight: '1.5' }}>
            Master core Data Structures & Algorithms with step-by-step visualizers and multi-language solutions.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="card glass-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.875rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                placeholder="Search problems by title, topic..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input"
                style={{ paddingLeft: '38px', minHeight: '42px', fontSize: '0.9rem' }}
              />
            </div>
            <button type="submit" className="btn btn-secondary" style={{ minHeight: '42px', padding: '0 1.25rem', fontWeight: 700 }}>
              Search
            </button>
          </form>

          {/* Quick Difficulty Filter Tabs (Mobile & Desktop) */}
          <div className="tabs-header-wrapper" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', maxWidth: '100%', paddingBottom: '2px' }}>
            <div className="tabs-header" style={{ margin: 0, border: 'none', display: 'inline-flex', flexWrap: 'nowrap', gap: '6px' }}>
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`tab-btn ${selectedDifficulty === d ? 'active' : ''}`}
                  style={{ fontSize: '0.825rem', padding: '6px 14px', whiteSpace: 'nowrap', minHeight: '34px' }}
                >
                  {d === 'All' ? `All (${problems.length})` : d}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Single Topic Selector (Lean & Compact) */}
          <div className="dsa-mobile-filter-row">
            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="select"
              style={{ minHeight: '38px', fontSize: '0.85rem', padding: '6px 12px' }}
            >
              <option value="All">All Topics ({topics.reduce((acc, t) => acc + (t.count || 0), 0) || problems.length})</option>
              {topics.map(t => (
                <option key={t.name} value={t.name}>{t.name} ({t.count})</option>
              ))}
            </select>
          </div>

          {/* Desktop Filter Dropdowns (Topic & Company) */}
          <div className="desktop-only" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Topic Category</label>
              <select
                value={selectedTopic}
                onChange={e => setSelectedTopic(e.target.value)}
                className="select"
              >
                <option value="All">All Categories ({topics.reduce((acc, t) => acc + (t.count || 0), 0) || problems.length})</option>
                {topics.map(t => (
                  <option key={t.name} value={t.name}>{t.name} ({t.count})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Company Tag</label>
              <select
                value={selectedCompany}
                onChange={e => setSelectedCompany(e.target.value)}
                className="select"
              >
                <option value="All">All Companies</option>
                {companies.map(c => (
                  <option key={c.name} value={c.name}>{c.name} ({c.count})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Problem List Table */}
        <div className="card glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <SkeletonLoader rows={8} height="48px" />
            </div>
          ) : problems.length === 0 ? (
            <EmptyState
              icon={<Search size={28} />}
              title="No Algorithms Found"
              description="No DSA visualizations match your current search and filter selections."
              actionText="Reset Filters"
              onAction={() => {
                setSearch('');
                setSelectedTopic('All');
                setSelectedCompany('All');
                setSelectedDifficulty('All');
              }}
            />
          ) : (
            <div>
              {/* Desktop & Tablet Full Table (Hidden on Mobile) */}
              <div className="desktop-only" style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px', textAlign: 'center' }}>#</th>
                      <th>Algorithm & Problem Title</th>
                      <th style={{ width: '120px' }}>Difficulty</th>
                      <th>Topic Category</th>
                      <th>Target Companies</th>
                      <th style={{ width: '220px', textAlign: 'right' }}>Interactive Guide</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.map((p, idx) => (
                      <tr key={p.id || idx}>
                        <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                          {idx + 1}
                        </td>

                        {/* Title */}
                        <td>
                          <Link
                            to={`/dsa/${p.slug}`}
                            style={{
                              fontWeight: 700,
                              color: 'var(--text-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              textDecoration: 'none'
                            }}
                          >
                            <span>{p.title}</span>
                            <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                              ▶ Interactive Visualizer
                            </span>
                          </Link>
                        </td>

                        {/* Difficulty */}
                        <td>
                          <span className={`badge badge-${p.difficulty.toLowerCase()}`}>
                            {p.difficulty}
                          </span>
                        </td>

                        {/* Topics */}
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {p.topics?.map((t: string) => (
                              <span key={t} style={{ fontSize: '0.75rem', background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Companies */}
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {p.companies?.slice(0, 3).map((c: string) => (
                              <span key={c} style={{ fontSize: '0.75rem', color: 'var(--color-primary)', background: '#EEF2FF', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Action direct link */}
                        <td style={{ textAlign: 'right' }}>
                          <Link
                            to={`/dsa/${p.slug}`}
                            className="btn btn-primary btn-sm"
                            style={{
                              padding: '6px 14px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <Play size={13} /> View Visualization & Code
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Streamlined Problem List (Touch-Friendly & Clean) */}
              <div className="dsa-mobile-list">
                {problems.map((p, idx) => (
                  <Link
                    key={p.id || idx}
                    to={`/dsa/${p.slug}`}
                    className="dsa-mobile-card"
                  >
                    <div className="dsa-mobile-card-content">
                      <div className="dsa-mobile-title-row">
                        <span className="dsa-mobile-title">{p.title}</span>
                        <span className={`badge badge-${p.difficulty.toLowerCase()}`} style={{ flexShrink: 0, fontSize: '0.75rem' }}>
                          {p.difficulty}
                        </span>
                      </div>
                      
                      <div className="dsa-mobile-meta">
                        {p.topics?.[0] && (
                          <span className="dsa-mobile-topic">
                            {p.topics[0]}
                          </span>
                        )}
                        {p.companies?.[0] && (
                          <span className="dsa-mobile-company">
                            {p.companies[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <ChevronRight size={18} className="dsa-mobile-arrow" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
