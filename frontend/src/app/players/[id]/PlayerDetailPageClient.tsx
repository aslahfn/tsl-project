'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Award, Calendar, Shield, ShieldAlert, Target, Trophy, Zap } from 'lucide-react';
import { Player, Team } from '@/lib/types';
import TeamLogo from '@/components/ui/TeamLogo';

interface PlayerDetailPageClientProps {
  player: Player;
  team?: Team;
}

export default function PlayerDetailPageClient({ player, team }: PlayerDetailPageClientProps) {
  const brandColor = team?.primaryColor || '#00FF87';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '5rem' }}>
      {/* Player Header Banner */}
      <div style={{
        position: 'relative',
        paddingTop: '8rem',
        paddingBottom: '4rem',
        background: `linear-gradient(135deg, ${brandColor}15 0%, var(--bg-primary) 70%), radial-gradient(circle at top right, ${brandColor}20, transparent)`,
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        overflow: 'hidden',
      }}>
        {/* Animated accent gradient line */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${brandColor}, transparent)`,
        }} />

        <div className="container-wide" style={{ position: 'relative', zIndex: 2 }}>
          {/* Back button */}
          <Link href="/players" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            marginBottom: '2rem',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#00FF87'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <ArrowLeft size={14} />
            <span>Back to Players</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
            {/* Player Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.02)',
                border: `2px solid ${brandColor}40`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 32px ${brandColor}10`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <span className="font-display" style={{ fontSize: '3rem', color: '#fff', lineHeight: 1 }}>
                {player.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </span>
            </motion.div>

            {/* Player Name and Quick Info */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--text-secondary)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}>{player.position}</span>
                </div>
                <h1 className="font-display" style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  lineHeight: 1.1,
                  color: '#fff',
                  margin: '0.5rem 0 0.75rem 0',
                }}>
                  {player.name}
                </h1>
              </motion.div>

              {/* Club Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {team && (
                  <Link href={`/teams/${team.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                    <TeamLogo name={team.shortName} size={24} />
                    <span style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600, transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = brandColor}
                      onMouseLeave={e => e.currentTarget.style.color = '#fff'}
                    >
                      {team.name}
                    </span>
                  </Link>
                )}
              </motion.div>
            </div>


          </div>
        </div>
      </div>

      {/* Main Profile Dashboard */}
      <div className="container-wide" style={{ marginTop: '3rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          gap: '2.5rem',
        }}>
          {/* Stats Breakdown Card */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            padding: '2rem',
          }}>
            <h3 className="font-display" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Award size={20} color={brandColor} />
              <span>Season Statistics</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {player.position === 'GK' ? (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Clean Sheets</span>
                  <span style={{ fontSize: '1.75rem', color: '#00C0FF', fontWeight: 700 }}>{player.cleanSheets || 0}</span>
                </div>
              ) : (
                <>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Goals Scored</span>
                    <span style={{ fontSize: '1.75rem', color: '#00FF87', fontWeight: 700 }}>{player.goals}</span>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)', gridColumn: 'span 2' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Assists Provided</span>
                    <span style={{ fontSize: '1.75rem', color: '#FFD700', fontWeight: 700 }}>{player.assists}</span>
                  </div>
                </>
              )}

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Yellow Cards</span>
                <span style={{ fontSize: '1.5rem', color: '#FFE600', fontWeight: 700 }}>{player.yellowCards}</span>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Red Cards</span>
                <span style={{ fontSize: '1.5rem', color: '#FF3B3B', fontWeight: 700 }}>{player.redCards}</span>
              </div>
            </div>
          </div>

          {/* Biography & Attributes Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px',
              padding: '2rem',
            }}>
              <h3 className="font-display" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
                Player Biography
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.75rem' }}>
                  <span>Age</span>
                  <strong style={{ color: '#fff' }}>{player.age} Years Old</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.25rem' }}>
                  <span>Position</span>
                  <strong style={{ color: '#fff' }}>{player.position}</strong>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
