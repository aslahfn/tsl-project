'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Landmark, ShieldAlert, User } from 'lucide-react';
import TeamLogo from '@/components/ui/TeamLogo';
import PageHeader from '@/components/ui/PageHeader';

interface Standing {
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
  city: string;
  manager: string;
  stadium: string;
  founded: number;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  logo?: string | null;
  standing?: Standing | null;
}

export default function TeamsPageClient({ teams }: { teams: Team[] }) {
  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '5rem' }}>
      <PageHeader
        badge="🛡️ League Clubs"
        title="League"
        titleHighlight="Teams"
        description="Discover the history, stadiums, managers, and squads of the 8 competing clubs."
      />

      <div className="container-wide" style={{ marginTop: '3.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
        }}>
          {teams.map((team: Team, idx: number) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              whileHover={{ y: -6 }}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${team.primaryColor}40`;
                e.currentTarget.style.boxShadow = `0 10px 30px ${team.primaryColor}10`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Top accent color bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: `linear-gradient(90deg, ${team.primaryColor}, ${team.secondaryColor || '#000'})`,
              }} />

              {/* Logo & Header */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: 70, height: 70, borderRadius: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <TeamLogo name={team.shortName} logo={team.logo} size={48} />
                  </div>
                  <span className="font-display" style={{
                    fontSize: '2.5rem',
                    color: 'rgba(255,255,255,0.03)',
                    lineHeight: 1,
                    userSelect: 'none',
                  }}>
                    {team.shortName}
                  </span>
                </div>

                <h3 className="font-display" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem', letterSpacing: '0.02em' }}>
                  {team.name}
                </h3>

                {/* Team Info Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <User size={14} color="#FFD700" />
                    <span>Manager: <strong style={{ color: '#fff' }}>{team.manager}</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <ShieldAlert size={14} color="#FFD700" />
                    <span>Founded: <strong style={{ color: '#fff' }}>{team.founded}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link href={`/teams/${team.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#FFD700';
                    e.currentTarget.style.color = '#000';
                    e.currentTarget.style.borderColor = '#FFD700';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <span>View Club Profile</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
