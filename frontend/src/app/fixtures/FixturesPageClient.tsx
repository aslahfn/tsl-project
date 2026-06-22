'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Filter, Info, MapPin, Search } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';
import TeamLogo from '@/components/ui/TeamLogo';
import PageHeader from '@/components/ui/PageHeader';
import { useRealTime } from '@/hooks/useRealTime';

interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string | null;
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
  homeTeamId: string;
  awayTeamId: string;
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
}

export default function FixturesPageClient({ fixtures, teams }: { fixtures: Fixture[]; teams: Team[] }) {
  const [selectedTeam, setSelectedTeam] = useState<string>('ALL');
  const [selectedMatchday, setSelectedMatchday] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useRealTime();

  const matchdays = Array.from(new Set(fixtures.map(f => f.matchday))).sort((a, b) => a - b);

  const filteredFixtures = fixtures.filter(fixture => {
    const matchesTeam = selectedTeam === 'ALL' || 
      fixture.homeTeamId === selectedTeam || 
      fixture.awayTeamId === selectedTeam;
    const matchesMatchday = selectedMatchday === 'ALL' || 
      fixture.matchday.toString() === selectedMatchday;
    const matchesSearch = searchQuery === '' || 
      fixture.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fixture.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fixture.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesMatchday && matchesSearch;
  });

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '5rem' }}>
      <PageHeader
        badge="📅 Match Schedule"
        title="Fixtures &"
        titleHighlight="Results"
        description="Follow every kickoff, live score, and full-time result across the season."
      />

      <div className="container-wide" style={{ marginTop: '2.5rem' }}>
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
            <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '150px' }}>
              <Search size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search teams or venue..."
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
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#FFD700'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Team Selector */}
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

            {/* Matchday Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarIcon size={14} color="#FFD700" />
              <select
                value={selectedMatchday}
                onChange={e => setSelectedMatchday(e.target.value)}
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
                <option value="ALL">All Matchdays</option>
                {matchdays.map(md => (
                  <option key={md} value={md.toString()}>Matchday {md}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: Results Count */}
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Showing <span style={{ color: '#FFD700', fontWeight: 600 }}>{filteredFixtures.length}</span> fixtures
          </div>
        </div>

        {/* Fixtures List */}
        {filteredFixtures.length > 0 ? (
          <motion.div
            layout
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <AnimatePresence mode="popLayout">
              {filteredFixtures.map((fixture, idx) => {
                const isFinished = fixture.status === 'FINISHED';
                const isLive = fixture.status === 'LIVE';
                
                const hasSplitScorers = fixture.goalScorers && fixture.goalScorers.includes('|');
                const homeScorers = hasSplitScorers ? fixture.goalScorers!.split('|')[0].trim() : '';
                const awayScorers = hasSplitScorers ? fixture.goalScorers!.split('|')[1].trim() : '';

                const hasSplitYellows = fixture.yellowCards && fixture.yellowCards.includes('|');
                const homeYellows = hasSplitYellows ? fixture.yellowCards!.split('|')[0].trim() : '';
                const awayYellows = hasSplitYellows ? fixture.yellowCards!.split('|')[1].trim() : '';

                const hasSplitReds = fixture.redCards && fixture.redCards.includes('|');
                const homeReds = hasSplitReds ? fixture.redCards!.split('|')[0].trim() : '';
                const awayReds = hasSplitReds ? fixture.redCards!.split('|')[1].trim() : '';

                return (
                  <motion.div
                    key={fixture.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    whileHover={{
                      borderColor: 'rgba(255,215,0,0.25)',
                      background: 'rgba(255,255,255,0.04)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                    }}
                  >
                    {/* Glow backdrop for live matches */}
                    {isLive && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '4px',
                        height: '100%',
                        background: '#FF3B3B',
                      }} />
                    )}

                    {/* Main Row container */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1.5rem',
                      width: '100%'
                    }}>
                      {/* Match Details: Date, Matchday, Venue */}
                      <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <span className="font-display" style={{
                            color: '#FFD700',
                            fontSize: '0.75rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                          }}>
                            Matchday {fixture.matchday}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {formatDate(fixture.date)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                          <MapPin size={12} color="rgba(255,255,255,0.4)" />
                          <span>{fixture.venue}</span>
                        </div>
                      </div>

                      {/* Core Matchup & Scores */}
                      <div style={{
                        flex: '2 1 400px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1.5rem',
                        minWidth: '280px',
                      }}>
                        {/* Home Team */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-end', textAlign: 'right', width: '100%' }}>
                            <span className="font-display" style={{ fontSize: '1.15rem', color: '#fff' }}>
                              {fixture.homeTeam.name}
                            </span>
                            <TeamLogo name={fixture.homeTeam.shortName} logo={fixture.homeTeam.logo} size={36} />
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.15rem', width: '100%' }}>
                            {hasSplitScorers && homeScorers && homeScorers.split(',').map((s, i) => <div key={`g-${i}`}>{s.trim()} <span style={{ fontSize: '0.55rem' }}>⚽</span></div>)}
                            {hasSplitYellows && homeYellows && homeYellows.split(',').map((s, i) => <div key={`y-${i}`}>{s.trim()} <span style={{ display: 'inline-block', width: '6px', height: '9px', background: '#FFD700', borderRadius: '1.5px' }} /></div>)}
                            {hasSplitReds && homeReds && homeReds.split(',').map((s, i) => <div key={`r-${i}`}>{s.trim()} <span style={{ display: 'inline-block', width: '6px', height: '9px', background: '#FF3B3B', borderRadius: '1.5px' }} /></div>)}
                          </div>
                        </div>

                        {/* Score Box */}
                        <div style={{
                          background: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '10px',
                          padding: '0.5rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.8rem',
                          minWidth: '100px',
                        }}>
                          {isFinished ? (
                            <>
                              <span className="font-display" style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 600 }}>{fixture.homeScore}</span>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>FT</span>
                              <span className="font-display" style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 600 }}>{fixture.awayScore}</span>
                            </>
                          ) : isLive ? (
                            <>
                              <span className="font-display" style={{ fontSize: '1.5rem', color: '#FF3B3B', fontWeight: 600 }}>{fixture.homeScore}</span>
                              <span style={{
                                background: '#FF3B3B',
                                color: '#fff',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                textTransform: 'uppercase',
                                animation: 'pulse 1.5s infinite',
                              }}>Live</span>
                              <span className="font-display" style={{ fontSize: '1.5rem', color: '#FF3B3B', fontWeight: 600 }}>{fixture.awayScore}</span>
                            </>
                          ) : (
                            <span className="font-display" style={{ fontSize: '1rem', color: '#FFD700', letterSpacing: '0.05em' }}>
                              {formatTime(fixture.time)}
                            </span>
                          )}
                        </div>

                        {/* Away Team */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem', flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-start', textAlign: 'left', width: '100%' }}>
                            <TeamLogo name={fixture.awayTeam.shortName} logo={fixture.awayTeam.logo} size={36} />
                            <span className="font-display" style={{ fontSize: '1.15rem', color: '#fff' }}>
                              {fixture.awayTeam.name}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.15rem', width: '100%' }}>
                            {hasSplitScorers && awayScorers && awayScorers.split(',').map((s, i) => <div key={`g-${i}`}><span style={{ fontSize: '0.55rem' }}>⚽</span> {s.trim()}</div>)}
                            {hasSplitYellows && awayYellows && awayYellows.split(',').map((s, i) => <div key={`y-${i}`}><span style={{ display: 'inline-block', width: '6px', height: '9px', background: '#FFD700', borderRadius: '1.5px' }} /> {s.trim()}</div>)}
                            {hasSplitReds && awayReds && awayReds.split(',').map((s, i) => <div key={`r-${i}`}><span style={{ display: 'inline-block', width: '6px', height: '9px', background: '#FF3B3B', borderRadius: '1.5px' }} /> {s.trim()}</div>)}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div style={{ flex: '1 1 120px', display: 'flex', justifyContent: 'flex-end' }}>
                        {isFinished ? (
                          <div style={{
                            fontSize: '0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'var(--text-secondary)',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}>
                            <Info size={12} />
                            <span>Full Time</span>
                          </div>
                        ) : isLive ? (
                          <div style={{
                            fontSize: '0.75rem',
                            background: 'rgba(255,59,59,0.1)',
                            border: '1px solid rgba(255,59,59,0.3)',
                            color: '#FF3B3B',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '20px',
                            fontWeight: 600,
                          }}>
                            Second Half
                          </div>
                        ) : (
                          <div style={{
                            fontSize: '0.75rem',
                            background: 'rgba(255,215,0,0.05)',
                            border: '1px solid rgba(255,215,0,0.2)',
                            color: '#FFD700',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '20px',
                          }}>
                            Upcoming
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Detailed info below the row for FINISHED matches */}
                    {isFinished && (
                      <div style={{
                        width: '100%',
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px dashed rgba(255,255,255,0.08)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
                        gap: '1.25rem',
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.85)'
                      }}>
                        {/* Left column: Scorers & Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {!hasSplitScorers && fixture.goalScorers && fixture.goalScorers.trim() !== '' && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                              <span>⚽</span>
                              <div>
                                <span style={{ color: 'var(--text-muted)', marginRight: '0.25rem' }}>Goals:</span>
                                <span style={{ fontWeight: 500, color: '#FFF' }}>{fixture.goalScorers}</span>
                              </div>
                            </div>
                          )}

                          {!hasSplitYellows && fixture.yellowCards && fixture.yellowCards.trim() !== '' && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                              <span style={{
                                display: 'inline-block',
                                width: '8px',
                                height: '12px',
                                background: '#FFD700',
                                borderRadius: '2px',
                                marginTop: '3px'
                              }} />
                              <div>
                                <span style={{ color: 'var(--text-muted)', marginRight: '0.25rem' }}>Yellow Cards:</span>
                                <span>{fixture.yellowCards}</span>
                              </div>
                            </div>
                          )}

                          {!hasSplitReds && fixture.redCards && fixture.redCards.trim() !== '' && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                              <span style={{
                                display: 'inline-block',
                                width: '8px',
                                height: '12px',
                                background: '#FF3B3B',
                                borderRadius: '2px',
                                marginTop: '3px'
                              }} />
                              <div>
                                <span style={{ color: 'var(--text-muted)', marginRight: '0.25rem' }}>Red Cards:</span>
                                <span style={{ color: '#FF3B3B' }}>{fixture.redCards}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right column: MOTM & Details & Report */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {fixture.manOfTheMatch && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              background: 'rgba(255,215,0,0.04)',
                              border: '1px solid rgba(255,215,0,0.12)',
                              padding: '0.35rem 0.6rem',
                              borderRadius: '6px'
                            }}>
                              <span style={{ color: '#FFD700' }}>★</span>
                              <div>
                                <span style={{ color: '#FFD700', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', marginRight: '0.25rem' }}>Man of the Match:</span>
                                <span style={{ fontWeight: 600, color: '#fff' }}>{fixture.manOfTheMatch.name}</span>
                              </div>
                            </div>
                          )}



                          {fixture.matchReport && fixture.matchReport.trim() !== '' && (
                            <div style={{
                              background: 'rgba(0,0,0,0.15)',
                              borderLeft: '2px solid #FFD700',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '0 6px 6px 0',
                              fontStyle: 'italic',
                              color: 'rgba(255,255,255,0.75)',
                              lineHeight: 1.4,
                              fontSize: '0.75rem',
                              marginTop: '0.25rem'
                            }}>
                              &quot;{fixture.matchReport}&quot;
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
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
            <CalendarIcon size={48} color="rgba(255,255,255,0.2)" style={{ marginBottom: '1rem', display: 'inline-block' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No Matches Found</h3>
            <p style={{ fontSize: '0.875rem' }}>Try refining your filters or search query to find fixtures.</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
