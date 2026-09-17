import React, { useState, useEffect } from 'react';
import { Play, Send, RotateCcw, Check, Sparkles, AlertCircle, Clock, Database, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

interface CodeEditorProps {
  problemId: string;
  starterCode: {
    javascript: string;
    python: string;
    cpp: string;
    java: string;
  };
  testCases: TestCase[];
  onSolved?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  problemId,
  starterCode,
  testCases,
  onSolved
}) => {
  const [language, setLanguage] = useState<'javascript' | 'python' | 'cpp' | 'java'>('javascript');
  const [code, setCode] = useState(starterCode.javascript);
  const [activeTab, setActiveTab] = useState<'testcases' | 'custom' | 'result'>('testcases');
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);

  const { showToast } = useToast();

  useEffect(() => {
    setCode(starterCode[language] || '');
  }, [language, starterCode]);

  const handleReset = () => {
    setCode(starterCode[language] || '');
    showToast('Code reset to template.', 'info');
  };

  const handleRun = async () => {
    setIsRunning(true);
    setActiveTab('result');
    try {
      const res = await api.post('/execution/run', {
        problemId,
        language,
        code,
        customInput: activeTab === 'custom' ? customInput : undefined
      });

      if (res.success && res.result) {
        setExecutionResult(res.result);
      }
    } catch (err: any) {
      setExecutionResult({
        status: 'Runtime Error',
        error: err.message || 'Execution failed'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setActiveTab('result');
    try {
      const res = await api.post('/execution/submit', {
        problemId,
        language,
        code
      });

      if (res.success && res.result) {
        setExecutionResult(res.result);
        if (res.result.status === 'Accepted') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
          showToast(`🎉 Accepted! +${res.gamification?.xpAdded || 20} XP Awarded`, 'success');
          if (onSolved) onSolved();
        } else {
          showToast(`Result: ${res.result.status}`, 'error');
        }
      }
    } catch (err: any) {
      setExecutionResult({
        status: 'Runtime Error',
        error: err.message || 'Submission failed'
      });
      showToast('Submission error: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const lineCount = code.split('\n').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-secondary)' }}>
      {/* Editor Action Header */}
      <div className="pane-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value as any)}
            className="select"
            style={{ width: '130px', padding: '4px 8px', fontSize: '0.8125rem' }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ (GCC)</option>
            <option value="java">Java 17</option>
          </select>
          <button onClick={handleReset} className="btn-icon" title="Reset Code" style={{ padding: '4px' }}>
            <RotateCcw size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="btn btn-secondary btn-sm"
          >
            <Play size={14} />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="btn btn-primary btn-sm"
          >
            <Send size={14} />
            <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {/* Editor Code Textarea Area with Line Numbers */}
      <div style={{ display: 'flex', flex: 1, minHeight: '260px', overflow: 'hidden', background: '#090D16' }}>
        {/* Line Numbers */}
        <div style={{
          padding: '12px 8px',
          background: '#06090F',
          color: '#4B5563',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          textAlign: 'right',
          userSelect: 'none',
          borderRight: '1px solid var(--border-subtle)'
        }}>
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Input */}
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          style={{
            flex: 1,
            background: 'transparent',
            color: '#F8FAFC',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            padding: '12px',
            border: 'none',
            outline: 'none',
            resize: 'none',
            whiteSpace: 'pre',
            overflowY: 'auto'
          }}
        />
      </div>

      {/* Bottom Test Cases & Execution Results Panel */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-card)', minHeight: '180px', display: 'flex', flexDirection: 'column' }}>
        <div className="tabs-header" style={{ padding: '8px 12px 0 12px', background: 'var(--bg-tertiary)' }}>
          <button
            onClick={() => setActiveTab('testcases')}
            className={`tab-btn ${activeTab === 'testcases' ? 'active' : ''}`}
            style={{ fontSize: '0.8rem', padding: '4px 10px' }}
          >
            Test Cases
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
            style={{ fontSize: '0.8rem', padding: '4px 10px' }}
          >
            Custom Input
          </button>
          <button
            onClick={() => setActiveTab('result')}
            className={`tab-btn ${activeTab === 'result' ? 'active' : ''}`}
            style={{ fontSize: '0.8rem', padding: '4px 10px' }}
          >
            Terminal / Results
          </button>
        </div>

        <div style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
          {activeTab === 'testcases' && (
            <div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                {testCases.map((tc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTestCaseIndex(idx)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      background: selectedTestCaseIndex === idx ? 'rgba(0, 229, 255, 0.15)' : 'var(--bg-secondary)',
                      borderColor: selectedTestCaseIndex === idx ? 'var(--color-cyan)' : 'var(--border-subtle)',
                      fontSize: '0.75rem'
                    }}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>

              {testCases[selectedTestCaseIndex] && (
                <div style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Input:</span>
                    <pre style={{ background: 'var(--bg-secondary)', padding: '6px 10px', borderRadius: '6px', marginTop: '2px' }}>
                      {testCases[selectedTestCaseIndex].input}
                    </pre>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Expected Output:</span>
                    <pre style={{ background: 'var(--bg-secondary)', padding: '6px 10px', borderRadius: '6px', marginTop: '2px' }}>
                      {testCases[selectedTestCaseIndex].expectedOutput}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'custom' && (
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Custom Test Input</label>
              <textarea
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                placeholder="[2, 7, 11, 15], 9"
                rows={3}
                className="textarea"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}
              />
            </div>
          )}

          {activeTab === 'result' && (
            <div>
              {!executionResult && !isRunning && !isSubmitting && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem' }}>
                  <Terminal size={24} style={{ margin: '0 auto 8px auto', display: 'block', opacity: 0.5 }} />
                  Run your code or Submit to view execution metrics.
                </div>
              )}

              {(isRunning || isSubmitting) && (
                <div style={{ textAlign: 'center', color: 'var(--color-cyan)', fontSize: '0.85rem', padding: '1rem' }}>
                  Evaluating test cases in sandboxed environment...
                </div>
              )}

              {executionResult && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${executionResult.status === 'Accepted' ? 'badge-easy' : 'badge-hard'}`} style={{ fontSize: '0.8rem' }}>
                        {executionResult.status}
                      </span>
                      {executionResult.testCasesPassed !== undefined && (
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                          {executionResult.testCasesPassed} / {executionResult.totalTestCases} Passed
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {executionResult.executionTimeMs} ms
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Database size={12} /> {Math.round(executionResult.memoryKb / 1024)} MB
                      </span>
                    </div>
                  </div>

                  {executionResult.error && (
                    <div style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--color-rose)', padding: '8px 10px', borderRadius: '6px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                      {executionResult.error}
                    </div>
                  )}

                  {executionResult.details?.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {executionResult.details.map((d: any) => (
                        <div
                          key={d.testCaseIndex}
                          style={{
                            background: 'var(--bg-secondary)',
                            borderLeft: `3px solid ${d.passed ? 'var(--color-emerald)' : 'var(--color-rose)'}`,
                            padding: '6px 10px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          <div><strong>Case {d.testCaseIndex}:</strong> {d.passed ? 'Passed ✓' : 'Failed ✗'} ({d.executionTimeMs}ms)</div>
                          {!d.passed && (
                            <div style={{ marginTop: '2px', color: 'var(--text-muted)' }}>
                              Expected: {d.expectedOutput} | Output: {d.actualOutput}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
