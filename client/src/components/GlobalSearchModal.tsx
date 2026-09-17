import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Code2, BrainCircuit, ShoppingBag, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const GlobalSearchModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ problems: any[]; aptitude: any[]; products: any[] }>({
    problems: [],
    aptitude: [],
    products: []
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults({ problems: [], aptitude: [], products: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/user/search?q=${encodeURIComponent(query)}`);
        if (res.success && res.results) {
          setResults(res.results);
        }
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (url: string) => {
    onClose();
    navigate(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: '1.25rem' }}>
        {/* Search Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <Search size={20} color="var(--color-cyan)" />
          <input
            type="text"
            placeholder="Search Two Sum, Binary Search, Aptitude, Notes..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)'
            }}
          />
          <button onClick={onClose} className="btn-icon" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Results Body */}
        <div style={{ marginTop: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
          {loading && <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>Searching platform...</p>}

          {!loading && !query && (
            <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Quick Navigation:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span onClick={() => setQuery('Two Sum')} style={{ cursor: 'pointer', background: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '4px' }}>Two Sum</span>
                <span onClick={() => setQuery('Binary Search')} style={{ cursor: 'pointer', background: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '4px' }}>Binary Search</span>
                <span onClick={() => setQuery('Time & Work')} style={{ cursor: 'pointer', background: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '4px' }}>Time & Work</span>
                <span onClick={() => setQuery('Notes')} style={{ cursor: 'pointer', background: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '4px' }}>Placement Notes</span>
              </div>
            </div>
          )}

          {/* DSA Problems List */}
          {results.problems?.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-cyan)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <Code2 size={14} /> DSA Problems
              </div>
              {results.problems.map(prob => (
                <div
                  key={prob.id}
                  onClick={() => handleSelect(`/dsa/${prob.slug}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-secondary)',
                    marginBottom: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{prob.title}</span>
                  <span className={`badge badge-${prob.difficulty.toLowerCase()}`}>{prob.difficulty}</span>
                </div>
              ))}
            </div>
          )}

          {/* Aptitude Questions List */}
          {results.aptitude?.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-purple)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <BrainCircuit size={14} /> Aptitude Topics & Questions
              </div>
              {results.aptitude.map(apt => (
                <div
                  key={apt.id}
                  onClick={() => handleSelect(`/aptitude/${apt.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${apt.slug}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-secondary)',
                    marginBottom: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{apt.title}</span>
                  <span className="badge badge-purple">{apt.topic}</span>
                </div>
              ))}
            </div>
          )}

          {/* Products & Notes */}
          {results.products?.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <ShoppingBag size={14} /> Notes & Projects Store
              </div>
              {results.products.map(prod => (
                <div
                  key={prod.id}
                  onClick={() => handleSelect(`/store/${prod.slug}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-secondary)',
                    marginBottom: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{prod.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prod.category}</div>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--color-cyan)', fontSize: '0.9rem' }}>₹{prod.price}</span>
                </div>
              ))}
            </div>
          )}

          {!loading && query && results.problems.length === 0 && results.aptitude.length === 0 && results.products.length === 0 && (
            <p style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
              No matches found for "{query}".
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
