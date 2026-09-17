import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Clock, 
  Database,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { getProblemKnowledge, ProblemSolution } from '../services/dsaKnowledgeBase';

export interface VisualStep {
  stepNumber: number;
  label: string;
  explanation: string;
  codeLine?: number;
  subType?: 'array' | 'stack' | 'queue' | 'linked_list' | 'tree' | 'graph' | 'dp' | 'intervals' | 'map' | 'water' | 'sorting' | 'heap';
  state: any;
  pointers?: Record<string, number | string>;
  highlightedIndices?: number[];
  complexityNote?: string;
}

export interface VisualizeData {
  type?: string;
  initialState?: any;
  steps?: VisualStep[];
}

interface VisualizationPlayerProps {
  data?: VisualizeData;
  problemTitle?: string;
  problemSlug?: string;
  problemInput?: any;
  topic?: string;
  onStepChange?: (step: VisualStep, stepIndex: number) => void;
}

export const VisualizationPlayer: React.FC<VisualizationPlayerProps> = ({
  data,
  problemTitle,
  problemSlug = '',
  problemInput,
  topic = '',
  onStepChange
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);

  // Generate dynamic, problem-specific algorithmic visualization steps
  const generatedSteps: VisualStep[] = useMemo(() => {
    // 1. If pre-baked steps with custom rich states exist in backend data, use them
    if (data?.steps && data.steps.length > 0) {
      return data.steps;
    }

    // 2. Lookup dedicated problem solution from knowledge base
    const kb = getProblemKnowledge(problemSlug, problemTitle, topic);
    if (kb && kb.visualSteps && kb.visualSteps.length > 0) {
      return kb.visualSteps;
    }

    // 3. Fallback to generic two-pointer array scan
    const arr = [2, 4, 6, 8, 10, 12];
    return [
      {
        stepNumber: 1,
        label: 'Initialize Algorithmic Pointers',
        explanation: `Pointers set to boundaries: L=0 (${arr[0]}), R=${arr.length - 1} (${arr[arr.length - 1]}).`,
        codeLine: 2,
        state: { array: arr },
        pointers: { L: 0, R: arr.length - 1 },
        highlightedIndices: [0, arr.length - 1],
        complexityNote: 'O(1) Space',
        subType: 'array'
      },
      {
        stepNumber: 2,
        label: 'Evaluate Invariants & Converge Pointers',
        explanation: 'Comparing elements and adjusting window bounds.',
        codeLine: 4,
        state: { array: arr },
        pointers: { L: 1, R: 4 },
        highlightedIndices: [1, 4],
        complexityNote: 'O(N) Pass',
        subType: 'array'
      },
      {
        stepNumber: 3,
        label: 'Optimal Solution Reached',
        explanation: 'All constraints verified. Returned target result.',
        codeLine: 6,
        state: { array: arr, completed: true, result: [1, 4] },
        pointers: { Result: 2 },
        highlightedIndices: [1, 2, 4],
        complexityNote: 'O(N) Time | O(1) Space',
        subType: 'array'
      }
    ];
  }, [data, problemSlug, problemTitle, topic, problemInput]);

  const totalSteps = generatedSteps.length;
  const currentStep = generatedSteps[currentStepIndex] || generatedSteps[0];

  useEffect(() => {
    if (onStepChange && currentStep) {
      onStepChange(currentStep, currentStepIndex);
    }
  }, [currentStepIndex, currentStep, onStepChange]);

  // Auto-play timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < totalSteps - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 2000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSteps, speed]);

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Render Data Structure Visual Canvas based on Algorithm Subtype
  const renderVisualCanvas = () => {
    if (!currentStep) return null;
    const { state, pointers, highlightedIndices = [], subType = 'array' } = currentStep;

    // 1. HASH MAP & TWO SUM RENDERER
    if (subType === 'map') {
      const arr: number[] = state.array || [2, 7, 11, 15];
      const mapEntries = Object.entries(state.map || {});

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', alignItems: 'center' }}>
          {/* Array Elements */}
          <div style={{ width: '100%' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
              <span>INPUT ARRAY (Target: {state.target || 9})</span>
              {state.complement !== null && state.complement !== undefined && (
                <span style={{ color: 'var(--color-cyan)' }}>
                  Looking for Complement: <strong>{state.complement}</strong>
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {arr.map((val, idx) => {
                const isCur = state.currentIdx === idx;
                const isMatch = state.matchIdx === idx || (state.result && state.result.includes(idx));
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '48px' }}>
                    <span style={{ fontSize: '0.7rem', color: isCur ? 'var(--color-cyan)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      [{idx}]
                    </span>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      fontFamily: 'var(--font-mono)',
                      background: isMatch ? 'rgba(16, 185, 129, 0.25)' : isCur ? 'rgba(0, 229, 255, 0.25)' : 'var(--bg-secondary)',
                      border: isMatch ? '2px solid var(--color-emerald)' : isCur ? '2px solid var(--color-cyan)' : '1px solid var(--border-subtle)',
                      color: isMatch ? 'var(--color-emerald)' : isCur ? 'var(--color-cyan)' : 'var(--text-primary)',
                      boxShadow: isMatch ? '0 0 16px rgba(16, 185, 129, 0.5)' : isCur ? '0 0 14px var(--color-cyan-glow)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      {val}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hash Map Box */}
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '14px 18px',
            borderRadius: '12px',
            border: '1px solid var(--border-medium)',
            width: '100%',
            maxWidth: '650px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-purple)', marginBottom: '8px' }}>
              <Database size={16} />
              <span>DYNAMIC HASH MAP (Key: Value ➔ Value: Index)</span>
            </div>
            {mapEntries.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Map is empty. No elements stored yet.
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {mapEntries.map(([k, v]) => (
                  <div key={k} style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid var(--color-purple)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#c4b5fd',
                    fontWeight: 700
                  }}>
                    <strong>{k}</strong> ➔ idx {String(v)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // 2. STACK VISUALIZER
    if (subType === 'stack') {
      const chars: string[] = state.inputChars || ['(', '{', '}', ')'];
      const stack: string[] = state.stack || [];

      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', width: '100%', alignItems: 'center' }}>
          {/* Stream */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700 }}>
              INPUT TOKEN STREAM
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {chars.map((ch, idx) => {
                const isCur = state.currentIdx === idx;
                const isPast = state.currentIdx > idx;
                return (
                  <div key={idx} style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-mono)',
                    background: isCur ? 'rgba(0, 229, 255, 0.25)' : isPast ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                    border: isCur ? '2px solid var(--color-cyan)' : '1px solid var(--border-subtle)',
                    color: isCur ? 'var(--color-cyan)' : isPast ? 'var(--text-muted)' : 'var(--text-primary)',
                    boxShadow: isCur ? '0 0 12px var(--color-cyan-glow)' : 'none'
                  }}>
                    {ch}
                  </div>
                );
              })}
            </div>
          </div>

          {/* LIFO Container */}
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '16px',
            borderRadius: '12px',
            border: '2px dashed var(--border-medium)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '180px'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 800, marginBottom: '10px' }}>
              LIFO STACK (TOP ⬇)
            </div>
            <div style={{
              width: '100%',
              minHeight: '110px',
              display: 'flex',
              flexDirection: 'column-reverse',
              gap: '6px',
              borderBottom: '3px solid var(--color-cyan)',
              paddingBottom: '6px'
            }}>
              {stack.length === 0 ? (
                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', margin: 'auto 0' }}>
                  [ Empty Stack ]
                </div>
              ) : (
                stack.map((item, idx) => (
                  <div key={idx} style={{
                    padding: '8px 0',
                    textAlign: 'center',
                    borderRadius: '6px',
                    background: idx === stack.length - 1 ? 'rgba(0, 229, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: idx === stack.length - 1 ? '1px solid var(--color-cyan)' : '1px solid var(--border-subtle)',
                    color: idx === stack.length - 1 ? 'var(--color-cyan)' : 'var(--text-primary)',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {item} {idx === stack.length - 1 && '◀ TOP'}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      );
    }

    // 3. LINKED LIST VISUALIZER
    if (subType === 'linked_list') {
      const nodes: number[] = state.nodes || [1, 2, 3, 4, 5];

      return (
        <div style={{ width: '100%', overflowX: 'auto', padding: '10px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', minHeight: '100px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-cyan)' }}>HEAD ➔</span>
            {nodes.map((val, idx) => {
              const isCurr = state.currIdx === idx;
              const isPrev = state.prevIdx === idx;
              return (
                <React.Fragment key={idx}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ height: '20px' }}>
                      {isCurr && <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>curr</span>}
                      {isPrev && <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>prev</span>}
                    </div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isCurr ? 'rgba(0, 229, 255, 0.25)' : 'var(--bg-secondary)',
                      border: isCurr ? '2px solid var(--color-cyan)' : '1px solid var(--border-medium)',
                      color: isCurr ? 'var(--color-cyan)' : 'var(--text-primary)',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1rem',
                      boxShadow: isCurr ? '0 0 14px var(--color-cyan-glow)' : 'none'
                    }}>
                      {val}
                    </div>
                  </div>
                  {idx < nodes.length - 1 && (
                    <ArrowRight size={18} color="var(--color-cyan)" style={{ marginTop: '20px' }} />
                  )}
                </React.Fragment>
              );
            })}
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '20px' }}>➔ NULL</span>
          </div>
        </div>
      );
    }

    // 4. WATER CONTAINER VISUALIZER
    if (subType === 'water') {
      const heights: number[] = state.heights || [1, 8, 6, 2, 5, 4, 8, 3, 7];
      const maxH = Math.max(...heights, 10);
      const l = state.l !== undefined ? state.l : 0;
      const r = state.r !== undefined ? state.r : heights.length - 1;

      return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-cyan)', fontWeight: 700 }}>
            Current Area = {state.currentArea || state.maxArea || 0} | Max Area = {state.maxArea || 0}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px', padding: '0 10px', borderBottom: '2px solid var(--border-medium)' }}>
            {heights.map((h, idx) => {
              const isPointer = idx === l || idx === r;
              const isBetween = idx >= l && idx <= r;
              const barHeight = Math.max(16, (h / maxH) * 120);

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: isPointer ? 'var(--color-cyan)' : 'var(--text-muted)' }}>
                    {idx === l ? 'L' : idx === r ? 'R' : ''}
                  </span>
                  <div style={{
                    width: '28px',
                    height: `${barHeight}px`,
                    background: isPointer ? 'var(--color-cyan)' : isBetween ? 'rgba(0, 229, 255, 0.25)' : 'var(--bg-secondary)',
                    borderRadius: '4px 4px 0 0',
                    border: isPointer ? '1px solid #FFFFFF' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: '2px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: isPointer ? '#000000' : 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {h}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 5. DYNAMIC PROGRAMMING TABLE VISUALIZER
    if (subType === 'dp') {
      const dp: any[] = state.dp || [0, 1, 2, 3, 5];

      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            1D DYNAMIC PROGRAMMING MEMOIZATION TABLE
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {dp.map((val, idx) => {
              const isFilled = val !== null && val !== undefined;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    dp[{idx}]
                  </span>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-mono)',
                    background: isFilled ? 'rgba(139, 92, 246, 0.25)' : 'var(--bg-tertiary)',
                    border: isFilled ? '2px solid var(--color-purple)' : '1px dashed var(--border-subtle)',
                    color: isFilled ? '#c4b5fd' : 'var(--text-muted)'
                  }}>
                    {isFilled ? val : '?'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 6. HEAP VISUALIZER
    if (subType === 'heap') {
      const heap: number[] = state.heap || [10, 20, 15, 30, 40];

      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 700 }}>
            BINARY MIN/MAX HEAP TREE HIERARCHY
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {heap.map((val, idx) => {
              const isRoot = idx === 0;
              const isCur = state.activeIdx === idx;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: isRoot ? 'var(--color-cyan)' : 'var(--text-muted)' }}>
                    {isRoot ? 'ROOT (Min)' : `idx ${idx}`}
                  </span>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: isCur ? 'rgba(0, 229, 255, 0.3)' : isRoot ? 'rgba(16, 185, 129, 0.25)' : 'var(--bg-secondary)',
                    border: isCur ? '2px solid var(--color-cyan)' : isRoot ? '2px solid var(--color-emerald)' : '1px solid var(--border-medium)',
                    color: isCur ? 'var(--color-cyan)' : isRoot ? 'var(--color-emerald)' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    boxShadow: isCur ? '0 0 14px var(--color-cyan-glow)' : 'none'
                  }}>
                    {val}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (subType === 'tree' || subType === 'graph') {
      const nodes: Array<string | number> = state.nodes || ['A', 'B', 'C', 'D'];
      const visited = state.visited || [];
      return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 800 }}>
            {subType === 'tree' ? 'TREE TRAVERSAL STATE' : 'GRAPH TRAVERSAL FRONTIER'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {nodes.map((node, idx) => {
              const active = state.activeIdx === idx;
              const isVisited = visited.includes(node);
              return (
                <React.Fragment key={`${node}-${idx}`}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: subType === 'tree' ? '50%' : '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: active ? 'rgba(0, 229, 255, 0.25)' : isVisited ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-secondary)',
                    border: active ? '2px solid var(--color-cyan)' : isVisited ? '2px solid var(--color-emerald)' : '1px solid var(--border-medium)',
                    color: active ? 'var(--color-cyan)' : isVisited ? 'var(--color-emerald)' : 'var(--text-primary)',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    boxShadow: active ? '0 0 14px var(--color-cyan-glow)' : 'none'
                  }}>
                    {node}
                  </div>
                  {idx < nodes.length - 1 && <ArrowRight size={16} color="var(--text-muted)" />}
                </React.Fragment>
              );
            })}
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            {visited.length ? `Visited: ${visited.join(' → ')}` : 'Traversal starts at the highlighted node'}
          </span>
        </div>
      );
    }

    // 7. DEFAULT ARRAY / TWO POINTERS / BINARY SEARCH RENDERER
    const rawArray: number[] = state.array || state.heights || [2, 7, 11, 15];

    return (
      <div style={{ width: '100%', overflowX: 'auto', padding: '10px 0' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'center', minHeight: '110px', padding: '12px 4px' }}>
          {rawArray.map((val, idx) => {
            const isHighlighted = highlightedIndices.includes(idx);
            const isMatch = state.result && state.result.includes(idx);

            let pointerLabel: string | null = null;
            if (pointers) {
              Object.entries(pointers).forEach(([k, v]) => {
                if (v === idx || v === String(idx)) {
                  pointerLabel = k;
                }
              });
            }

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '48px' }}>
                {/* Pointer Tag */}
                <div style={{ height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {pointerLabel && (
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: String(pointerLabel).includes('R') || String(pointerLabel).includes('High') ? '#f43f5e' : 'var(--color-cyan)',
                      color: '#000000',
                      boxShadow: '0 0 10px rgba(0, 229, 255, 0.6)',
                      whiteSpace: 'nowrap'
                    }}>
                      {pointerLabel}
                    </span>
                  )}
                </div>

                {/* Array Cell */}
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  fontFamily: 'var(--font-mono)',
                  background: isMatch ? 'rgba(16, 185, 129, 0.25)' : isHighlighted ? 'rgba(0, 229, 255, 0.2)' : 'var(--bg-secondary)',
                  border: isMatch ? '2px solid var(--color-emerald)' : isHighlighted ? '2px solid var(--color-cyan)' : '1px solid var(--border-subtle)',
                  color: isMatch ? 'var(--color-emerald)' : isHighlighted ? 'var(--color-cyan)' : 'var(--text-primary)',
                  boxShadow: isMatch ? '0 0 14px rgba(16, 185, 129, 0.4)' : isHighlighted ? '0 0 14px var(--color-cyan-glow)' : 'none',
                  transform: isHighlighted ? 'translateY(-3px)' : 'none',
                  transition: 'all 0.25s ease'
                }}>
                  {val}
                </div>

                {/* Index Label */}
                <span style={{ fontSize: '0.75rem', color: isHighlighted ? 'var(--color-cyan)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: '14px',
      border: '1px solid var(--border-medium)',
      padding: '1.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={20} color="var(--color-cyan)" />
          <strong style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
            {problemTitle || 'Interactive Algorithmic Visualizer'}
          </strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge badge-purple" style={{ fontSize: '0.8rem', padding: '3px 8px' }}>
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
          {currentStep?.complexityNote && (
            <span className="badge badge-cyan" style={{ fontSize: '0.8rem', padding: '3px 8px' }}>
              {currentStep.complexityNote}
            </span>
          )}
        </div>
      </div>

      {/* Main Interactive Visual Canvas */}
      <div style={{
        background: 'var(--bg-primary)',
        padding: '2rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowX: 'auto',
        overflowY: 'visible'
      }}>
        {renderVisualCanvas()}
      </div>

      {/* Step Explanation Callout */}
      <div style={{
        background: 'rgba(0, 229, 255, 0.05)',
        borderLeft: '4px solid var(--color-cyan)',
        padding: '1rem 1.25rem',
        borderRadius: '0 10px 10px 0'
      }}>
        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-cyan)', marginBottom: '4px' }}>
          {currentStep?.label || `Step ${currentStepIndex + 1}`}
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          {currentStep?.explanation || 'Executing algorithmic state transition.'}
        </div>
      </div>

      {/* Playback Controls Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        {/* Step Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handleRestart} className="btn btn-secondary btn-sm" title="Restart to Step 1">
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={handlePrev} disabled={currentStepIndex === 0} className="btn btn-secondary btn-sm" title="Previous Step">
            <SkipBack size={14} /> Prev
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn btn-primary btn-sm"
            style={{ minWidth: '95px', fontWeight: 800 }}
          >
            {isPlaying ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Play</>}
          </button>
          <button onClick={handleNext} disabled={currentStepIndex === totalSteps - 1} className="btn btn-secondary btn-sm" title="Next Step">
            Next <SkipForward size={14} />
          </button>
        </div>

        {/* Interactive Timeline Scrubber */}
        <div style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="range"
            min="0"
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={e => setCurrentStepIndex(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-cyan)', cursor: 'pointer' }}
            aria-label="Algorithm timeline step scrubber"
          />
        </div>

        {/* Speed Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Speed:</span>
          {[0.5, 1, 2].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`btn btn-sm ${speed === s ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800 }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
