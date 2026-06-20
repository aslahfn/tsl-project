'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';
import TeamLogo from '@/components/ui/TeamLogo';

interface Team {
  id: string;
  shortName: string;
  name: string;
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
}

import { useRealTime } from '@/hooks/useRealTime';

export default function FixturesSection({ fixtures }: { fixtures: Fixture[] }) {
  const upcomingFixtures = fixtures.filter(f => f.status === 'UPCOMING').slice(0, 5);

  useRealTime();

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }} id="fixtures">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <div className="section-badge">📅 Upcoming</div>
            <h2 className="section-title">Next<br /><span className="gradient-text">Fixtures</span></h2>
          </div>
          <Link href="/fixtures" className="btn-secondary">
            Full Schedule <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {upcomingFixtures.map((fixture, i) => (
            <motion.div
              key={fixture.id}
              id={`fixture-row-${fixture.id}`}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ x: 6, borderColor: 'var(--border-green-bright)', backgroundColor: 'var(--bg-card-hover)' }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.25rem 1.5rem',
                background: 'var(--bg-card)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--border-gold)',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Home team */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', textAlign: 'right' }}>{fixture.homeTeam.name}</span>
                <TeamLogo name={fixture.homeTeam.shortName} size={40} />
              </div>

              {/* Center info */}
              <div style={{ textAlign: 'center', minWidth: '120px' }}>
                <div style={{
                  padding: '0.35rem 0.875rem',
                  background: 'rgba(212, 175, 55, 0.08)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 6,
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-bebas, Bebas Neue), sans-serif',
                  fontSize: '0.85rem',
                  color: 'var(--gold)',
                  letterSpacing: '0.05em',
                }}>
                  MD{fixture.matchday}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                    <Calendar size={11} />
                    {formatDate(fixture.date)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                    <Clock size={11} />
                    {formatTime(fixture.time)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
                    <MapPin size={10} />
                    {fixture.venue}
                  </div>
                </div>
              </div>

              {/* Away team */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <TeamLogo name={fixture.awayTeam.shortName} size={40} />
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{fixture.awayTeam.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
