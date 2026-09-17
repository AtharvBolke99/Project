import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, 
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

export const AdminAptitude: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Form State
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<'Quantitative' | 'Logical Reasoning' | 'Verbal Ability'>('Quantitative');
  const [topicTitle, setTopicTitle] = useState('Percentages');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [shortcut, setShortcut] = useState('');
  const [saving, setSaving] = useState(false);

  // Bulk Import State
  const [importJson, setImportJson] = useState('');
  const [overwrite, setOverwrite] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importStats, setImportStats] = useState<any>(null);

  const { showToast } = useToast();

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/aptitude/topics/percentages');
      if (res.success && res.questions) {
        setQuestions(res.questions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        question,
        category,
        topicTitle,
        options: [opt0, opt1, opt2, opt3],
        correctAnswer,
        explanation,
        shortcut,
        visualSteps: [
          {
            stepNumber: 1,
            title: 'Visual Step',
            description: explanation,
            visualType: 'work_units',
            data: {}
          }
        ]
      };

      await api.post('/admin/aptitude', payload);
      showToast('Aptitude question published live!', 'success');
      setIsModalOpen(false);
      resetForm();
      fetchQuestions();
    } catch (err: any) {
      showToast(err.message || 'Failed to save question', 'error');
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

      const qArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      const res = await api.post('/admin/aptitude/import', { questions: qArray, overwrite });

      if (res.success) {
        setImportStats(res.stats);
        showToast(res.message || 'Import successful!', 'success');
        fetchQuestions();
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
    if (!window.confirm('Delete this aptitude question?')) return;
    try {
      await api.delete(`/admin/aptitude/${id}`);
      showToast('Question deleted.', 'info');
      fetchQuestions();
    } catch (e: any) {
      showToast(e.message || 'Delete failed', 'error');
    }
  };

  const resetForm = () => {
    setQuestion('');
    setCategory('Quantitative');
    setTopicTitle('Percentages');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setCorrectAnswer(0);
    setExplanation('');
    setShortcut('');
  };

  return (
    <div className="admin-layout animate-fade-in">
      <aside className="admin-sidebar">
        <Link to="/admin" className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
          <ChevronLeft size={16} /> Back to Overview
        </Link>
        <Link to="/admin" className="admin-sidebar-link">
          <LayoutDashboard size={18} /> Overview
        </Link>
        <Link to="/admin/aptitude" className="admin-sidebar-link active">
          <BrainCircuit size={18} /> Aptitude CMS
        </Link>
      </aside>

      <main className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Aptitude Question Bank CMS</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Add, bulk import, and manage aptitude questions with formulas and shortcut tricks.</p>
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
              <Plus size={16} /> Add Question
            </button>
          </div>
        </div>

        {/* Questions Table */}
        <div className="data-table-wrapper">
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <SkeletonLoader rows={5} height="44px" />
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Category</th>
                  <th>Topic</th>
                  <th>Correct Answer</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map(q => (
                  <tr key={q.id}>
                    <td style={{ maxWidth: '400px' }}>
                      <strong style={{ color: 'var(--text-primary)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {q.question}
                      </strong>
                    </td>
                    <td><span className="badge badge-purple">{q.category}</span></td>
                    <td>{q.topicTitle}</td>
                    <td style={{ color: 'var(--color-emerald)', fontWeight: 600 }}>Option {q.correctAnswer + 1} ({q.options[q.correctAnswer]})</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="btn-icon"
                        style={{ color: 'var(--color-rose)' }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Add Question Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Publish New Aptitude Question</h3>
            <form onSubmit={handleSaveQuestion}>
              <div className="form-group">
                <label className="form-label">Question Text</label>
                <textarea
                  className="textarea"
                  rows={3}
                  placeholder="If A can do a work in 10 days..."
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="select" value={category} onChange={e => setCategory(e.target.value as any)}>
                    <option value="Quantitative">Quantitative</option>
                    <option value="Logical Reasoning">Logical Reasoning</option>
                    <option value="Verbal Ability">Verbal Ability</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Topic Title</label>
                  <input type="text" className="input" value={topicTitle} onChange={e => setTopicTitle(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="text" className="input" placeholder="Option A" value={opt0} onChange={e => setOpt0(e.target.value)} required />
                <input type="text" className="input" placeholder="Option B" value={opt1} onChange={e => setOpt1(e.target.value)} required />
                <input type="text" className="input" placeholder="Option C" value={opt2} onChange={e => setOpt2(e.target.value)} required />
                <input type="text" className="input" placeholder="Option D" value={opt3} onChange={e => setOpt3(e.target.value)} required />
              </div>

              <div className="form-group" style={{ marginTop: '12px' }}>
                <label className="form-label">Correct Option</label>
                <select className="select" value={correctAnswer} onChange={e => setCorrectAnswer(Number(e.target.value))}>
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Explanation</label>
                <textarea className="textarea" rows={3} value={explanation} onChange={e => setExplanation(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">10-Second Shortcut Trick</label>
                <input type="text" className="input" placeholder="e.g. Formula: (A * B) / (A + B)" value={shortcut} onChange={e => setShortcut(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Publishing...' : 'Publish Question'}
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
              <UploadCloud size={20} color="var(--color-cyan)" /> Bulk Import Aptitude Questions
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Paste a JSON array of question objects or upload a <code style={{ color: 'var(--color-cyan)' }}>.json</code> file.
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
                  placeholder={`[\n  {\n    "question": "A and B together can do a piece of work in 12 days...",\n    "options": ["7.2 days", "6.5 days", "8.0 days", "7.5 days"],\n    "correctAnswer": 0,\n    "category": "Quantitative",\n    "topicTitle": "Time & Work",\n    "explanation": "Total work = LCM(12, 18)..."\n  }\n]`}
                  value={importJson}
                  onChange={e => setImportJson(e.target.value)}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  id="overwriteApt"
                  checked={overwrite}
                  onChange={e => setOverwrite(e.target.checked)}
                  style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--color-cyan)' }}
                />
                <label htmlFor="overwriteApt" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Overwrite / update existing questions if question text or slug matches
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
