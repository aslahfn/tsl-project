'use client';

import { useState, useEffect } from 'react';
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

  const [worldMatch, setWorldMatch] = useState<{
    homeAbbrev: string;
    awayAbbrev: string;
    homeScore: string;
    awayScore: string;
    isLive: boolean;
    timeStr: string;
  } | null>(null);

  useEffect(() => {
    async function fetchWorldCup() {
      try {
        const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard');
        const data = await res.json();
        if (data.events && data.events.length > 0) {
          // Find first live match or fallback to first upcoming
          const ev = data.events.find((e: any) => e.status.type.state === 'in') || data.events[0];
          
          if (ev && ev.competitions && ev.competitions[0]) {
            const comp = ev.competitions[0];
            const home = comp.competitors.find((c: any) => c.homeAway === 'home') || comp.competitors[0];
            const away = comp.competitors.find((c: any) => c.homeAway === 'away') || comp.competitors[1];
            
            const isLive = ev.status.type.state === 'in';
            const timeStr = isLive ? ev.status.type.shortDetail : (ev.status.type.state === 'pre' ? 'UPCOMING' : 'FT');

            setWorldMatch({
              homeAbbrev: home.team.abbreviation || 'T1',
              awayAbbrev: away.team.abbreviation || 'T2',
              homeScore: home.score || '0',
              awayScore: away.score || '0',
              isLive,
              timeStr
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch world matches', err);
      }
    }
    fetchWorldCup();
    
    // Poll every 60s
    const interval = setInterval(fetchWorldCup, 60000);
    return () => clearInterval(interval);
  }, []);

  const liveMatches = fixtures.filter(f => f.status === 'LIVE');
  const upcomingMatches = fixtures.filter(f => f.status === 'UPCOMING');

  const activeMatch = liveMatches.length > 0 ? liveMatches[0] : (upcomingMatches.length > 0 ? upcomingMatches[0] : null);

  if (!activeMatch && !worldMatch) return null;

  const isLive = activeMatch ? activeMatch.status === 'LIVE' : false;

  return (
    <>
      <style>{`
        .ticker-world {
          position: fixed;
          top: 50%;
          left: 1.5rem;
          transform: translateY(-50%);
          z-index: 9999;
          pointer-events: auto;
        }
        .ticker-tsl {
          position: fixed;
          top: 50%;
          right: 1.5rem;
          transform: translateY(-50%);
          z-index: 9999;
          pointer-events: auto;
        }
        @media (max-width: 768px) {
          .ticker-world {
            top: 5rem;
            left: 50%;
            transform: translateX(-50%);
          }
          .ticker-tsl {
            top: 9rem;
            left: 50%;
            transform: translateX(-50%);
            right: auto;
          }
        }
      `}</style>

      <AnimatePresence>
        {worldMatch && (
          <motion.div
            className="ticker-world"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.5rem 1.5rem',
                background: worldMatch.isLive ? 'rgba(20, 5, 5, 0.85)' : 'rgba(10, 10, 15, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: worldMatch.isLive ? '1px solid rgba(255, 59, 59, 0.4)' : '1px solid rgba(0, 180, 255, 0.3)',
                borderRadius: '100px',
                boxShadow: worldMatch.isLive ? '0 10px 30px rgba(255, 59, 59, 0.2)' : '0 10px 30px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 800,
                letterSpacing: '0.1em', color: worldMatch.isLive ? '#FF3B3B' : 'var(--text-muted)', textTransform: 'uppercase'
              }}>
                {worldMatch.isLive && (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF3B3B', animation: 'pulse 2s infinite' }} />
                )}
                {worldMatch.isLive ? 'WORLD' : 'WORLD'}
              </div>
              
              <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-bebas, Bebas Neue), sans-serif', fontSize: '1.2rem', color: '#fff', letterSpacing: '0.05em', paddingTop: '2px' }}>
                <span style={{ opacity: 0.9 }}>{worldMatch.homeAbbrev}</span>
                {worldMatch.isLive ? (
                  <span style={{ color: 'var(--gold)' }}>{worldMatch.homeScore} - {worldMatch.awayScore}</span>
                ) : (
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>v</span>
                )}
                <span style={{ opacity: 0.9 }}>{worldMatch.awayAbbrev}</span>
              </div>
              
              {!worldMatch.isLive && (
                <>
                  <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{worldMatch.timeStr}</div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {activeMatch && (
          <motion.div
            className="ticker-tsl"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.7 }}
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
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 800,
                  letterSpacing: '0.1em', color: isLive ? '#FF3B3B' : '#00b4ff', textTransform: 'uppercase'
                }}>
                  {isLive && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF3B3B', animation: 'pulse 2s infinite' }} />
                  )}
                  {isLive ? 'TSL LIVE' : 'TSL NEXT'}
                </div>

                <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-bebas, Bebas Neue), sans-serif', fontSize: '1.2rem', color: '#fff', letterSpacing: '0.05em', paddingTop: '2px' }}>
                  <span style={{ opacity: 0.9 }}>{activeMatch.homeTeam.shortName}</span>
                  
                  {isLive ? (
                    <span style={{ color: 'var(--gold)' }}>{activeMatch.homeScore} - {activeMatch.awayScore}</span>
                  ) : (
                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>v</span>
                  )}

                  <span style={{ opacity: 0.9 }}>{activeMatch.awayTeam.shortName}</span>
                </div>

                {!isLive && (
                  <>
                    <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      {formatDate(activeMatch.date)} • {activeMatch.time.substring(0, 5)}
                    </div>
                  </>
                )}
              </motion.div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
