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

function MatchCard({ match, isFeatured = false }: { match: Fixture, isFeatured?: boolean }) {
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
      className={`match-card ${isFeatured ? 'featured' : ''}`}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300 }}
      id={`match-card-${match.id}`}
      style={{
        padding: isFeatured ? '2rem' : '1.25rem 1.5rem',
        background: isFeatured ? 'linear-gradient(135deg, rgba(10,10,20,0.8) 0%, rgba(0,180,255,0.05) 100%)' : 'var(--bg-card)',
        border: isFeatured ? '1px solid rgba(0,180,255,0.3)' : '1px solid var(--border-gold)',
        boxShadow: isFeatured ? '0 10px 40px -10px rgba(0,180,255,0.1)' : 'none'
      }}
    >
      {/* Matchday badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Matchday {match.matchday}
        </span>
        <span style={{
          padding: '0.2rem 0.6rem', borderRadius: '100px',
          background: match.status === 'FINISHED' ? 'rgba(212,175,55,0.06)' : 'rgba(0,180,255,0.06)',
          border: match.status === 'FINISHED' ? '1px solid var(--border-gold)' : '1px solid rgba(0,180,255,0.3)',
          fontSize: '0.65rem', color: match.status === 'FINISHED' ? 'var(--gold)' : '#00b4ff', letterSpacing: '0.1em',
        }}>
          {match.status === 'FINISHED' ? 'FULL TIME' : 'UPCOMING PREVIEW'}
        </span>
      </div>

      {/* Teams & Score */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: isFeatured ? 'center' : 'flex-start', gap: isFeatured ? '2rem' : '1rem' }}>
        {/* Home */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          <TeamLogo name={match.homeTeam.shortName} logo={match.homeTeam.logo} size={isFeatured ? 80 : 52} />
          <span style={{ fontSize: isFeatured ? '1.2rem' : '0.8rem', fontWeight: 600, textAlign: 'center', color: '#fff' }}>{match.homeTeam.shortName}</span>
          
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

        {/* Score or vs */}
        <div style={{ textAlign: 'center' }}>
          {match.status === 'FINISHED' ? (
            <div className="font-display" style={{
              fontSize: isFeatured ? '4rem' : '2.5rem', letterSpacing: '0.05em', lineHeight: 1,
              color: '#fff',
            }}>
              <span style={{ color: (match.homeScore ?? 0) > (match.awayScore ?? 0) ? 'var(--gold)' : '#fff' }}>{match.homeScore}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 0.25rem' }}>-</span>
              <span style={{ color: (match.awayScore ?? 0) > (match.homeScore ?? 0) ? 'var(--gold)' : '#fff' }}>{match.awayScore}</span>
            </div>
          ) : (
            <div className="font-display" style={{
              fontSize: isFeatured ? '3.5rem' : '2.5rem', letterSpacing: '0.05em', lineHeight: 1,
              color: 'rgba(255,255,255,0.3)',
            }}>
              V S
            </div>
          )}
          <div style={{ fontSize: isFeatured ? '0.8rem' : '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{formatDate(match.date)}</div>
          {match.status === 'UPCOMING' && (
            <div style={{ fontSize: isFeatured ? '1rem' : '0.75rem', color: '#fff', marginTop: '0.2rem', fontWeight: 600 }}>{match.time.substring(0, 5)}</div>
          )}
        </div>

        {/* Away */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          <TeamLogo name={match.awayTeam.shortName} logo={match.awayTeam.logo} size={isFeatured ? 80 : 52} />
          <span style={{ fontSize: isFeatured ? '1.2rem' : '0.8rem', fontWeight: 600, textAlign: 'center', color: '#fff' }}>{match.awayTeam.shortName}</span>
          
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
  // Find finished and upcoming matches
  const finishedFixtures = fixtures.filter(f => f.status === 'FINISHED').reverse();
  const upcomingFixtures = fixtures.filter(f => f.status === 'UPCOMING');
  
  // The featured matches: latest result and next preview
  const featuredResult = finishedFixtures.length > 0 ? finishedFixtures[0] : null;
  const featuredPreview = upcomingFixtures.length > 0 ? upcomingFixtures[0] : null;
  
  // Other matches to fill the grid
  const otherFinished = finishedFixtures.slice(1, 3); // Get up to 2 older finished matches
  // Fill the rest with upcoming matches (if we need to show up to 4 total grid matches)
  const otherUpcoming = upcomingFixtures.slice(1, Math.max(1, 5 - otherFinished.length));
  
  const gridMatches = [...otherFinished, ...otherUpcoming];

  useRealTime();

  if (!featuredResult && !featuredPreview && gridMatches.length === 0) return null;

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
            <div className="section-badge">⚽ Match Center</div>
            <h2 className="section-title">Results &amp;<br /><span className="gradient-text">Previews</span></h2>
          </div>
          <Link href="/fixtures" className="btn-secondary" style={{ gap: '0.5rem' }}>
            All Fixtures <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Featured Matches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
          {featuredResult && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', textAlign: 'center' }}>Latest Result</h3>
              <MatchCard match={featuredResult} isFeatured={true} />
            </motion.div>
          )}

          {featuredPreview && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: featuredResult ? 0.2 : 0 }}
            >
              <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', textAlign: 'center' }}>Next Fixture</h3>
              <MatchCard match={featuredPreview} isFeatured={true} />
            </motion.div>
          )}
        </div>

        {/* Grid for remaining matches */}
        {gridMatches.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '1.25rem' }}>
            {gridMatches.map((match, i) => (
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
        )}
      </div>
    </section>
  );
}
