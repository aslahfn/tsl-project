'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import TeamLogo from '@/components/ui/TeamLogo';
import PageHeader from '@/components/ui/PageHeader';
import { useRealTime } from '@/hooks/useRealTime';

function FormBadge({ result }: { result: 'W' | 'D' | 'L' }) {
  const colors = { W: '#22c55e', D: '#eab308', L: '#ef4444' };
  return (
    <div style={{
      width: 22, height: 22, borderRadius: 4,
      background: `${colors[result]}22`, border: `1px solid ${colors[result]}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.65rem', fontWeight: 700, color: colors[result],
    }}>{result}</div>
  );
}

export default function StandingsPageClient({ standings }: { standings: any[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const data = standings;

  useRealTime();

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <PageHeader
        badge="🏆 Season 08"
        title="League"
        titleHighlight="Standings"
        description="Full table for Super League Season 08"
      />

      <div className="container-wide" style={{ paddingBottom: '6rem' }}>
        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}
        >
          {[
            { color: '#FFD700', label: 'Championship Leader' },
            { color: '#FFD700', label: 'Top 4 (Playoff)' },
            { color: '#ef4444', label: 'Relegation Zone' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color }} />
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,215,0,0.12)',
            borderRadius: 16, overflowX: 'auto',
          }}
          className="hide-scrollbar"
        >
          <div style={{ minWidth: '850px' }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2.5rem 2.5rem 1fr 2.5rem 2.5rem 2.5rem 2.5rem 3rem 3rem 3rem 3.5rem 7rem',
            gap: '0.5rem', padding: '1rem 1.25rem',
            background: 'rgba(255,215,0,0.04)',
            borderBottom: '1px solid rgba(255,215,0,0.1)',
            color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            <span></span><span>#</span><span>Club</span>
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

          {data.map((s, i) => {
            const teamName = s.team?.name || s.teamName;
            const teamShort = s.team?.shortName || s.teamShort;
            const formArray = typeof s.form === 'string' ? (s.form ? s.form.split(',') : []) : (s.form || []);

            return (
              <motion.div
                key={s.teamId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                onMouseEnter={() => setHovered(s.teamId)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2.5rem 2.5rem 1fr 2.5rem 2.5rem 2.5rem 2.5rem 3rem 3rem 3rem 3.5rem 7rem',
                  gap: '0.5rem', padding: '1rem 1.25rem',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  alignItems: 'center',
                  background: hovered === s.teamId ? 'rgba(255,215,0,0.04)' : 'transparent',
                  transition: 'background 0.2s ease',
                  borderLeft: `3px solid ${i < 4 ? '#FFD700' : '#ef4444'}`,
                  cursor: 'default',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {s.positionChange === 'UP' ? <TrendingUp size={12} color="#22c55e" /> :
                    s.positionChange === 'DOWN' ? <TrendingDown size={12} color="#ef4444" /> :
                      <Minus size={12} color="#6b7280" />}
                </div>
                <div className="font-display" style={{ fontSize: '1.2rem', textAlign: 'center', color: i === 0 ? '#FFD700' : i < 4 ? '#FFD700' : 'rgba(255,255,255,0.6)' }}>{s.position}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                  <TeamLogo name={teamShort} logo={s.team?.logo} size={34} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.40rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{teamName}</span>
                      <span style={{
                        padding: '1px 5px',
                        borderRadius: '4px',
                        fontSize: '0.55rem',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        background: i < 4 ? 'rgba(0, 255, 135, 0.1)' : 'rgba(255, 59, 59, 0.1)',
                        border: i < 4 ? '1px solid rgba(0, 255, 135, 0.25)' : '1px solid rgba(255, 59, 59, 0.25)',
                        color: i < 4 ? '#00FF87' : '#FF3B3B',
                        textTransform: 'uppercase'
                      }}>
                        {i < 4 ? 'Qualified' : 'Not Qualified'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Est. {s.team?.founded || 2020}</div>
                  </div>
                </div>
                {[s.played, s.won, s.drawn, s.lost, s.goalsFor, s.goalsAgainst, s.goalDifference].map((val, j) => (
                  <div key={j} style={{
                    textAlign: 'center', fontSize: '0.9rem',
                    color: j === 6 ? (val > 0 ? '#22c55e' : val < 0 ? '#ef4444' : 'rgba(255,255,255,0.5)') : 'rgba(255,255,255,0.75)',
                    fontWeight: j === 6 ? 600 : 400,
                  }}>
                    {val > 0 && j === 6 ? `+${val}` : val}
                  </div>
                ))}
                <div className="font-display" style={{ fontSize: '1.4rem', textAlign: 'center', color: i === 0 ? '#FFD700' : '#fff' }}>{s.points}</div>
                <div style={{ display: 'flex', gap: '0.2rem', justifyContent: 'flex-end' }}>
                  {formArray.map((r: any, j: number) => <FormBadge key={j} result={r as any} />)}
                </div>
              </motion.div>
            );
          })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
