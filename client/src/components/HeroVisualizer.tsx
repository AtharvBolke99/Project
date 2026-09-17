import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Sparkles, CheckCircle2, ArrowRightLeft } from 'lucide-react';

export const HeroVisualizer: React.FC = () => {
  const initialArray = [4, 7, 2, 9, 1];
  const [array, setArray] = useState<number[]>([...initialArray]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [stepText, setStepText] = useState('Comparing [ 4 ] & [ 7 ] — 4 <= 7 (No swap needed)');
  const [phase, setPhase] = useState<'idle' | 'running' | 'completed'>('running');

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const steps = [
      {
        arr: [4, 7, 2, 9, 1],
        comp: [0, 1],
        swap: [],
        sorted: [],
        text: 'Comparing array[0] (4) and array[1] (7) — In order.'
      },
      {
        arr: [4, 7, 2, 9, 1],
        comp: [1, 2],
        swap: [1, 2],
        text: 'Comparing array[1] (7) and array[2] (2) — 7 > 2. SWAP!'
      },
      {
        arr: [4, 2, 7, 9, 1],
        comp: [1, 2],
        swap: [],
        sorted: [],
        text: 'Swapped! Current Array: [ 4, 2, 7, 9, 1 ]'
      },
      {
        arr: [4, 2, 7, 9, 1],
        comp: [2, 3],
        swap: [],
        sorted: [],
        text: 'Comparing array[2] (7) and array[3] (9) — In order.'
      },
      {
        arr: [4, 2, 7, 9, 1],
        comp: [3, 4],
        swap: [3, 4],
        text: 'Comparing array[3] (9) and array[4] (1) — 9 > 1. SWAP!'
      },
      {
        arr: [4, 2, 7, 1, 9],
        comp: [],
        swap: [],
        sorted: [4],
        text: 'Pass 1 complete: Largest element [ 9 ] placed at end.'
      },
      {
        arr: [1, 2, 4, 7, 9],
        comp: [],
        swap: [],
        sorted: [0, 1, 2, 3, 4],
        text: '✨ Fully Sorted: [ 1, 2, 4, 7, 9 ] in O(N log N) time!'
      }
    ];

    let currentStep = 0;

    const runNext = () => {
      if (currentStep < steps.length) {
        const s = steps[currentStep];
        setArray(s.arr);
        setComparing(s.comp);
        setSwapping(s.swap);
        setSortedIndices(s.sorted || []);
        setStepText(s.text);
        currentStep++;
        timeout = setTimeout(runNext, 1200);
      } else {
        setPhase('completed');
        timeout = setTimeout(() => {
          currentStep = 0;
          setPhase('running');
          runNext();
        }, 3000);
      }
    };

    runNext();

    return () => clearTimeout(timeout);
  }, []);

  const handleReset = () => {
    setArray([...initialArray]);
    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);
    setStepText('Reset to initial state: [ 4, 7, 2, 9, 1 ]');
  };

  return (
    <div className="visualizer-container glass-card glowing-border" style={{ width: '100%', maxWidth: '580px', margin: '0 auto' }}>
      {/* Visualizer Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)', boxShadow: '0 0 10px var(--color-primary-glow)' }} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            Live Algorithm Animator
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>O(N log N)</span>
          <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Pass 1</span>
        </div>
      </div>

      {/* Visualizer Interactive Array Stage */}
      <div className="visualizer-canvas" style={{ minHeight: '180px' }}>
        <div className="array-container">
          {array.map((val, idx) => {
            const isComp = comparing.includes(idx);
            const isSwap = swapping.includes(idx);
            const isSorted = sortedIndices.includes(idx);

            let boxClass = 'array-box';
            if (isSorted) boxClass += ' match';
            else if (isSwap) boxClass += ' highlight';
            else if (isComp) boxClass += ' comparing';

            return (
              <div key={idx} className="array-item">
                {isComp && (
                  <span className="pointer-badge">
                    {isSwap ? 'SWAP' : 'CMP'}
                  </span>
                )}
                {isSorted && (
                  <span className="pointer-badge" style={{ background: 'var(--color-emerald)' }}>
                    ✓
                  </span>
                )}
                <div
                  className={boxClass}
                  style={{
                    height: `${Math.max(48, val * 10 + 24)}px`,
                    transform: isSwap ? 'scale(1.1) rotate(4deg)' : (isComp ? 'translateY(-6px)' : 'none')
                  }}
                >
                  {val}
                </div>
                <span className="array-index">[{idx}]</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Step Explanation Bar */}
      <div className="step-explanation-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="var(--color-cyan)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
            {stepText}
          </span>
        </div>
        <button onClick={handleReset} className="btn-icon" style={{ padding: '4px' }} title="Replay">
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
};
