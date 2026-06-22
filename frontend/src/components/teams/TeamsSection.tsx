'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MapPin, Users } from 'lucide-react';
import TeamLogo from '@/components/ui/TeamLogo';

interface Standing {
  teamId: string;
  position: number;
  points: number;
  won: number;
  drawn: number;
  lost: number;
}

interface Team {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  logo: string;
  city: string;
  manager: string;
  founded: number;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  standing?: Standing | null;
}

export default function TeamsSection({ teams, standings }: { teams: Team[]; standings: Standing[] }) {
  return (
    <section className="section-padding" style={{ background: 'var(--bg-primary)' }} id="teams">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <div className="section-badge">🛡️ {teams.length} Clubs</div>
            <h2 className="section-title">The<br /><span className="gradient-text">Teams</span></h2>
          </div>
          <Link href="/teams" className="btn-secondary">
            All Teams <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '1.25rem' }}>
          {teams.map((team, i) => {
            const standing = standings.find(s => s.teamId === team.id) || team.standing;
            return (
              <motion.div
                key={team.id}
                id={`team-card-${team.slug}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.01 }}
              >
                <Link href={`/teams/${team.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="glass glass-hover" style={{ padding: '1.5rem', borderRadius: 12, height: '100%', transition: 'all 0.3s ease' }}>
                    {/* Top row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                      <TeamLogo name={team.shortName} logo={team.logo} size={56} />
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>{team.name}</h3>
                      </div>
                      {standing && (
                        <div style={{
                          marginLeft: 'auto', textAlign: 'center',
                          background: standing.position === 1 ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.03)',
                          border: standing.position === 1 ? '1px solid var(--border-gold)' : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 8, padding: '0.4rem 0.7rem',
                        }}>
                          <div className="font-display" style={{
                            fontSize: '1.4rem', lineHeight: 1,
                            color: standing.position <= 3 ? 'var(--gold)' : '#fff',
                          }}>#{standing.position}</div>
                          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>RANK</div>
                        </div>
                      )}
                    </div>


                    {/* Stats */}
                    {standing && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                        {[
                          { label: 'Pts', value: standing.points, highlight: true },
                          { label: 'W', value: standing.won },
                          { label: 'D', value: standing.drawn },
                          { label: 'L', value: standing.lost },
                        ].map(stat => (
                          <div key={stat.label} style={{
                            textAlign: 'center', padding: '0.5rem 0.25rem',
                            background: 'rgba(255,255,255,0.02)', borderRadius: 6,
                            border: '1px solid rgba(255,255,255,0.03)',
                          }}>
                            <div style={{
                              fontFamily: 'var(--font-bebas, Bebas Neue), sans-serif',
                              fontSize: '1.2rem', lineHeight: 1,
                              color: stat.highlight ? 'var(--gold)' : '#fff',
                            }}>{stat.value}</div>
                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Manager */}
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                        <Users size={12} />
                        <span>Manager:</span>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{team.manager}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--gold)' }}>Est. {team.founded}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
