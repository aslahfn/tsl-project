'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/lib/utils';
import { useRealTime } from '@/hooks/useRealTime';
import Link from 'next/link';

interface Fixture {
  id: string;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  time: string;
  matchday: number;
  homeTeam: { shortName: string };
  awayTeam: { shortName: string };
}

export default function LiveMatchTicker({ fixtures }: { fixtures: Fixture[] }) {
  useRealTime(); // Keep the ticker updated automatically

  const liveMatches = fixtures.filter(f => f.status === 'LIVE');
  const upcomingMatches = fixtures.filter(f => f.status === 'UPCOMING');

  const activeMatch = liveMatches.length > 0 ? liveMatches[0] : (upcomingMatches.length > 0 ? upcomingMatches[0] : null);

  if (!activeMatch) return null;

  const isLive = activeMatch.status === 'LIVE';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 1 }}
        style={{
          position: 'fixed',
          top: '5rem', // Just below the navbar
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          pointerEvents: 'auto'
        }}
      >
        <Link href="/#latest-matches" style={{ textDecoration: 'none' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.5rem 1.5rem',
              background: isLive ? 'rgba(20, 5, 5, 0.85)' : 'rgba(10, 10, 15, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: isLive ? '1px solid rgba(255, 59, 59, 0.4)' : '1px solid rgba(0, 180, 255, 0.3)',
              borderRadius: '100px',
              boxShadow: isLive ? '0 10px 30px rgba(255, 59, 59, 0.2)' : '0 10px 30px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Status Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.65rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: isLive ? '#FF3B3B' : '#00b4ff',
              textTransform: 'uppercase'
            }}>
              {isLive && (
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#FF3B3B',
                  animation: 'pulse 2s infinite'
                }} />
              )}
              {isLive ? 'LIVE' : 'NEXT'}
            </div>

            <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />

            {/* Match Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-bebas, Bebas Neue), sans-serif', fontSize: '1.2rem', color: '#fff', letterSpacing: '0.05em', paddingTop: '2px' }}>
              <span style={{ opacity: 0.9 }}>{activeMatch.homeTeam.shortName}</span>
              
              {isLive ? (
                <span style={{ color: 'var(--gold)' }}>
                  {activeMatch.homeScore} - {activeMatch.awayScore}
                </span>
              ) : (
                <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
                  v
                </span>
              )}

              <span style={{ opacity: 0.9 }}>{activeMatch.awayTeam.shortName}</span>
            </div>

            {/* Time / Extra Info */}
            {!isLive && (
              <>
                <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {formatDate(activeMatch.date)} • {activeMatch.time.substring(0, 5)}
                </div>
              </>
            )}
          </motion.div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
