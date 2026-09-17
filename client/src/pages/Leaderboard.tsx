import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  Flame, 
  Code2, 
  BrainCircuit, 
  Sparkles, 
  Crown,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { SkeletonLoader } from '../components/SkeletonLoader';

export const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<'global' | 'weekly' | 'monthly'>('global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/user/leaderboard?type=${timeframe}`);
        if (res.success && res.data) {
          setLeaderboard(res.data);
        }
      } catch (e) {
        console.error('Failed to load leaderboard:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [timeframe]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown size={20} color="#F59E0B" />;
    if (rank === 2) return <Medal size={20} color="#94A3B8" />;
    if (rank === 3) return <Medal size={20} color="#B45309" />;
    return <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>#{rank}</span>;
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container" style={{ paddingTop: '2rem', maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(0, 229, 255, 0.1)',
            color: 'var(--color-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <Trophy size={28} />
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Global Engineering Leaderboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Climb the ranks by solving daily challenges, acing aptitude tests, and maintaining daily streaks.
          </p>
        </div>

        {/* Timeframe Filter Tabs */}
        <div className="tabs-header" style={{ justifyContent: 'center', marginBottom: '2rem', border: 'none' }}>
          {(['global', 'weekly', 'monthly'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`tab-btn ${timeframe === tf ? 'active' : ''}`}
              style={{ textTransform: 'capitalize', fontSize: '0.9375rem', padding: '8px 20px' }}
            >
              {tf} Rankings
            </button>
          ))}
        </div>

        {/* Top 3 Podiums */}
        {!loading && leaderboard.length >= 3 && (
          <div className="leaderboard-podium-grid" style={{ marginBottom: '2.5rem', alignItems: 'flex-end' }}>
            {/* Rank 2 */}
            <div className="card glass-card" style={{ textAlign: 'center', padding: '1.5rem', height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Medal size={28} color="#94A3B8" style={{ margin: '0 auto 6px auto' }} />
              <img src={leaderboard[1].avatar} alt={leaderboard[1].name} style={{ width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 8px auto' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{leaderboard[1].name}</div>
              <div style={{ color: 'var(--color-cyan)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{leaderboard[1].xp} XP</div>
            </div>

            {/* Rank 1 (Tallest) */}
            <div className="card glass-card glowing-border" style={{ textAlign: 'center', padding: '1.75rem', height: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(180deg, rgba(0, 229, 255, 0.1) 0%, var(--bg-card) 100%)' }}>
              <Crown size={36} color="#F59E0B" style={{ margin: '0 auto 6px auto' }} />
              <img src={leaderboard[0].avatar} alt={leaderboard[0].name} style={{ width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 8px auto', border: '2px solid var(--color-cyan)' }} />
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{leaderboard[0].name}</div>
              <div style={{ color: 'var(--color-cyan)', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>{leaderboard[0].xp} XP</div>
              <span className="badge badge-purple" style={{ margin: '6px auto 0 auto' }}>#1 Champion</span>
            </div>

            {/* Rank 3 */}
            <div className="card glass-card" style={{ textAlign: 'center', padding: '1.5rem', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Medal size={28} color="#B45309" style={{ margin: '0 auto 6px auto' }} />
              <img src={leaderboard[2].avatar} alt={leaderboard[2].name} style={{ width: '44px', height: '44px', borderRadius: '50%', margin: '0 auto 8px auto' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{leaderboard[2].name}</div>
              <div style={{ color: 'var(--color-cyan)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{leaderboard[2].xp} XP</div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="data-table-wrapper">
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <SkeletonLoader rows={6} height="48px" />
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px', textAlign: 'center' }}>Rank</th>
                  <th>Student</th>
                  <th>Badges</th>
                  <th style={{ textAlign: 'center' }}>Streak</th>
                  <th style={{ textAlign: 'center' }}>DSA Solved</th>
                  <th style={{ textAlign: 'right' }}>Total XP</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map(item => (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center' }}>
                      {getRankBadge(item.rank)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={item.avatar} alt={item.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                        <div>
                          <strong style={{ color: 'var(--text-primary)' }}>{item.name}</strong>
                          {item.role === 'ADMIN' && (
                            <span className="badge badge-purple" style={{ marginLeft: '6px', fontSize: '0.6rem' }}>Admin</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {item.badges?.slice(0, 2).map((b: string) => (
                          <span key={b} className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{b}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-amber)', fontWeight: 700 }}>
                        <Flame size={14} /> {item.streak}d
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                      {item.problemsSolved}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                      {item.xp} XP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
