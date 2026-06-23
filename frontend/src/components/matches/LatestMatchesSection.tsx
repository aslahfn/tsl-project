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

  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
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
      {/* Interactive Mouse Glow / Spotlight */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: isHovering 
            ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(212,175,55,0.06), transparent 40%)` 
            : 'transparent',
          pointerEvents: 'none',
          transition: 'background 0.3s ease',
          zIndex: 0
        }}
      />
      
      {/* Content wrapper to stay above the glow */}
      <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Matchday badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Matchday {match.matchday}
        </span>
        <span style={{
          padding: '0.2rem 0.6rem', borderRadius: '100px',
          background: match.status === 'LIVE' ? 'rgba(255, 59, 59, 0.1)' : match.status === 'FINISHED' ? 'rgba(212,175,55,0.06)' : 'rgba(0,180,255,0.06)',
          border: match.status === 'LIVE' ? '1px solid rgba(255, 59, 59, 0.5)' : match.status === 'FINISHED' ? '1px solid var(--border-gold)' : '1px solid rgba(0,180,255,0.3)',
          fontSize: '0.65rem', 
          color: match.status === 'LIVE' ? '#FF3B3B' : match.status === 'FINISHED' ? 'var(--gold)' : '#00b4ff', 
          letterSpacing: '0.1em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          animation: match.status === 'LIVE' ? 'pulse 2s infinite' : 'none'
        }}>
          {match.status === 'LIVE' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF3B3B' }} />}
          {match.status === 'LIVE' ? 'LIVE NOW' : match.status === 'FINISHED' ? 'FULL TIME' : 'UPCOMING PREVIEW'}
        </span>
      </div>

      {/* Teams & Score */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: isFeatured ? 'center' : 'flex-start', gap: isFeatured ? '2rem' : '1rem' }}>
        {/* Home */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          <TeamLogo name={match.homeTeam.shortName} logo={match.homeTeam.logo} size={isFeatured ? 80 : 52} />
          <span style={{ fontSize: isFeatured ? '1.2rem' : '0.8rem', fontWeight: 600, textAlign: 'center', color: '#fff' }}>{match.homeTeam.shortName}</span>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.4rem', gap: '0.3rem' }}>
            {hasSplitScorers && homeScorers && homeScorers.split(',').map((scorer, i) => (
              <div key={`g-${i}`} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '0.25rem', textAlign: 'center' }}>
                {scorer.trim()} <span style={{ fontSize: '0.75rem' }}>⚽</span>
              </div>
            ))}
            {hasSplitYellows && homeYellows && homeYellows.split(',').map((player, i) => (
              <div key={`y-${i}`} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '0.25rem', textAlign: 'center' }}>
                {player.trim()} <span style={{ display: 'inline-block', width: '8px', height: '12px', background: 'var(--gold)', borderRadius: '1.5px' }} />
              </div>
            ))}
            {hasSplitReds && homeReds && homeReds.split(',').map((player, i) => (
              <div key={`r-${i}`} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '0.25rem', textAlign: 'center' }}>
                {player.trim()} <span style={{ display: 'inline-block', width: '8px', height: '12px', background: '#FF3B3B', borderRadius: '1.5px' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Score or vs */}
        <div style={{ textAlign: 'center' }}>
          {match.status === 'FINISHED' || match.status === 'LIVE' ? (
            <div className="font-display" style={{
              fontSize: isFeatured ? '4rem' : '2.5rem', letterSpacing: '0.05em', lineHeight: 1,
              color: '#fff',
            }}>
              <span style={{ color: (match.homeScore ?? 0) > (match.awayScore ?? 0) ? (match.status === 'LIVE' ? '#fff' : 'var(--gold)') : '#fff' }}>{match.homeScore}</span>
              <span style={{ color: match.status === 'LIVE' ? '#FF3B3B' : 'rgba(255,255,255,0.3)', margin: '0 0.25rem' }}>-</span>
              <span style={{ color: (match.awayScore ?? 0) > (match.homeScore ?? 0) ? (match.status === 'LIVE' ? '#fff' : 'var(--gold)') : '#fff' }}>{match.awayScore}</span>
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
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.4rem', gap: '0.3rem' }}>
            {hasSplitScorers && awayScorers && awayScorers.split(',').map((scorer, i) => (
              <div key={`g-${i}`} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '0.25rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem' }}>⚽</span> {scorer.trim()}
              </div>
            ))}
            {hasSplitYellows && awayYellows && awayYellows.split(',').map((player, i) => (
              <div key={`y-${i}`} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '0.25rem', textAlign: 'center' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '12px', background: 'var(--gold)', borderRadius: '1.5px' }} /> {player.trim()}
              </div>
            ))}
            {hasSplitReds && awayReds && awayReds.split(',').map((player, i) => (
              <div key={`r-${i}`} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '0.25rem', textAlign: 'center' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '12px', background: '#FF3B3B', borderRadius: '1.5px' }} /> {player.trim()}
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
      </div>
    </motion.div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useRealTime } from '@/hooks/useRealTime';
import { AnimatePresence } from 'framer-motion';

export default function LatestMatchesSection({ fixtures }: { fixtures: Fixture[] }) {
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);

  // Find matches by status
  const liveMatches = fixtures.filter(f => f.status === 'LIVE');
  const recentMatches = fixtures.filter(f => f.status === 'FINISHED').reverse().slice(0, 3);
  const upcomingFixtures = fixtures.filter(f => f.status === 'UPCOMING');
  
  // Fill the grid up to 4 items
  const otherUpcoming = upcomingFixtures.slice(0, Math.max(1, 4 - recentMatches.length - liveMatches.length));
  
  const displayMatches = [...liveMatches, ...recentMatches, ...otherUpcoming];

  // Set default active match to the first live match, or upcoming match, or recent match
  useEffect(() => {
    if (!activeMatchId && fixtures.length > 0) {
      if (liveMatches.length > 0) {
        setActiveMatchId(liveMatches[0].id);
      } else if (upcomingFixtures.length > 0) {
        setActiveMatchId(upcomingFixtures[0].id);
      } else if (recentMatches.length > 0) {
        setActiveMatchId(recentMatches[0].id);
      }
    }
  }, [fixtures, activeMatchId, liveMatches, upcomingFixtures, recentMatches]);

  const activeMatch = fixtures.find(f => f.id === activeMatchId) || null;

  useRealTime();

  if (displayMatches.length === 0) return null;

  return (
    <section className="section-padding" style={{ position: 'relative', background: 'var(--bg-secondary)', overflow: 'hidden' }} id="latest-matches">
      {/* SVG Pitch Geometry Watermark */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120%', minWidth: '1000px', height: '120%', opacity: 0.02, pointerEvents: 'none', zIndex: 0 }}>
        <rect x="50" y="50" width="900" height="500" fill="none" stroke="#FFF" strokeWidth="4"/>
        <line x1="500" y1="50" x2="500" y2="550" stroke="#FFF" strokeWidth="4"/>
        <circle cx="500" cy="300" r="80" fill="none" stroke="#FFF" strokeWidth="4"/>
        <circle cx="500" cy="300" r="4" fill="#FFF"/>
        <rect x="50" y="150" width="150" height="300" fill="none" stroke="#FFF" strokeWidth="4"/>
        <rect x="800" y="150" width="150" height="300" fill="none" stroke="#FFF" strokeWidth="4"/>
        <rect x="50" y="225" width="50" height="150" fill="none" stroke="#FFF" strokeWidth="4"/>
        <rect x="900" y="225" width="50" height="150" fill="none" stroke="#FFF" strokeWidth="4"/>
        <path d="M 200 240 A 80 80 0 0 1 200 360" fill="none" stroke="#FFF" strokeWidth="4"/>
        <path d="M 800 240 A 80 80 0 0 0 800 360" fill="none" stroke="#FFF" strokeWidth="4"/>
        <circle cx="160" cy="300" r="4" fill="#FFF"/>
        <circle cx="840" cy="300" r="4" fill="#FFF"/>
      </svg>

      <div className="container-wide" style={{ position: 'relative', zIndex: 1 }}>
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

        {/* Dynamic Featured Premium Match */}
        <div style={{ marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 3rem auto', minHeight: '300px' }}>
          <AnimatePresence mode="wait">
            {activeMatch && (
              <motion.div
                key={activeMatch.id}
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <MatchCard match={activeMatch} isFeatured={true} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Grid */}
        {displayMatches.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '1.25rem' }}>
            {displayMatches.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                onMouseEnter={() => setActiveMatchId(match.id)}
                onClick={() => setActiveMatchId(match.id)}
                style={{ cursor: 'pointer', opacity: activeMatchId === match.id ? 0.5 : 1, transition: 'opacity 0.3s' }}
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
