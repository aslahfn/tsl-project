'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, ChevronRight, Filter, Search, Shield, Target, Trophy, Zap } from 'lucide-react';
import TeamLogo from '@/components/ui/TeamLogo';
import PageHeader from '@/components/ui/PageHeader';
import Link from 'next/link';

interface Team {
  id: string;
  name: string;
  shortName: string;
}

interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  nationality: string;
  nationalityFlag: string;
  goals: number;
  assists: number;
  matches: number;
  cleanSheets: number;
  rating: number;
  teamId: string;
  team: Team;
  photo?: string;
}

export default function PlayersPageClient({ players, teams }: { players: Player[]; teams: Team[] }) {
  const [selectedTeam, setSelectedTeam] = useState<string>('ALL');
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'goals' | 'assists' | 'name'>('goals');

  const topScorers = useMemo(() => {
    return [...players].sort((a, b) => b.goals - a.goals).slice(0, 3);
  }, [players]);

  const topAssists = useMemo(() => {
    return [...players].sort((a, b) => b.assists - a.assists).slice(0, 3);
  }, [players]);

  const topGoalkeepers = useMemo(() => {
    return [...players]
      .filter(p => p.position === 'GK')
      .sort((a, b) => (b.cleanSheets || 0) - (a.cleanSheets || 0))
      .slice(0, 3);
  }, [players]);

  const filteredPlayers = useMemo(() => {
    return players
      .filter(player => {
        const matchesTeam = selectedTeam === 'ALL' || player.teamId === selectedTeam;
        const matchesPosition = selectedPosition === 'ALL' || player.position === selectedPosition;
        const matchesSearch = searchQuery === '' || player.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTeam && matchesPosition && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'goals') return b.goals - a.goals;
        if (sortBy === 'assists') return b.assists - a.assists;
        return a.name.localeCompare(b.name);
      });
  }, [players, selectedTeam, selectedPosition, searchQuery, sortBy]);

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '5rem' }}>
      <PageHeader
        badge="⚡ League Superstars"
        title="Players &"
        titleHighlight="Statistics"
        description="Check out top performance leaderboards, goals, assists, clean sheets, and player standings."
      />

      <div className="container-wide" style={{ marginTop: '3rem' }}>
        {/* Leaderboards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
          gap: '2rem',
          marginBottom: '4rem',
        }}>
          {/* Goals Leaderboard */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px',
            padding: '1.5rem 2rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Target size={20} color="#FFD700" />
              <h3 className="font-display" style={{ fontSize: '1.25rem', color: '#fff', letterSpacing: '0.05em' }}>Top Goalscorers</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {topScorers.map((player, idx) => (
                <div key={player.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.03)' : 'none', paddingBottom: idx < 2 ? '1rem' : '0' }}>
                  <span className="font-display" style={{ fontSize: '1.5rem', color: idx === 0 ? '#FFD700' : 'var(--text-muted)', width: '24px' }}>#{idx + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{player.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <TeamLogo name={player.team.shortName} size={14} />
                      <span>{player.team.name}</span>
                    </div>
                  </div>
                  <div className="font-display" style={{ fontSize: '1.5rem', color: '#FFD700', fontWeight: 700 }}>
                    {player.goals} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'sans-serif' }}>G</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assists Leaderboard */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px',
            padding: '1.5rem 2rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Zap size={20} color="#FFD700" />
              <h3 className="font-display" style={{ fontSize: '1.25rem', color: '#fff', letterSpacing: '0.05em' }}>Playmakers (Assists)</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {topAssists.map((player, idx) => (
                <div key={player.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.03)' : 'none', paddingBottom: idx < 2 ? '1rem' : '0' }}>
                  <span className="font-display" style={{ fontSize: '1.5rem', color: idx === 0 ? '#FFD700' : 'var(--text-muted)', width: '24px' }}>#{idx + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{player.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <TeamLogo name={player.team.shortName} size={14} />
                      <span>{player.team.name}</span>
                    </div>
                  </div>
                  <div className="font-display" style={{ fontSize: '1.5rem', color: '#FFD700', fontWeight: 700 }}>
                    {player.assists} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'sans-serif' }}>A</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goalkeepers Leaderboard */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px',
            padding: '1.5rem 2rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Shield size={20} color="#00C0FF" />
              <h3 className="font-display" style={{ fontSize: '1.25rem', color: '#fff', letterSpacing: '0.05em' }}>Golden Glove (Clean Sheets)</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {topGoalkeepers.map((player, idx) => (
                <div key={player.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.03)' : 'none', paddingBottom: idx < 2 ? '1rem' : '0' }}>
                  <span className="font-display" style={{ fontSize: '1.5rem', color: idx === 0 ? '#FFD700' : 'var(--text-muted)', width: '24px' }}>#{idx + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{player.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <TeamLogo name={player.team.shortName} size={14} />
                      <span>{player.team.name}</span>
                    </div>
                  </div>
                  <div className="font-display" style={{ fontSize: '1.5rem', color: '#00C0FF', fontWeight: 700 }}>
                    {player.cleanSheets || 0} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'sans-serif' }}>CS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          padding: '1.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Left: Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', flex: 1, minWidth: '280px' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 200px' }}>
              <Search size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search player name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 1rem 0.6rem 2.25rem',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Team Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={14} color="#FFD700" />
              <select
                value={selectedTeam}
                onChange={e => setSelectedTeam(e.target.value)}
                style={{
                  padding: '0.6rem 1.5rem 0.6rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '16px',
                }}
              >
                <option value="ALL">All Teams</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>

            {/* Position Filter */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', background: 'rgba(0,0,0,0.2)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              {['ALL', 'GK', 'DEF', 'MID', 'FWD'].map(pos => (
                <button
                  key={pos}
                  onClick={() => setSelectedPosition(pos)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: selectedPosition === pos ? '#FFD700' : 'transparent',
                    color: selectedPosition === pos ? '#000' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Sorting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={14} color="#FFD700" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'goals' | 'assists' | 'name')}
              style={{
                padding: '0.6rem 1.5rem 0.6rem 1rem',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '0.875rem',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '16px',
              }}
            >
              <option value="goals">Goals</option>
              <option value="assists">Assists</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Players Grid */}
        {filteredPlayers.length > 0 ? (
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
              gap: '1.5rem',
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredPlayers.map((player, idx) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                  whileHover={{ y: -6 }}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >




                  <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    {/* Avatar Photo */}
                    <div style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      margin: '0 auto 1rem auto',
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
                        className="avatar-fallback font-display" 
                        style={{ 
                          display: player.photo ? 'none' : 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%',
                          fontSize: '1.6rem',
                          color: '#FFD700',
                          fontWeight: 700 
                        }}
                      >
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>

                    <span style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'var(--text-secondary)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}>{player.position}</span>

                    <h4 style={{ fontSize: '1.1rem', color: '#fff', marginTop: '0.75rem', marginBottom: '0.25rem' }}>
                      {player.name}
                    </h4>

                    {/* Team badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <TeamLogo name={player.team.shortName} size={14} />
                        <span>{player.team.name}</span>
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.5rem',
                    background: 'rgba(0,0,0,0.25)',
                    padding: '0.65rem',
                    borderRadius: '10px',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    marginBottom: '1rem',
                  }}>
                    {player.position === 'GK' ? (
                      <>
                        <div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Saves</div>
                          <div style={{ color: '#00C0FF', fontWeight: 600 }}>{player.cleanSheets || 0}</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>CleanSh</div>
                          <div style={{ color: '#FFD700', fontWeight: 600 }}>{player.cleanSheets || 0}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Goals</div>
                          <div style={{ color: '#FFD700', fontWeight: 600 }}>{player.goals}</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Assists</div>
                          <div style={{ color: '#FFD700', fontWeight: 600 }}>{player.assists}</div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* View Profile Button */}
                  <Link href={`/players/${player.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = '#FFD700';
                        e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)';
                        e.currentTarget.style.background = 'rgba(255,215,0,0.02)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      }}
                    >
                      <span>View Full Profile</span>
                      <ChevronRight size={14} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.03)',
            borderRadius: '16px',
            color: 'var(--text-secondary)',
          }}>
            <Trophy size={48} color="rgba(255,255,255,0.2)" style={{ marginBottom: '1rem', display: 'inline-block' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No Players Found</h3>
            <p style={{ fontSize: '0.875rem' }}>Try modifying your filter options or search queries.</p>
          </div>
        )}
      </div>
    </div>
  );
}
