'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import TeamLogo from '@/components/ui/TeamLogo';

interface Team {
  id: string;
  shortName: string;
  name: string;
  logo: string;
}

interface MatchEvent {
  id: string;
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD';
  minute?: number;
  player: {
    id: string;
    name: string;
  };
}

interface Fixture {
  id: string;
  matchday: number;
  date: string;
  time: string;
  venue: string;
  status: string;
  homeScore: number | null;
  awayScore: number | null;

  homeTeam: Team;
  awayTeam: Team;

  manOfTheMatch?: {
    id: string;
    name: string;
    photo?: string;
  } | null;

  goalScorers?: string | null;
  yellowCards?: string | null;
  redCards?: string | null;
  matchReport?: string | null;
  attendance?: number | null;
  referee?: string | null;

  events?: MatchEvent[];
}

function MatchCard({ match }: { match: Fixture }) {
  const hasSplitScorers = match.goalScorers && match.goalScorers.includes('|');
  const homeScorers = hasSplitScorers ? match.goalScorers!.split('|')[0].trim() : '';
  const awayScorers = hasSplitScorers ? match.goalScorers!.split('|')[1].trim() : '';

  const hasSplitYellows = match.yellowCards && match.yellowCards.includes('|');
  const homeYellows = hasSplitYellows ? match.yellowCards!.split('|')[0].trim() : '';
  const awayYellows = hasSplitYellows ? match.yellowCards!.split('|')[1].trim() : '';

  const hasSplitReds = match.redCards && match.redCards.includes('|');
  const homeReds = hasSplitReds ? match.redCards!.split('|')[0].trim() : '';
  const awayReds = hasSplitReds ? match.redCards!.split('|')[1].trim() : '';

  return (
    <motion.div
      className="match-card"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300 }}
      id={`match-card-${match.id}`}
    >
      {/* Matchday badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Matchday {match.matchday}
        </span>
        <span style={{
          padding: '0.2rem 0.6rem', borderRadius: '100px',
          background: 'rgba(212,175,55,0.06)', border: '1px solid var(--border-gold)',
          fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.1em',
        }}>FULL TIME</span>
      </div>

      {/* Teams & Score */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'flex-start', gap: '1rem' }}>
        {/* Home */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          <TeamLogo name={match.homeTeam.shortName} logo={match.homeTeam.logo} size={52} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, textAlign: 'center', color: '#fff' }}>{match.homeTeam.shortName}</span>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.2rem', gap: '0.2rem' }}>
            {hasSplitScorers && homeScorers && homeScorers.split(',').map((scorer, i) => (
              <div key={`g-${i}`} style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.2rem', textAlign: 'center' }}>
                {scorer.trim()} <span style={{ fontSize: '0.55rem' }}>⚽</span>
              </div>
            ))}
            {hasSplitYellows && homeYellows && homeYellows.split(',').map((player, i) => (
              <div key={`y-${i}`} style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.2rem', textAlign: 'center' }}>
                {player.trim()} <span style={{ display: 'inline-block', width: '6px', height: '9px', background: 'var(--gold)', borderRadius: '1.5px' }} />
              </div>
            ))}
            {hasSplitReds && homeReds && homeReds.split(',').map((player, i) => (
              <div key={`r-${i}`} style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.2rem', textAlign: 'center' }}>
                {player.trim()} <span style={{ display: 'inline-block', width: '6px', height: '9px', background: '#FF3B3B', borderRadius: '1.5px' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Score */}
        <div style={{ textAlign: 'center' }}>
          <div className="font-display" style={{
            fontSize: '2.5rem', letterSpacing: '0.05em', lineHeight: 1,
            color: '#fff',
          }}>
            <span style={{ color: (match.homeScore ?? 0) > (match.awayScore ?? 0) ? 'var(--gold)' : '#fff' }}>{match.homeScore}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 0.25rem' }}>-</span>
            <span style={{ color: (match.awayScore ?? 0) > (match.homeScore ?? 0) ? 'var(--gold)' : '#fff' }}>{match.awayScore}</span>
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{formatDate(match.date)}</div>
        </div>

        {/* Away */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          <TeamLogo name={match.awayTeam.shortName} logo={match.awayTeam.logo} size={52} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, textAlign: 'center', color: '#fff' }}>{match.awayTeam.shortName}</span>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.2rem', gap: '0.2rem' }}>
            {hasSplitScorers && awayScorers && awayScorers.split(',').map((scorer, i) => (
              <div key={`g-${i}`} style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.2rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.55rem' }}>⚽</span> {scorer.trim()}
              </div>
            ))}
            {hasSplitYellows && awayYellows && awayYellows.split(',').map((player, i) => (
              <div key={`y-${i}`} style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.2rem', textAlign: 'center' }}>
                <span style={{ display: 'inline-block', width: '6px', height: '9px', background: 'var(--gold)', borderRadius: '1.5px' }} /> {player.trim()}
              </div>
            ))}
            {hasSplitReds && awayReds && awayReds.split(',').map((player, i) => (
              <div key={`r-${i}`} style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.2rem', textAlign: 'center' }}>
                <span style={{ display: 'inline-block', width: '6px', height: '9px', background: '#FF3B3B', borderRadius: '1.5px' }} /> {player.trim()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Match details section for finished games */}
      {match.status === 'FINISHED' && (
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1.25rem',
          borderTop: '1px dashed rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.8)'
        }}>
          {/* Goal Scorers (Legacy format without '|') */}
          {!hasSplitScorers && match.goalScorers && match.goalScorers.trim() !== '' && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ minWidth: '1.25rem' }}>⚽</span>
              <div>
                <span style={{ color: 'var(--text-muted)', marginRight: '0.25rem' }}>Scorers:</span>
                <span style={{ fontWeight: 500, color: '#FFF' }}>{match.goalScorers}</span>
              </div>
            </div>
          )}

          {/* Cards */}
          {((match.yellowCards && match.yellowCards.trim() !== '') || (match.redCards && match.redCards.trim() !== '')) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {!hasSplitYellows && match.yellowCards && match.yellowCards.trim() !== '' && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '12px',
                    background: 'var(--gold)',
                    borderRadius: '2.5px',
                    marginTop: '3px',
                    flexShrink: 0
                  }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)', marginRight: '0.25rem' }}>Yellow Cards:</span>
                    <span style={{ color: '#DDD' }}>{match.yellowCards}</span>
                  </div>
                </div>
              )}
              {!hasSplitReds && match.redCards && match.redCards.trim() !== '' && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '12px',
                    background: '#FF3B3B',
                    borderRadius: '2.5px',
                    marginTop: '3px',
                    flexShrink: 0
                  }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)', marginRight: '0.25rem' }}>Red Cards:</span>
                    <span style={{ color: '#FF3B3B' }}>{match.redCards}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Man of the Match */}
          {match.manOfTheMatch && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(212,175,55,0.03)',
              border: '1px solid var(--border-gold)',
              padding: '0.4rem 0.6rem',
              borderRadius: '6px'
            }}>
              <span style={{ color: 'var(--gold)' }}>★</span>
              <div>
                <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', marginRight: '0.25rem' }}>POTM:</span>
                <span style={{ fontWeight: 600, color: '#fff' }}>{match.manOfTheMatch.name}</span>
              </div>
            </div>
          )}

          {/* Match Report Summary */}
          {match.matchReport && match.matchReport.trim() !== '' && (
            <div style={{
              background: 'rgba(0,0,0,0.2)',
              borderLeft: '2px solid var(--gold)',
              padding: '0.5rem 0.75rem',
              borderRadius: '0 6px 6px 0',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.4,
              fontSize: '0.7rem'
            }}>
              &quot;{match.matchReport.length > 120 ? `${match.matchReport.substring(0, 120)}...` : match.matchReport}&quot;
            </div>
          )}


        </div>
      )}
      
      {/* Venue */}
      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        📍 {match.venue}
      </div>
    </motion.div>
  );
}

import { useRealTime } from '@/hooks/useRealTime';

export default function LatestMatchesSection({ fixtures }: { fixtures: Fixture[] }) {
  const recentMatches = fixtures.filter(f => f.status === 'FINISHED');

  useRealTime();

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }} id="latest-matches">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <div className="section-badge">⚽ Latest Results</div>
            <h2 className="section-title">Recent<br /><span className="gradient-text">Matches</span></h2>
          </div>
          <Link href="/fixtures" className="btn-secondary" style={{ gap: '0.5rem' }}>
            All Fixtures <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {recentMatches.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <MatchCard match={match} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
