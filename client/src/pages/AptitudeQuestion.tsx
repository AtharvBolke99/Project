import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  Clock, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  HelpCircle, 
  Zap, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { AptitudeVisualizer } from '../components/AptitudeVisualizer';
import { SkeletonLoader } from '../components/SkeletonLoader';

export const AptitudeQuestion: React.FC = () => {
  const { topicSlug, slug } = useParams<{ topicSlug: string; slug: string }>();
  const [questionData, setQuestionData] = useState<any>(null);
  const [topicQuestions, setTopicQuestions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);

  const { showToast } = useToast();

  // Load sibling questions for sequential navigation
  useEffect(() => {
    if (topicSlug) {
      api.get(`/aptitude/topics/${topicSlug}?limit=100`).then(res => {
        if (res.success && res.questions) {
          setTopicQuestions(res.questions);
        }
      }).catch(err => console.error('Failed to load topic questions:', err));
    }
  }, [topicSlug]);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const qSlug = slug || 'person-a-and-b-together-work';
      const res = await api.get(`/aptitude/questions/${qSlug}`);
      if (res.success && res.data) {
        setQuestionData(res.data);
        if (res.data.userSubmission) {
          setSelectedOption(res.data.userSubmission.selectedOption);
        }
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to load question', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setSubmissionResult(null);
    setSelectedOption(null);
    setShowVisualizer(false);
  }, [slug]);

  // Question Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleSubmitAnswer = async () => {
    if (selectedOption === null) {
      showToast('Please choose an option before submitting.', 'info');
      return;
    }

    setSubmitting(true);
    setIsTimerRunning(false);

    try {
      const res = await api.post('/aptitude/submit', {
        questionId: questionData.id,
        selectedOption,
        timeSpentSec: timerSeconds
      });

      if (res.success) {
        setSubmissionResult(res);
        if (res.isCorrect) {
          confetti({ particleCount: 60, spread: 60 });
          showToast(`🎯 Correct Answer! +${res.gamification?.xpAdded || 10} XP`, 'success');
        } else {
          showToast('Incorrect answer. Review the explanation & visual shortcut.', 'error');
        }
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to submit answer', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <SkeletonLoader rows={6} height="45px" />
      </div>
    );
  }

  if (!questionData) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <h2>Aptitude question not found.</h2>
        <Link to="/aptitude" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Aptitude Arena
        </Link>
      </div>
    );
  }

  const currentIndex = topicQuestions.findIndex(q => q.slug === slug);
  const prevQuestion = currentIndex > 0 ? topicQuestions[currentIndex - 1] : null;
  const nextQuestion = currentIndex >= 0 && currentIndex < topicQuestions.length - 1 ? topicQuestions[currentIndex + 1] : null;

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container" style={{ paddingTop: '2rem', maxWidth: '880px' }}>
        {/* Navigation Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to={`/aptitude/topic/${topicSlug}`} className="btn btn-secondary btn-sm">
              <ChevronLeft size={16} /> {questionData.topicTitle || 'Topic Questions'}
            </Link>
            {currentIndex >= 0 && (
              <span className="badge badge-purple" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                Q{currentIndex + 1} of {topicQuestions.length || 50}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {prevQuestion && (
              <Link to={`/aptitude/${topicSlug}/${prevQuestion.slug}`} className="btn btn-secondary btn-sm" title="Previous Question">
                <ChevronLeft size={15} /> Prev
              </Link>
            )}
            {nextQuestion && (
              <Link to={`/aptitude/${topicSlug}/${nextQuestion.slug}`} className="btn btn-secondary btn-sm" title="Next Question">
                Next <ChevronRight size={15} />
              </Link>
            )}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem'
            }}>
              <Clock size={16} color="var(--color-cyan)" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>
            <span className={`badge badge-${questionData.difficulty.toLowerCase()}`}>
              {questionData.difficulty}
            </span>
          </div>
        </div>

        {/* Question Card */}
        <div className="card glass-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <span className="badge badge-purple">{questionData.category}</span>
            <span className="badge badge-cyan">{questionData.topicTitle}</span>
          </div>

          <h3 style={{ fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '2rem', fontWeight: 600 }}>
            {questionData.question}
          </h3>

          {/* Multiple Choice Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
            {questionData.options?.map((option: string, idx: number) => {
              const isSelected = selectedOption === idx;
              const isSubmitted = Boolean(submissionResult);
              const isCorrectOpt = isSubmitted && submissionResult.correctAnswer === idx;
              const isWrongSelected = isSubmitted && isSelected && !submissionResult.isCorrect;

              let optionStyle = {
                padding: '14px 18px',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                cursor: isSubmitted ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease'
              };

              if (isCorrectOpt) {
                optionStyle.background = 'rgba(16, 185, 129, 0.15)';
                optionStyle.border = '1px solid var(--color-emerald)';
              } else if (isWrongSelected) {
                optionStyle.background = 'rgba(244, 63, 94, 0.15)';
                optionStyle.border = '1px solid var(--color-rose)';
              } else if (isSelected) {
                optionStyle.background = 'rgba(0, 229, 255, 0.12)';
                optionStyle.border = '1px solid var(--color-cyan)';
              }

              return (
                <div
                  key={idx}
                  style={optionStyle}
                  onClick={() => !isSubmitted && setSelectedOption(idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {option}
                    </span>
                  </div>

                  {isCorrectOpt && <CheckCircle2 size={20} color="var(--color-emerald)" />}
                  {isWrongSelected && <XCircle size={20} color="var(--color-rose)" />}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          {!submissionResult ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null || submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              {submitting ? 'Verifying Answer...' : 'Submit Answer'}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowVisualizer(prev => !prev)}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <Sparkles size={16} /> {showVisualizer ? 'Hide Visualizer' : '▶ VISUALIZE SOLUTION'}
              </button>
              {nextQuestion ? (
                <Link to={`/aptitude/${topicSlug}/${nextQuestion.slug}`} className="btn btn-secondary" style={{ fontWeight: 700 }}>
                  Next Question (Q{currentIndex + 2}) <ChevronRight size={16} />
                </Link>
              ) : (
                <Link to={`/aptitude/topic/${topicSlug}`} className="btn btn-secondary">
                  Back to Topic Questions <ChevronRight size={16} />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Detailed Explanation & Visual Solver */}
        {submissionResult && (
          <div className="card animate-slide-up" style={{ marginBottom: '2.5rem' }}>
            <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="var(--color-cyan)" /> Step-by-Step Solution Breakdown
            </h4>

            {/* Formula / Shortcut Badges */}
            {submissionResult.shortcut && (
              <div style={{ background: 'rgba(0, 229, 255, 0.08)', border: '1px solid var(--border-highlight)', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.25rem' }}>
                <strong style={{ color: 'var(--color-cyan)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  ⚡ 10-Second Shortcut Trick:
                </strong>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {submissionResult.shortcut}
                </p>
              </div>
            )}

            {/* Text Explanation */}
            <div style={{ fontSize: '0.9375rem', lineHeight: '1.6', color: 'var(--text-secondary)', whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>
              {submissionResult.explanation}
            </div>

            {/* Interactive Visual Breakdown */}
            {showVisualizer && submissionResult.visualSteps?.length > 0 && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                <AptitudeVisualizer
                  steps={submissionResult.visualSteps}
                  topicTitle={questionData.topicTitle}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
