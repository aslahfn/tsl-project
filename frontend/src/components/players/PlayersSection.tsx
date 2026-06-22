'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Target, Zap } from 'lucide-react';
import TeamLogo from '@/components/ui/TeamLogo';

interface Team {
  id: string;
  shortName: string;
  name: string;
}

interface Player {
  id: string;
  name: string;
  position: string;
  goals: number;
  assists: number;
  team: Team;
}

function PlayerRow({ player, rank, value, label, maxValue }: {
  player: Player;
  rank: number;
  value: number;
  label: string;
  maxValue: number;
}) {
  const percent = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: rank * 0.07 }}
      style={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '0.875rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Rank */}
      <div className="font-display" style={{
        width: 28, textAlign: 'center', fontSize: '1.2rem', flexShrink: 0,
        color: rank === 1 ? 'var(--gold)' : rank === 2 ? '#E5D5B3' : rank === 3 ? '#AA820A' : 'rgba(255,255,255,0.3)',
      }}>
        {rank}
      </div>

      {/* Team logo */}
      <TeamLogo name={player.team.shortName} size={36} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
          {player.position} · {player.team.name}
        </div>
        {/* Bar */}
        <div style={{ marginTop: '0.4rem', height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${percent}%` }}
            viewport={{ once: true }}
            transition={{ delay: rank * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: label === 'goals' ? 'linear-gradient(90deg, var(--gold), var(--gold-dim))' : 'linear-gradient(90deg, var(--text-muted), var(--gold))',
              borderRadius: 2,
            }}
          />
        </div>
      </div>

      {/* Value */}
      <div className="font-display" style={{ fontSize: '1.6rem', color: label === 'goals' ? 'var(--gold)' : 'var(--text-secondary)', minWidth: 30, textAlign: 'right' }}>
        {value}
      </div>
    </motion.div>
  );
}

export default function PlayersSection({ players }: { players: Player[] }) {
  const topScorers = [...players].sort((a, b) => b.goals - a.goals).slice(0, 5);
  const topAssists = [...players].sort((a, b) => b.assists - a.assists).slice(0, 5);
  const maxGoals = topScorers[0]?.goals || 1;
  const maxAssists = topAssists[0]?.assists || 1;

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }} id="players">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <div className="section-badge">⭐ Season Stats</div>
            <h2 className="section-title">Top<br /><span className="gradient-text">Performers</span></h2>
          </div>
          <Link href="/players" className="btn-secondary">
            All Players <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '1.5rem' }}>
          {/* Top Scorers */}
          <div className="glass" style={{ padding: '1.75rem', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Target size={18} color="var(--gold)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Top Scorers</h3>
            </div>
            {topScorers.map((p, i) => (
              <PlayerRow key={p.id} player={p} rank={i + 1} value={p.goals} label="goals" maxValue={maxGoals} />
            ))}
          </div>

          {/* Top Assists */}
          <div className="glass" style={{ padding: '1.75rem', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Zap size={18} color="var(--text-secondary)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Most Assists</h3>
            </div>
            {topAssists.map((p, i) => (
              <PlayerRow key={p.id} player={p} rank={i + 1} value={p.assists} label="assists" maxValue={maxAssists} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
