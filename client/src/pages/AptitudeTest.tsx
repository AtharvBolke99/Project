import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Award, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  ChevronRight, 
  BookOpen, 
  Flame,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { AptitudeVisualizer } from '../components/AptitudeVisualizer';
import { SkeletonLoader } from '../components/SkeletonLoader';

export const AptitudeTest: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const topicParam = searchParams.get('topicId') || 'All';
  const countParam = searchParams.get('count') || '5';

  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  
  // Timer State
  const [timeLeftSec, setTimeLeftSec] = useState(300); // 5 min default
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Result State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchTest = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/aptitude/test/generate?category=${encodeURIComponent(categoryParam)}&topicId=${encodeURIComponent(topicParam)}&count=${countParam}`);
      if (res.success && res.data && res.data.questions?.length > 0) {
        setTestData(res.data);
        setTimeLeftSec(res.data.durationMinutes * 60);
        setIsTimerActive(true);
      } else {
        showToast('No questions available for this test configuration.', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to start test', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTest();
  }, [categoryParam, topicParam, countParam]);

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeftSec > 0) {
      timer = setInterval(() => {
        setTimeLeftSec(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTimerActive(false);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeftSec]);

  const handleAutoSubmit = () => {
    showToast('Time has expired! Submitting test automatically...', 'info');
    handleSubmitTest();
  };

  const handleSelectOption = (questionId: string, optIndex: number) => {
    if (testResult) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: optIndex
    }));
  };

  const toggleMarkForReview = (questionId: string) => {
    setMarkedForReview(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    setIsTimerActive(false);

    try {
      const totalDuration = testData?.durationMinutes * 60 || 300;
      const timeSpent = totalDuration - timeLeftSec;

      const res = await api.post('/aptitude/test/submit', {
        answers,
        timeSpentSeconds: Math.max(10, timeSpent)
      });

      if (res.success && res.data) {
        setTestResult(res.data);
        if (res.data.accuracy >= 70) {
          confetti({ particleCount: 90, spread: 70 });
          showToast(`🏆 Outstanding! ${res.data.accuracy}% Accuracy (+${res.data.gamification?.xpAdded || 40} XP)`, 'success');
        } else {
          showToast(`Test completed! Score: ${res.data.score}/${res.data.totalQuestions}`, 'info');
        }
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to submit test', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '900px' }}>
        <SkeletonLoader rows={8} height="50px" />
      </div>
    );
  }

  if (!testData || testData.questions.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <h2>Unable to load test questions.</h2>
        <Link to="/aptitude" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Aptitude Arena
        </Link>
      </div>
    );
  }

  const currentQ = testData.questions[currentIndex];
  const isAnswered = answers[currentQ?.id] !== undefined;

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container" style={{ paddingTop: '1.5rem', maxWidth: '1080px' }}>
        {/* Top Sticky Test Toolbar */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '12px 20px',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/aptitude" className="btn-icon" title="Exit Test">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                Placement Aptitude Mock Test
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {categoryParam !== 'All' ? categoryParam : 'Mixed Quantitative & Logical'} • {testData.totalQuestions} Questions
              </span>
            </div>
          </div>

          {!testResult ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: timeLeftSec < 120 ? 'rgba(244, 63, 94, 0.15)' : 'var(--bg-tertiary)',
                color: timeLeftSec < 120 ? 'var(--color-rose)' : 'var(--color-cyan)',
                border: `1px solid ${timeLeftSec < 120 ? 'var(--color-rose)' : 'var(--border-subtle)'}`,
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}>
                <Clock size={16} />
                <span>{formatTimer(timeLeftSec)}</span>
              </div>

              <button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="btn btn-primary btn-sm"
              >
                {isSubmitting ? 'Submitting...' : 'Finish & Submit Test'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={fetchTest} className="btn btn-secondary btn-sm">
                <RotateCcw size={14} /> Retake New Test
              </button>
              <Link to="/aptitude" className="btn btn-primary btn-sm">
                Back to Topics
              </Link>
            </div>
          )}
        </div>

        {/* Test Body Layout */}
        {!testResult ? (
          <div className="aptitude-test-grid" style={{ alignItems: 'start' }}>
            {/* Left: Question Card */}
            <div className="card glass-card glowing-border" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span className="badge badge-cyan">
                  Question {currentIndex + 1} of {testData.totalQuestions}
                </span>
                <span className={`badge badge-${currentQ.difficulty.toLowerCase()}`}>
                  {currentQ.difficulty}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '1.75rem', fontWeight: 600 }}>
                {currentQ.question}
              </h3>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
                {currentQ.options?.map((opt: string, optIdx: number) => {
                  const isSelected = answers[currentQ.id] === optIdx;
                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      style={{
                        padding: '14px 18px',
                        borderRadius: '12px',
                        background: isSelected ? 'rgba(0, 229, 255, 0.12)' : 'var(--bg-secondary)',
                        border: `1px solid ${isSelected ? 'var(--color-cyan)' : 'var(--border-subtle)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isSelected ? 'var(--color-cyan)' : 'var(--bg-tertiary)',
                        color: isSelected ? '#07090E' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem'
                      }}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Question Navigation Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <button
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="btn btn-secondary btn-sm"
                >
                  <ArrowLeft size={14} /> Previous
                </button>

                <button
                  onClick={() => toggleMarkForReview(currentQ.id)}
                  className={`btn btn-sm ${markedForReview[currentQ.id] ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem' }}
                >
                  {markedForReview[currentQ.id] ? '★ Marked for Review' : '☆ Mark for Review'}
                </button>

                <button
                  onClick={() => setCurrentIndex(prev => Math.min(testData.totalQuestions - 1, prev + 1))}
                  disabled={currentIndex === testData.totalQuestions - 1}
                  className="btn btn-secondary btn-sm"
                >
                  Next <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right: Question Palette */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Question Palette
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '1.5rem' }}>
                {testData.questions.map((q: any, idx: number) => {
                  const answered = answers[q.id] !== undefined;
                  const isCurrent = currentIndex === idx;
                  const marked = markedForReview[q.id];

                  let bg = 'var(--bg-secondary)';
                  let color = 'var(--text-secondary)';
                  let border = '1px solid var(--border-subtle)';

                  if (isCurrent) {
                    border = '2px solid var(--color-cyan)';
                  }
                  if (marked) {
                    bg = 'rgba(245, 158, 11, 0.2)';
                    color = 'var(--color-amber)';
                  } else if (answered) {
                    bg = 'rgba(16, 185, 129, 0.2)';
                    color = 'var(--color-emerald)';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      style={{
                        padding: '10px 0',
                        borderRadius: '8px',
                        background: bg,
                        color,
                        border,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.4)' }} />
                  <span>Answered ({Object.keys(answers).length})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(245, 158, 11, 0.4)' }} />
                  <span>Marked for Review ({Object.values(markedForReview).filter(Boolean).length})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }} />
                  <span>Unanswered ({testData.totalQuestions - Object.keys(answers).length})</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= TEST RESULTS & REVIEW VIEW ================= */
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Scorecard */}
            <div className="card glass-card glowing-border" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: testResult.accuracy >= 70 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 229, 255, 0.15)', color: testResult.accuracy >= 70 ? 'var(--color-emerald)' : 'var(--color-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Award size={32} />
              </div>

              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Score: {testResult.score} / {testResult.totalQuestions}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
                Accuracy: <strong style={{ color: 'var(--color-cyan)' }}>{testResult.accuracy}%</strong> • Time: <strong style={{ color: 'var(--text-primary)' }}>{Math.round(testResult.timeSpentSeconds / 60)} mins</strong>
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '12px 24px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Correct Answers</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-emerald)', fontFamily: 'var(--font-mono)' }}>{testResult.score}</div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '12px 24px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Incorrect Answers</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-rose)', fontFamily: 'var(--font-mono)' }}>{testResult.totalQuestions - testResult.score}</div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '12px 24px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>XP Earned</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>+{testResult.gamification?.xpAdded || 25} XP</div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Question Breakdown */}
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={20} color="var(--color-cyan)" /> Question Review & Visual Solutions
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {testResult.details?.map((detail: any, idx: number) => (
                  <div key={detail.id} className="card glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="badge badge-cyan">Question {idx + 1}</span>
                      <span className={`badge ${detail.isCorrect ? 'badge-easy' : 'badge-hard'}`}>
                        {detail.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontWeight: 600 }}>
                      {detail.question}
                    </h4>

                    {/* Options Review */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
                      {detail.options?.map((opt: string, optIdx: number) => {
                        const isCorrect = optIdx === detail.correctAnswer;
                        const isChosenWrong = !detail.isCorrect && optIdx === detail.selectedOption;

                        let style = {
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        };

                        if (isCorrect) {
                          style.background = 'rgba(16, 185, 129, 0.15)';
                          style.border = '1px solid var(--color-emerald)';
                        } else if (isChosenWrong) {
                          style.background = 'rgba(244, 63, 94, 0.15)';
                          style.border = '1px solid var(--color-rose)';
                        }

                        return (
                          <div key={optIdx} style={style}>
                            <span><strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}</span>
                            {isCorrect && <span style={{ color: 'var(--color-emerald)', fontWeight: 700, fontSize: '0.75rem' }}>Correct Answer ✓</span>}
                            {isChosenWrong && <span style={{ color: 'var(--color-rose)', fontWeight: 700, fontSize: '0.75rem' }}>Your Answer ✗</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Shortcut Trick */}
                    {detail.shortcut && (
                      <div style={{ background: 'rgba(0, 229, 255, 0.08)', border: '1px solid var(--border-highlight)', padding: '10px 14px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                        <strong style={{ color: 'var(--color-cyan)' }}>⚡ 10-Second Shortcut Trick:</strong>
                        <p style={{ fontFamily: 'var(--font-mono)', marginTop: '2px', color: 'var(--text-primary)' }}>{detail.shortcut}</p>
                      </div>
                    )}

                    {/* Detailed Explanation */}
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-line', marginBottom: '1rem' }}>
                      {detail.explanation}
                    </div>

                    {/* Visual Solver */}
                    {detail.visualSteps?.length > 0 && (
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                        <AptitudeVisualizer steps={detail.visualSteps} topicTitle="Visual Solution Breakdown" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
