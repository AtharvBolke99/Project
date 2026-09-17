import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Shuffle, 
  Sparkles, 
  SkipForward, 
  SkipBack, 
  Cpu, 
  Layers, 
  ArrowRightLeft,
  Sliders,
  CheckCircle2,
  TrendingUp,
  Activity,
  GitBranch,
  Database
} from 'lucide-react';

type AlgorithmType = 
  | 'bubble' 
  | 'selection' 
  | 'binary' 
  | 'two_pointers' 
  | 'sliding_window' 
  | 'kadane' 
  | 'prefix_sum' 
  | 'stack' 
  | 'queue'
  | 'tree_traversal'
  | 'graph_bfs';

export const VisualLab: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('bubble');
  const [arrayInput, setArrayInput] = useState('5, 2, 8, 1, 4');
  const [array, setArray] = useState<number[]>([5, 2, 8, 1, 4]);
  const [target, setTarget] = useState(8);

  // Stepping State
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const generateRandomArray = () => {
    const newArr = Array.from({ length: 6 }, () => Math.floor(Math.random() * 50) + 1);
    setArray(newArr);
    setArrayInput(newArr.join(', '));
    buildAlgorithmSteps(algorithm, newArr);
  };

  const handleCustomArrayApply = () => {
    try {
      const parsed = arrayInput.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
      if (parsed.length > 0) {
        setArray(parsed);
        buildAlgorithmSteps(algorithm, parsed);
      }
    } catch (e) {}
  };

  // Build step sequence for selected algorithm
  const buildAlgorithmSteps = (algo: AlgorithmType, arr: number[]) => {
    const stepList: any[] = [];
    const copy = [...arr];

    if (algo === 'bubble') {
      stepList.push({
        array: [...copy],
        comparing: [],
        swapping: [],
        sorted: [],
        text: 'Initial Array state for Bubble Sort. Comparing adjacent elements.'
      });

      for (let i = 0; i < copy.length; i++) {
        for (let j = 0; j < copy.length - i - 1; j++) {
          stepList.push({
            array: [...copy],
            comparing: [j, j + 1],
            swapping: [],
            sorted: Array.from({ length: i }, (_, idx) => copy.length - 1 - idx),
            text: `Comparing index ${j} (${copy[j]}) with index ${j + 1} (${copy[j + 1]}).`
          });

          if (copy[j] > copy[j + 1]) {
            const temp = copy[j];
            copy[j] = copy[j + 1];
            copy[j + 1] = temp;

            stepList.push({
              array: [...copy],
              comparing: [j, j + 1],
              swapping: [j, j + 1],
              sorted: Array.from({ length: i }, (_, idx) => copy.length - 1 - idx),
              text: `Swapped! ${copy[j + 1]} > ${copy[j]}.`
            });
          }
        }
      }

      stepList.push({
        array: [...copy],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: copy.length }, (_, i) => i),
        text: '✨ Sorting complete! Array is fully sorted in non-decreasing order.'
      });
    } else if (algo === 'selection') {
      stepList.push({
        array: [...copy],
        comparing: [],
        minIdx: null,
        sorted: [],
        text: 'Initial Array state for Selection Sort.'
      });

      for (let i = 0; i < copy.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < copy.length; j++) {
          stepList.push({
            array: [...copy],
            comparing: [minIdx, j],
            minIdx,
            sorted: Array.from({ length: i }, (_, idx) => idx),
            text: `Looking for minimum element in remaining subarray. Current min: ${copy[minIdx]}.`
          });

          if (copy[j] < copy[minIdx]) {
            minIdx = j;
          }
        }

        if (minIdx !== i) {
          const tmp = copy[i];
          copy[i] = copy[minIdx];
          copy[minIdx] = tmp;
        }

        stepList.push({
          array: [...copy],
          comparing: [],
          minIdx: null,
          sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
          text: `Placed minimum element ${copy[i]} at sorted index ${i}.`
        });
      }
    } else if (algo === 'binary') {
      const sortedArr = [...copy].sort((a, b) => a - b);
      let left = 0, right = sortedArr.length - 1;
      const tgt = target;

      stepList.push({
        array: [...sortedArr],
        left,
        right,
        mid: Math.floor((left + right) / 2),
        text: `Array sorted for Binary Search. Target = ${tgt}. Initial range: [0, ${right}].`
      });

      let found = false;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        stepList.push({
          array: [...sortedArr],
          left,
          right,
          mid,
          text: `Checking mid index ${mid} (value: ${sortedArr[mid]}). Target is ${tgt}.`
        });

        if (sortedArr[mid] === tgt) {
          found = true;
          stepList.push({
            array: [...sortedArr],
            left,
            right,
            mid,
            found: true,
            text: `🎯 Target ${tgt} found at index ${mid}!`
          });
          break;
        } else if (sortedArr[mid] < tgt) {
          left = mid + 1;
          stepList.push({
            array: [...sortedArr],
            left,
            right,
            mid,
            text: `${sortedArr[mid]} < ${tgt}. Discard left half. Move Left to index ${left}.`
          });
        } else {
          right = mid - 1;
          stepList.push({
            array: [...sortedArr],
            left,
            right,
            mid,
            text: `${sortedArr[mid]} > ${tgt}. Discard right half. Move Right to index ${right}.`
          });
        }
      }

      if (!found) {
        stepList.push({
          array: [...sortedArr],
          left,
          right,
          mid: -1,
          text: `Target ${tgt} is not present in the array.`
        });
      }
    } else if (algo === 'two_pointers') {
      let l = 0, r = copy.length - 1;
      stepList.push({
        array: [...copy],
        left: l,
        right: r,
        text: `Initialize two pointers: Left = 0 (val ${copy[l]}), Right = ${r} (val ${copy[r]}).`
      });

      while (l < r) {
        stepList.push({
          array: [...copy],
          left: l,
          right: r,
          text: `Evaluating pair at L=${l} (${copy[l]}) and R=${r} (${copy[r]}). Pointers converging inward.`
        });
        l++;
        r--;
      }

      stepList.push({
        array: [...copy],
        left: l,
        right: r,
        text: `Pointers converged at index ${l}. Two Pointer traversal complete in O(N) time.`
      });
    } else if (algo === 'kadane') {
      let cur = copy[0], maxS = copy[0];
      stepList.push({
        array: [...copy],
        currentSum: cur,
        maxSum: maxS,
        activeIdx: 0,
        text: `Kadane Initialization: currentSum = ${cur}, maxSum = ${maxS} at index 0.`
      });

      for (let i = 1; i < copy.length; i++) {
        const val = copy[i];
        const extended = cur + val;
        cur = Math.max(val, extended);
        maxS = Math.max(maxS, cur);

        stepList.push({
          array: [...copy],
          currentSum: cur,
          maxSum: maxS,
          activeIdx: i,
          text: extended > val 
            ? `Index ${i} (${val}): Extended existing subarray. currentSum = ${cur}, maxSum = ${maxS}.`
            : `Index ${i} (${val}): Restarted subarray at ${val}. currentSum = ${cur}, maxSum = ${maxS}.`
        });
      }

      stepList.push({
        array: [...copy],
        currentSum: cur,
        maxSum: maxS,
        activeIdx: null,
        text: `✨ Kadane completed! Maximum contiguous subarray sum is ${maxS}.`
      });
    } else if (algo === 'sliding_window') {
      stepList.push({
        array: [...copy],
        wStart: 0,
        wEnd: 0,
        text: 'Initialize sliding window: [0..0]. Expanding right edge.'
      });

      for (let r = 1; r < copy.length; r++) {
        stepList.push({
          array: [...copy],
          wStart: 0,
          wEnd: r,
          text: `Window expanded to [0..${r}] containing elements ${copy.slice(0, r + 1).join(', ')}.`
        });
      }

      stepList.push({
        array: [...copy],
        wStart: 0,
        wEnd: copy.length - 1,
        text: 'Sliding window completed with optimal sub-range identified.'
      });
    } else if (algo === 'prefix_sum') {
      const prefix: number[] = [];
      let s = 0;
      stepList.push({
        array: [...copy],
        prefix: [],
        text: 'Prefix Sum accumulator initialized to 0.'
      });

      for (let i = 0; i < copy.length; i++) {
        s += copy[i];
        prefix.push(s);
        stepList.push({
          array: [...copy],
          prefix: [...prefix],
          activeIdx: i,
          text: `prefix[${i}] = ${prefix.length > 1 ? prefix[i - 1] : 0} + ${copy[i]} = ${s}.`
        });
      }

      stepList.push({
        array: [...copy],
        prefix: [...prefix],
        activeIdx: null,
        text: '✨ Prefix sum table constructed in O(N). Any sub-range sum can now be queried in O(1).'
      });
    } else if (algo === 'stack') {
      const st: number[] = [];
      stepList.push({
        stack: [],
        text: 'Empty LIFO Stack initialized.'
      });

      for (const val of copy) {
        st.push(val);
        stepList.push({
          stack: [...st],
          action: 'push',
          val,
          text: `Pushed ${val} onto top of stack.`
        });
      }

      if (st.length > 0) {
        const popped = st.pop();
        stepList.push({
          stack: [...st],
          action: 'pop',
          val: popped,
          text: `Popped ${popped} from top of stack.`
        });
      }
    } else if (algo === 'queue') {
      const q: number[] = [];
      stepList.push({
        queue: [],
        text: 'Empty FIFO Queue initialized.'
      });

      for (const val of copy) {
        q.push(val);
        stepList.push({
          queue: [...q],
          action: 'enqueue',
          val,
          text: `Enqueued ${val} at rear of queue.`
        });
      }

      if (q.length > 0) {
        const dequeued = q.shift();
        stepList.push({
          queue: [...q],
          action: 'dequeue',
          val: dequeued,
          text: `Dequeued ${dequeued} from front of queue.`
        });
      }
    } else if (algo === 'tree_traversal') {
      const treeNodes = [4, 2, 6, 1, 3, 5, 7];
      stepList.push({
        treeNodes,
        visited: [],
        activeNode: null,
        text: 'Binary Search Tree initialized with root = 4. Starting Inorder Traversal (Left -> Root -> Right).'
      });

      const inorder = [1, 2, 3, 4, 5, 6, 7];
      for (let i = 0; i < inorder.length; i++) {
        stepList.push({
          treeNodes,
          visited: inorder.slice(0, i + 1),
          activeNode: inorder[i],
          text: `Visited Node(${inorder[i]}). Inorder traversal yields sorted values.`
        });
      }
    } else if (algo === 'graph_bfs') {
      const graphNodes = ['A', 'B', 'C', 'D', 'E'];
      stepList.push({
        graphNodes,
        bfsQueue: ['A'],
        visited: [],
        activeNode: 'A',
        text: 'BFS Graph Traversal starting from source node A.'
      });

      const order = ['A', 'B', 'C', 'D', 'E'];
      for (let i = 0; i < order.length; i++) {
        stepList.push({
          graphNodes,
          bfsQueue: order.slice(i + 1),
          visited: order.slice(0, i + 1),
          activeNode: order[i],
          text: `De-queued ${order[i]}, exploring unvisited neighbors.`
        });
      }
    }

    setSteps(stepList);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    buildAlgorithmSteps(algorithm, array);
  }, [algorithm, target]);

  // Stepping timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1500 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, steps.length]);

  const stepData = steps[currentStep] || {};

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 'var(--radius-full)', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', boxShadow: '0 2px 6px rgba(79, 70, 229, 0.08)' }}>
          <Sparkles size={16} />
          <span>Interactive Visual Computing Lab</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          DSA Algorithm Visual Lab
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '1rem' }}>
          Step through fundamental algorithms in real-time. Scrub timelines, modify inputs, and observe data structure invariants.
        </p>
      </div>

      {/* Algorithm Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '2rem', scrollbarWidth: 'none' }}>
        {[
          { id: 'bubble', label: 'Bubble Sort', cat: 'Sorting' },
          { id: 'selection', label: 'Selection Sort', cat: 'Sorting' },
          { id: 'binary', label: 'Binary Search', cat: 'Searching' },
          { id: 'two_pointers', label: 'Two Pointers', cat: 'Pointers' },
          { id: 'sliding_window', label: 'Sliding Window', cat: 'Window' },
          { id: 'kadane', label: 'Kadane’s Algorithm', cat: 'DP' },
          { id: 'prefix_sum', label: 'Prefix Sum', cat: 'Array' },
          { id: 'stack', label: 'Stack (LIFO)', cat: 'Linear' },
          { id: 'queue', label: 'Queue (FIFO)', cat: 'Linear' },
          { id: 'tree_traversal', label: 'Tree Inorder', cat: 'Trees' },
          { id: 'graph_bfs', label: 'Graph BFS', cat: 'Graphs' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setAlgorithm(tab.id as AlgorithmType)}
            className={`btn ${algorithm === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.875rem', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input Controls Bar */}
      <div className="card glass-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Input Array:</span>
            <input
              type="text"
              value={arrayInput}
              onChange={e => setArrayInput(e.target.value)}
              placeholder="e.g. 5, 2, 8, 1, 4"
              className="input"
              style={{ flex: 1, padding: '8px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
            />
            <button onClick={handleCustomArrayApply} className="btn btn-secondary btn-sm">Apply</button>
          </div>

          {algorithm === 'binary' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Target:</span>
              <input
                type="number"
                value={target}
                onChange={e => setTarget(Number(e.target.value))}
                style={{ width: '70px', padding: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }}
              />
            </div>
          )}

          <button onClick={generateRandomArray} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shuffle size={14} />
            <span>Randomize</span>
          </button>
        </div>
      </div>

      {/* Visual Canvas Stage */}
      <div className="card glass-card" style={{ padding: '2.5rem 1.5rem', minHeight: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Render for Array Based Algos */}
        {stepData.array && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end', minHeight: '120px' }}>
            {stepData.array.map((val: number, idx: number) => {
              const isComparing = stepData.comparing?.includes(idx);
              const isSwapping = stepData.swapping?.includes(idx);
              const isSorted = stepData.sorted?.includes(idx);
              const isMid = stepData.mid === idx;
              const isFound = stepData.found && isMid;
              const isLeft = stepData.left === idx;
              const isRight = stepData.right === idx;
              const isActive = stepData.activeIdx === idx;

              let borderColor = 'var(--border-medium)';
              let bgColor = 'var(--bg-tertiary)';
              let textColor = 'var(--text-primary)';

              if (isFound) {
                borderColor = '#10b981';
                bgColor = 'rgba(16, 185, 129, 0.3)';
                textColor = '#34d399';
              } else if (isSwapping) {
                borderColor = '#f43f5e';
                bgColor = 'rgba(244, 63, 94, 0.25)';
                textColor = '#fb7185';
              } else if (isComparing || isMid || isActive) {
                borderColor = 'var(--color-cyan)';
                bgColor = 'rgba(0, 229, 255, 0.25)';
                textColor = 'var(--color-cyan)';
              } else if (isSorted) {
                borderColor = '#10b981';
                bgColor = 'rgba(16, 185, 129, 0.15)';
                textColor = '#10b981';
              }

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ height: '20px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-cyan)' }}>
                    {isLeft && isRight ? 'L,R' : isLeft ? 'L' : isRight ? 'R' : isMid ? 'MID' : ''}
                  </div>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '10px',
                      border: `2px solid ${borderColor}`,
                      background: bgColor,
                      color: textColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: (isComparing || isSwapping || isFound) ? 'translateY(-4px)' : 'none',
                      boxShadow: (isComparing || isFound) ? '0 0 16px rgba(0, 229, 255, 0.3)' : 'none'
                    }}
                  >
                    {val}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>[{idx}]</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Render for Stack */}
        {stepData.stack !== undefined && (
          <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '8px', width: '180px', borderBottom: '3px solid var(--color-cyan)', borderLeft: '3px solid var(--border-medium)', borderRight: '3px solid var(--border-medium)', padding: '8px', minHeight: '140px', alignItems: 'center', justifyContent: 'flex-start' }}>
            {stepData.stack.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 'auto 0' }}>[ Empty Stack ]</div>
            ) : (
              stepData.stack.map((val: number, i: number) => (
                <div key={i} style={{ width: '100%', padding: '10px', background: 'rgba(0, 229, 255, 0.15)', border: '1px solid var(--color-cyan)', borderRadius: '6px', textAlign: 'center', fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {val} {i === stepData.stack.length - 1 ? '← TOP' : ''}
                </div>
              ))
            )}
          </div>
        )}

        {/* Render for Queue */}
        {stepData.queue !== undefined && (
          <div style={{ display: 'flex', gap: '8px', borderTop: '3px solid var(--color-purple)', borderBottom: '3px solid var(--color-purple)', padding: '12px 16px', minWidth: '240px', justifyContent: 'center' }}>
            <span style={{ alignSelf: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '8px' }}>FRONT →</span>
            {stepData.queue.map((val: number, i: number) => (
              <div key={i} style={{ width: '48px', height: '48px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid var(--color-purple)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                {val}
              </div>
            ))}
            <span style={{ alignSelf: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>← REAR</span>
          </div>
        )}

        {/* Render for Tree */}
        {stepData.treeNodes !== undefined && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {stepData.treeNodes.map((n: number) => {
                const isVisited = stepData.visited?.includes(n);
                const isActive = stepData.activeNode === n;
                return (
                  <div key={n} style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    background: isActive ? 'rgba(0, 229, 255, 0.3)' : isVisited ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-secondary)',
                    border: isActive ? '2px solid var(--color-cyan)' : isVisited ? '2px solid var(--color-emerald)' : '1px solid var(--border-subtle)',
                    color: isActive ? 'var(--color-cyan)' : isVisited ? 'var(--color-emerald)' : 'var(--text-primary)',
                    boxShadow: isActive ? '0 0 14px var(--color-cyan-glow)' : 'none'
                  }}>
                    {n}
                  </div>
                );
              })}
            </div>
            {stepData.visited?.length > 0 && (
              <div style={{ fontSize: '0.85rem', color: 'var(--color-emerald)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                Inorder Sequence: [ {stepData.visited.join(', ')} ]
              </div>
            )}
          </div>
        )}

        {/* Render for Graph */}
        {stepData.graphNodes !== undefined && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              {stepData.graphNodes.map((node: string) => {
                const isVis = stepData.visited?.includes(node);
                const isAct = stepData.activeNode === node;
                return (
                  <div key={node} style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    background: isAct ? 'rgba(0, 229, 255, 0.3)' : isVis ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-secondary)',
                    border: isAct ? '2px solid var(--color-cyan)' : isVis ? '2px solid var(--color-emerald)' : '1px solid var(--border-subtle)',
                    color: isAct ? 'var(--color-cyan)' : isVis ? 'var(--color-emerald)' : 'var(--text-primary)'
                  }}>
                    {node}
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
              BFS Queue: [ {stepData.bfsQueue?.join(', ') || 'Empty'} ]
            </div>
          </div>
        )}

        {/* Metric Badges */}
        {(stepData.currentSum !== undefined || stepData.maxSum !== undefined) && (
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
            <span style={{ padding: '6px 14px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid var(--color-blue)', borderRadius: '8px', color: '#60a5fa', fontWeight: 700 }}>
              currentSum: {stepData.currentSum}
            </span>
            <span style={{ padding: '6px 14px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--color-emerald)', borderRadius: '8px', color: '#34d399', fontWeight: 700 }}>
              maxSum: {stepData.maxSum}
            </span>
          </div>
        )}
      </div>

      {/* Explanation Banner */}
      <div style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)' }}>
        <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9375rem', margin: 0, lineHeight: 1.5 }}>
          {stepData.text || 'Step through the algorithm to observe state transformations.'}
        </p>
      </div>

      {/* Playback Controls Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', flexWrap: 'wrap', gap: '16px', background: 'var(--bg-secondary)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-medium)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setCurrentStep(0)} className="btn-icon" title="Restart">
            <RotateCcw size={18} />
          </button>
          <button onClick={() => setCurrentStep(p => Math.max(0, p - 1))} disabled={currentStep === 0} className="btn-icon" title="Previous Step">
            <SkipBack size={18} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn btn-primary"
            style={{ padding: '8px 20px', fontWeight: 700 }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button onClick={() => setCurrentStep(p => Math.min(steps.length - 1, p + 1))} disabled={currentStep >= steps.length - 1} className="btn-icon" title="Next Step">
            <SkipForward size={18} />
          </button>
        </div>

        <div style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Step {currentStep + 1} / {Math.max(1, steps.length)}
          </span>
          <input
            type="range"
            min="0"
            max={Math.max(0, steps.length - 1)}
            value={currentStep}
            onChange={e => setCurrentStep(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          {[0.5, 1, 1.5, 2].map(spd => (
            <button
              key={spd}
              onClick={() => setSpeed(spd)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                background: speed === spd ? 'var(--color-primary)' : 'transparent',
                color: speed === spd ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
