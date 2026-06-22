'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import TeamLogo from '@/components/ui/TeamLogo';
import { useRealTime } from '@/hooks/useRealTime';

function FormBadge({ result }: { result: 'W' | 'D' | 'L' }) {
  const colors = { W: '#22c55e', D: '#eab308', L: '#ef4444' };
  return (
    <div style={{
      width: 20, height: 20, borderRadius: 3,
      background: `${colors[result]}22`,
      border: `1px solid ${colors[result]}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.6rem', fontWeight: 700, color: colors[result],
    }}>
      {result}
    </div>
  );
}

function PositionIndicator({ change }: { change: 'UP' | 'DOWN' | 'SAME' }) {
  if (change === 'UP') return <TrendingUp size={12} color="#22c55e" />;
  if (change === 'DOWN') return <TrendingDown size={12} color="#ef4444" />;
  return <Minus size={12} color="#6b7280" />;
}

const cols = [
  { key: 'P', label: 'P' },
  { key: 'W', label: 'W' },
  { key: 'D', label: 'D' },
  { key: 'L', label: 'L' },
  { key: 'GF', label: 'GF' },
  { key: 'GA', label: 'GA' },
  { key: 'GD', label: 'GD' },
  { key: 'PTS', label: 'Pts' },
];

export default function StandingsSection({ standings }: { standings: any[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const data = standings;

  useRealTime();

  return (
    <section className="section-padding" style={{ background: 'var(--bg-primary)' }} id="standings">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <div className="section-badge">🏆 Season 2025–26</div>
            <h2 className="section-title">League<br /><span className="gradient-text">Standings</span></h2>
          </div>
          <Link href="/standings" className="btn-secondary">
            Full Table <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ overflowX: 'auto' }}
          className="hide-scrollbar"
        >
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-gold)',
            borderRadius: 12,
            overflow: 'hidden',
            minWidth: '700px',
          }}>
            {/* Header row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2.5rem 2.5rem 1fr 2.5rem 2.5rem 2.5rem 2.5rem 3rem 3rem 3rem 3.5rem 6rem',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              color: 'var(--text-muted)',
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              <span></span>
              <span>#</span>
              <span>Club</span>
              <span style={{ textAlign: 'center' }}>P</span>
              <span style={{ textAlign: 'center' }}>W</span>
              <span style={{ textAlign: 'center' }}>D</span>
              <span style={{ textAlign: 'center' }}>L</span>
              <span style={{ textAlign: 'center' }}>GF</span>
              <span style={{ textAlign: 'center' }}>GA</span>
              <span style={{ textAlign: 'center' }}>GD</span>
              <span style={{ textAlign: 'center' }}>Pts</span>
              <span>Form</span>
            </div>

            {/* Standing rows */}
            {data.map((s, i) => {
              const isTop3 = i < 3;
              const isLeader = i === 0;
              const teamName = s.team?.name || s.teamName;
              const teamShort = s.team?.shortName || s.teamShort;
              const formArray = typeof s.form === 'string' ? (s.form ? s.form.split(',') : []) : (s.form || []);

              return (
                <motion.div
                  key={s.teamId}
                  id={`standing-row-${s.teamId}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  onMouseEnter={() => setHovered(s.teamId)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2.5rem 2.5rem 1fr 2.5rem 2.5rem 2.5rem 2.5rem 3rem 3rem 3rem 3.5rem 6rem',
                    gap: '0.5rem',
                    padding: '0.875rem 1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    alignItems: 'center',
                    background: hovered === s.teamId ? 'var(--bg-card-hover)' : 'transparent',
                    transition: 'background 0.2s ease',
                    cursor: 'pointer',
                    borderLeft: i < 4 ? (isLeader ? '3px solid var(--gold)' : '3px solid rgba(212,175,55,0.4)') : '3px solid #ef4444',
                  }}
                >
                  {/* Change indicator */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <PositionIndicator change={s.positionChange} />
                  </div>

                  {/* Position */}
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '1.1rem',
                    color: isLeader ? 'var(--gold)' : isTop3 ? 'var(--gold)' : 'rgba(255,255,255,0.6)',
                    textAlign: 'center',
                  }}>
                    {s.position}
                  </div>

                  {/* Team */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                    <TeamLogo name={teamShort} logo={s.team?.logo} size={32} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.875rem', fontWeight: 600, color: '#fff',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {teamName}
                      </span>
                      <span style={{
                        padding: '1px 4px',
                        borderRadius: '3px',
                        fontSize: '0.5rem',
                        fontWeight: 750,
                        letterSpacing: '0.05em',
                        background: i < 4 ? 'rgba(0, 255, 135, 0.1)' : 'rgba(255, 59, 59, 0.1)',
                        border: i < 4 ? '1px solid rgba(0, 255, 135, 0.25)' : '1px solid rgba(255, 59, 59, 0.25)',
                        color: i < 4 ? '#00FF87' : '#FF3B3B',
                        textTransform: 'uppercase'
                      }}>
                        {i < 4 ? 'Qual' : 'NQ'}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  {[s.played, s.won, s.drawn, s.lost, s.goalsFor, s.goalsAgainst, s.goalDifference].map((val, j) => (
                    <div key={j} style={{
                      textAlign: 'center', fontSize: '0.875rem',
                      color: j === 6 ? (val > 0 ? '#22c55e' : val < 0 ? '#ef4444' : 'rgba(255,255,255,0.5)') : 'rgba(255,255,255,0.7)',
                      fontWeight: j === 6 ? 600 : 400,
                    }}>
                      {val > 0 && j === 6 ? `+${val}` : val}
                    </div>
                  ))}

                  {/* Points */}
                  <div style={{
                    textAlign: 'center',
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '1.3rem',
                    color: isLeader ? 'var(--gold)' : '#fff',
                  }}>
                    {s.points}
                  </div>

                  {/* Form */}
                  <div style={{ display: 'flex', gap: '0.2rem', justifyContent: 'flex-end' }}>
                    {formArray.map((r: any, j: number) => <FormBadge key={j} result={r as any} />)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
