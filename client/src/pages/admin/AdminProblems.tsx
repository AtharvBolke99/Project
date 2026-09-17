import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Plus, 
  Trash2, 
  UploadCloud,
  ChevronLeft, 
  FileText,
  LayoutDashboard
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { SkeletonLoader } from '../../components/SkeletonLoader';

export const AdminProblems: React.FC = () => {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [topics, setTopics] = useState('Arrays, Two Pointers');
  const [companies, setCompanies] = useState('Amazon, Google');
  const [description, setDescription] = useState('');
  const [starterJs, setStarterJs] = useState('function solution(nums) {\n  // write code\n}');
  const [testInput, setTestInput] = useState('[1, 2, 3]');
  const [testExpected, setTestExpected] = useState('[3, 2, 1]');
  const [saving, setSaving] = useState(false);

  // Bulk Import State
  const [importJson, setImportJson] = useState('');
  const [overwrite, setOverwrite] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importStats, setImportStats] = useState<any>(null);

  const { showToast } = useToast();

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dsa/problems?limit=100');
      if (res.success && res.data) {
        setProblems(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleSaveProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        difficulty,
        topics: topics.split(',').map(t => t.trim()),
        companies: companies.split(',').map(c => c.trim()),
        description,
        starterCode: {
          javascript: starterJs,
          python: 'def solution(nums):\n    pass',
          cpp: '// C++ solution',
          java: '// Java solution'
        },
        testCases: [{ input: testInput, expectedOutput: testExpected, isHidden: false }],
        visualizeData: {
          type: 'array',
          initialState: { array: [1, 2, 3] },
          steps: [
            { stepNumber: 1, label: 'Initialize', explanation: 'Start pointer walkthrough', state: { array: [1, 2, 3] } }
          ]
        }
      };

      if (editingId) {
        await api.put(`/admin/problems/${editingId}`, payload);
        showToast('Problem updated live!', 'success');
      } else {
        await api.post('/admin/problems', payload);
        showToast('🎉 Problem published live on CONCEPTIFYYY!', 'success');
      }

      setIsModalOpen(false);
      resetForm();
      fetchProblems();
    } catch (err: any) {
      showToast(err.message || 'Failed to save problem', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setImporting(true);
    setImportStats(null);

    try {
      let parsedData;
      try {
        parsedData = JSON.parse(importJson);
      } catch (jsonErr) {
        showToast('Invalid JSON format. Please verify JSON syntax.', 'error');
        setImporting(false);
        return;
      }

      const problemArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      const res = await api.post('/admin/dsa/import', { problems: problemArray, overwrite });

      if (res.success) {
        setImportStats(res.stats);
        showToast(res.message || 'Import completed!', 'success');
        fetchProblems();
      } else {
        showToast(res.message || 'Import failed.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Bulk import request failed', 'error');
    } finally {
      setImporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      setImportJson(content);
    };
    reader.readAsText(file);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    try {
      await api.delete(`/admin/problems/${id}`);
      showToast('Problem removed.', 'info');
      fetchProblems();
    } catch (e: any) {
      showToast(e.message || 'Delete failed', 'error');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setDifficulty('Easy');
    setTopics('Arrays, Two Pointers');
    setCompanies('Amazon, Google');
    setDescription('');
    setStarterJs('function solution(nums) {\n  // write code\n}');
    setTestInput('[1, 2, 3]');
    setTestExpected('[3, 2, 1]');
  };

  return (
    <div className="admin-layout animate-fade-in">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link to="/admin" className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
          <ChevronLeft size={16} /> Back to Overview
        </Link>
        <Link to="/admin" className="admin-sidebar-link">
          <LayoutDashboard size={18} /> Overview
        </Link>
        <Link to="/admin/problems" className="admin-sidebar-link active">
          <Code2 size={18} /> DSA Problems CMS
        </Link>
      </aside>

      <main className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>DSA Problems CMS</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Add, bulk import, edit, or remove coding challenges live.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => { setImportStats(null); setIsImportModalOpen(true); }}
              className="btn btn-secondary"
            >
              <UploadCloud size={16} /> Bulk Import
            </button>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="btn btn-primary"
            >
              <Plus size={16} /> Add Problem
            </button>
          </div>
        </div>

        {/* Problems Table */}
        <div className="data-table-wrapper">
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <SkeletonLoader rows={5} height="44px" />
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Difficulty</th>
                  <th>Topics</th>
                  <th>Companies</th>
                  <th>Submissions</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.map(p => (
                  <tr key={p.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{p.title}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/dsa/{p.slug}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${p.difficulty?.toLowerCase()}`}>{p.difficulty}</span>
                    </td>
                    <td>{p.topics?.join(', ')}</td>
                    <td>{p.companies?.join(', ')}</td>
                    <td>{p.totalSubmissions || 0}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="btn-icon"
                          style={{ color: 'var(--color-rose)' }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Add / Edit Problem Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>
              {editingId ? 'Edit DSA Problem' : 'Publish New DSA Challenge'}
            </h3>

            <form onSubmit={handleSaveProblem}>
              <div className="form-group">
                <label className="form-label">Problem Title</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Trapping Rain Water"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select
                    className="select"
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value as any)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Custom Slug (optional)</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="trapping-rain-water"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Topics (comma separated)</label>
                <input
                  type="text"
                  className="input"
                  value={topics}
                  onChange={e => setTopics(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Tags (comma separated)</label>
                <input
                  type="text"
                  className="input"
                  value={companies}
                  onChange={e => setCompanies(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Problem Description (Markdown / Text)</label>
                <textarea
                  className="textarea"
                  rows={4}
                  placeholder="Given an array of integers..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Sample Input</label>
                  <input
                    type="text"
                    className="input"
                    value={testInput}
                    onChange={e => setTestInput(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Output</label>
                  <input
                    type="text"
                    className="input"
                    value={testExpected}
                    onChange={e => setTestExpected(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Publishing...' : 'Publish to Platform'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {isImportModalOpen && (
        <div className="modal-overlay" onClick={() => setIsImportModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UploadCloud size={20} color="var(--color-cyan)" /> Bulk Import DSA Problems
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Paste a JSON array of problem objects or upload a <code style={{ color: 'var(--color-cyan)' }}>.json</code> file.
            </p>

            <form onSubmit={handleBulkImport}>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>JSON Data</label>
                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', padding: '4px 10px' }}>
                    <FileText size={14} /> Upload .json File
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <textarea
                  className="textarea"
                  rows={8}
                  placeholder={`[\n  {\n    "title": "Two Sum",\n    "difficulty": "Easy",\n    "topics": ["Arrays", "Hashing"],\n    "description": "Given an array..."\n  }\n]`}
                  value={importJson}
                  onChange={e => setImportJson(e.target.value)}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  id="overwriteDsa"
                  checked={overwrite}
                  onChange={e => setOverwrite(e.target.checked)}
                  style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--color-cyan)' }}
                />
                <label htmlFor="overwriteDsa" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Overwrite / update existing problems if slug or title matches
                </label>
              </div>

              {importStats && (
                <div style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                  <div style={{ color: 'var(--color-emerald)', fontWeight: 700, marginBottom: '4px' }}>
                    ✓ Import Finished
                  </div>
                  <div>Imported: <strong>{importStats.imported}</strong> | Updated: <strong>{importStats.updated}</strong> | Skipped: <strong>{importStats.skipped}</strong></div>
                  {importStats.errors?.length > 0 && (
                    <div style={{ color: 'var(--color-rose)', marginTop: '6px', fontSize: '0.8rem' }}>
                      {importStats.errors.join(', ')}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsImportModalOpen(false)} className="btn btn-secondary">
                  Close
                </button>
                <button type="submit" disabled={importing || !importJson.trim()} className="btn btn-primary">
                  {importing ? 'Processing Import...' : 'Run Bulk Import'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
