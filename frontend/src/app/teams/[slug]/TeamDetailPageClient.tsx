'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Landmark, MapPin, Trophy, User, Users } from 'lucide-react';
import { Team, Player, Fixture } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/utils';
import TeamLogo from '@/components/ui/TeamLogo';

interface TeamDetailPageClientProps {
  team: Team;
  players: Player[];
  fixtures: Fixture[];
}

export default function TeamDetailPageClient({ team, players, fixtures }: TeamDetailPageClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'squad' | 'fixtures'>('overview');

  const upcomingMatches = fixtures.filter(f => f.status === 'UPCOMING').slice(0, 3);
  const completedMatches = fixtures.filter(f => f.status === 'FINISHED').slice(0, 3);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '5rem' }}>
      {/* Club Banner Header */}
      <div style={{
        position: 'relative',
        paddingTop: '8rem',
        paddingBottom: '4rem',
        background: `linear-gradient(135deg, ${team.primaryColor}15 0%, var(--bg-primary) 70%), radial-gradient(circle at top right, ${team.primaryColor}25, transparent)`,
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
          background: `linear-gradient(90deg, transparent, ${team.primaryColor}, transparent)`,
        }} />

        <div className="container-wide" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
            {/* Team Big Logo Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                width: '120px',
                height: '120px',
                background: 'rgba(255,255,255,0.02)',
                border: `2px solid ${team.primaryColor}40`,
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 32px ${team.primaryColor}10`,
                backdropFilter: 'blur(10px)',
              }}
            >
              <TeamLogo name={team.shortName} logo={team.logo} size={80} />
            </motion.div>

            {/* Club Identity */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="font-display" style={{
                  color: team.primaryColor,
                  fontSize: '0.875rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}>
                  Est. {team.founded}
                </span>
                <h1 className="font-display" style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  lineHeight: 1,
                  color: '#fff',
                  margin: '0.25rem 0 0.75rem 0',
                }}>
                  {team.name}
                </h1>
              </motion.div>

              {/* Badges / Quick stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} color={team.primaryColor} />
                  <span>Manager: <strong style={{ color: '#fff' }}>{team.manager}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={16} color={team.primaryColor} />
                  <span>Squad Size: <strong style={{ color: '#fff' }}>{players.length} Players</strong></span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="container-wide" style={{ marginTop: '2.5rem' }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          paddingBottom: '0.75rem',
          marginBottom: '2.5rem',
        }}>
          {([
            { id: 'overview', label: 'Overview', icon: Trophy },
            { id: 'squad', label: 'Squad Roster', icon: Users },
            { id: 'fixtures', label: 'Fixtures & Results', icon: Calendar },
          ] as const).map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  position: 'relative',
                  transition: 'color 0.2s',
                }}
              >
                <Icon size={16} color={isActive ? team.primaryColor : 'var(--text-muted)'} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    style={{
                      position: 'absolute',
                      bottom: '-13px',
                      left: 0,
                      width: '100%',
                      height: '3px',
                      backgroundColor: team.primaryColor,
                      borderRadius: '2px',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2.5rem' }}
            >
              {/* About Club */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '20px',
                padding: '2rem',
              }}>
                <h3 className="font-display" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
                  Club Info
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Founded</span>
                    <span style={{ fontSize: '1rem', color: '#fff', fontWeight: 600 }}>{team.founded}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Primary Color</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <div style={{ width: 14, height: 14, borderRadius: '4px', background: team.primaryColor }} />
                      <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{team.primaryColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Matches Summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Upcoming */}
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '20px',
                  padding: '2rem',
                }}>
                  <h4 className="font-display" style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
                    Next Fixtures
                  </h4>
                  {upcomingMatches.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {upcomingMatches.map(fixture => (
                        <div key={fixture.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <TeamLogo name={fixture.homeTeamShort === team.shortName ? fixture.awayTeamShort : fixture.homeTeamShort} logo={fixture.homeTeamShort === team.shortName ? fixture.awayTeamLogo : fixture.homeTeamLogo} size={24} />
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
                              vs {fixture.homeTeamShort === team.shortName ? fixture.awayTeamName : fixture.homeTeamName}
                            </span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.8rem', color: '#00FF87', fontWeight: 600 }}>{formatTime(fixture.time)}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(fixture.date)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No upcoming fixtures scheduled.</p>
                  )}
                </div>

                {/* Latest Results */}
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '20px',
                  padding: '2rem',
                }}>
                  <h4 className="font-display" style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
                    Latest Results
                  </h4>
                  {completedMatches.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {completedMatches.map(fixture => {
                        const isHome = fixture.homeTeamId === team.id;
                        const isWin = isHome ? (fixture.homeScore! > fixture.awayScore!) : (fixture.awayScore! > fixture.homeScore!);
                        const isDraw = fixture.homeScore === fixture.awayScore;

                        return (
                          <div key={fixture.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{
                                width: 24, height: 24, borderRadius: '50%',
                                background: isWin ? 'rgba(0,255,135,0.15)' : isDraw ? 'rgba(255,215,0,0.15)' : 'rgba(255,59,59,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: isWin ? '#00FF87' : isDraw ? '#FFD700' : '#FF3B3B',
                                fontSize: '0.7rem', fontWeight: 700,
                              }}>
                                {isWin ? 'W' : isDraw ? 'D' : 'L'}
                              </span>
                              <span style={{ fontSize: '0.9rem', color: '#fff' }}>
                                {isHome ? fixture.awayTeamName : fixture.homeTeamName}
                              </span>
                            </div>
                            <div className="font-display" style={{ fontSize: '1.2rem', color: '#fff', letterSpacing: '0.05em' }}>
                              {fixture.homeScore} - {fixture.awayScore}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No recent results.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'squad' && (
            <motion.div
              key="squad"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))',
                gap: '1.5rem',
              }}
            >
              {players.map((player, idx) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  whileHover={{ y: -5 }}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    textAlign: 'center',
                    transition: 'border-color 0.2s',
                    position: 'relative',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${team.primaryColor}30`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                >
                  {/* Jersey Number */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1.25rem',
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'rgba(255,255,255,0.04)',
                    fontFamily: 'var(--font-display)',
                  }}>
                    #{player.number}
                  </div>

                  {/* Profile Photo / Avatar */}
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    margin: '0.5rem auto 1rem auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {player.photo ? (
                      <img 
                        src={player.photo} 
                        alt={player.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallbackSpan = e.currentTarget.parentElement?.querySelector('.avatar-fallback');
                          if (fallbackSpan) {
                            (fallbackSpan as HTMLSpanElement).style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <span 
                      className="avatar-fallback" 
                      style={{ 
                        display: player.photo ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        fontSize: '1.5rem',
                        color: team.primaryColor,
                        fontWeight: 700 
                      }}
                    >
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  {/* Position Badge */}
                  <span style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--text-secondary)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}>{player.position}</span>

                  <h4 style={{ fontSize: '1rem', color: '#fff', marginTop: '0.75rem', marginBottom: '0.25rem' }}>
                    {player.name}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                    <span>{player.nationalityFlag}</span>
                    <span>{player.nationality}</span>
                    <span>•</span>
                    <span>Age {player.age}</span>
                  </div>

                  {/* Player mini-stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.25rem',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                  }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>App</div>
                      <div style={{ color: '#fff', fontWeight: 600 }}>{player.matches}</div>
                    </div>
                    {player.position === 'GK' ? (
                      <>
                        <div>
                          <div style={{ color: 'var(--text-muted)' }}>CS</div>
                          <div style={{ color: '#00FF87', fontWeight: 600 }}>{player.cleanSheets || 0}</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-muted)' }}>Rat</div>
                          <div style={{ color: '#FFD700', fontWeight: 600 }}>{player.rating}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <div style={{ color: 'var(--text-muted)' }}>Gls</div>
                          <div style={{ color: '#00FF87', fontWeight: 600 }}>{player.goals}</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-muted)' }}>Ast</div>
                          <div style={{ color: '#FFD700', fontWeight: 600 }}>{player.assists}</div>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'fixtures' && (
            <motion.div
              key="fixtures"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {fixtures.map(fixture => {
                const isHome = fixture.homeTeamId === team.id;
                const isFinished = fixture.status === 'FINISHED';

                return (
                  <div
                    key={fixture.id}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '16px',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span className="font-display" style={{ fontSize: '0.7rem', color: '#FFD700', letterSpacing: '0.05em' }}>
                        Matchday {fixture.matchday}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {formatDate(fixture.date)} • {fixture.venue}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '220px', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: '0.9rem', color: isHome ? '#fff' : 'var(--text-secondary)', fontWeight: isHome ? 600 : 400 }}>
                          {fixture.homeTeamShort}
                        </span>
                        <TeamLogo name={fixture.homeTeamShort} logo={fixture.homeTeamLogo} size={24} />
                      </div>

                      <div style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: '#fff',
                        letterSpacing: '0.05em',
                      }}>
                        {isFinished ? (
                          `${fixture.homeScore} - ${fixture.awayScore}`
                        ) : (
                          formatTime(fixture.time)
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'flex-start' }}>
                        <TeamLogo name={fixture.awayTeamShort} logo={fixture.awayTeamLogo} size={24} />
                        <span style={{ fontSize: '0.9rem', color: !isHome ? '#fff' : 'var(--text-secondary)', fontWeight: !isHome ? 600 : 400 }}>
                          {fixture.awayTeamShort}
                        </span>
                      </div>
                    </div>

                    <div>
                      {isFinished ? (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '0.25rem 0.6rem', borderRadius: '12px' }}>FT</span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#00FF87', background: 'rgba(0,255,135,0.05)', padding: '0.25rem 0.6rem', borderRadius: '12px' }}>Upcoming</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
