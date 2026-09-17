import React, { useState } from 'react';
import { Play, RotateCcw, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';

interface VisualStep {
  stepNumber: number;
  title: string;
  description: string;
  visualType: 'work_units' | 'percentage_bar' | 'ratio_boxes' | 'series_flow' | 'probability_tree' | 'venn_diagram';
  data: any;
}

interface AptitudeVisualizerProps {
  steps: VisualStep[];
  topicTitle?: string;
}

export const AptitudeVisualizer: React.FC<AptitudeVisualizerProps> = ({ steps, topicTitle }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!steps || steps.length === 0) return null;

  const step = steps[currentStep] || steps[0];

  return (
    <div className="visualizer-container" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={18} color="var(--color-cyan)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Interactive Visual Solution — {topicTitle || 'Aptitude Breakdown'}
          </span>
        </div>
        <span className="badge badge-cyan">Step {currentStep + 1} of {steps.length}</span>
      </div>

      {/* Visual Canvas */}
      <div className="visualizer-canvas" style={{ minHeight: '160px', padding: '1.5rem' }}>
        <h5 style={{ fontSize: '1rem', color: 'var(--color-cyan)', marginBottom: '0.75rem' }}>
          {step.title}
        </h5>

        {/* Work Units Visualizer */}
        {step.visualType === 'work_units' && (
          <div style={{ width: '100%', maxWidth: '480px', textAlign: 'center' }}>
            <div className="work-units-bar">
              <div className="work-unit-segment segment-a" style={{ width: '60%' }}>
                Person A: 3 Units/Day
              </div>
              <div className="work-unit-segment segment-b" style={{ width: '40%' }}>
                Person B: 2 Units/Day
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>Total Work = 30 LCM Units</span>
              <span>Combined = 5 Units/Day</span>
              <strong style={{ color: 'var(--color-emerald)' }}>Total = 6 Days</strong>
            </div>
          </div>
        )}

        {/* Percentage Bar Visualizer */}
        {step.visualType === 'percentage_bar' && (
          <div style={{ width: '100%', maxWidth: '480px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <div style={{ flex: 1, background: 'var(--bg-tertiary)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Initial Price</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹100</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--color-cyan)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan)' }}>New Price (+25%)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-cyan)' }}>₹125</div>
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '8px 12px', borderRadius: '6px', textAlign: 'center', fontSize: '0.85rem' }}>
              Expenditure constant: 10,000 / 125 = 80 kg → <strong style={{ color: 'var(--color-emerald)' }}>20% Reduction</strong>
            </div>
          </div>
        )}

        {/* Series Flow Visualizer */}
        {step.visualType === 'series_flow' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {step.data?.terms?.map((t: number, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {t}
                </div>
                {step.data.diffs && step.data.diffs[i] && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 700 }}>
                    +{step.data.diffs[i]} →
                  </span>
                )}
              </div>
            ))}
            {step.data?.nextTerm && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-emerald)', fontWeight: 700 }}>
                  +{step.data.nextDiff} →
                </span>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', border: '2px solid var(--color-emerald)', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  {step.data.nextTerm}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="step-explanation-box">
        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
          {step.description}
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <button
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="btn btn-secondary btn-sm"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        <button
          onClick={() => setCurrentStep(0)}
          className="btn-icon"
          title="Restart"
        >
          <RotateCcw size={14} />
        </button>

        <button
          onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
          disabled={currentStep >= steps.length - 1}
          className="btn btn-primary btn-sm"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
