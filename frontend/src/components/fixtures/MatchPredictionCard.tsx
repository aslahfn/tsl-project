'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PredictionProps {
  fixtureId: string;
  homeTeamName: string;
  awayTeamName: string;
  predictions: { id: string; predictedResult: string }[];
}

export default function MatchPredictionCard({ fixtureId, homeTeamName, awayTeamName, predictions }: PredictionProps) {
  const [hasVotedLocally, setHasVotedLocally] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<'HOME' | 'AWAY' | 'DRAW' | null>(null);
  const [voterName, setVoterName] = useState('');
  const [voterContact, setVoterContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate percentages
  const totalVotes = predictions.length + (hasVotedLocally ? 1 : 0);
  
  // To account for local optimistic update
  const homeVotes = predictions.filter(p => p.predictedResult === 'HOME').length + (hasVotedLocally && selectedResult === 'HOME' ? 1 : 0);
  const awayVotes = predictions.filter(p => p.predictedResult === 'AWAY').length + (hasVotedLocally && selectedResult === 'AWAY' ? 1 : 0);
  const drawVotes = predictions.filter(p => p.predictedResult === 'DRAW').length + (hasVotedLocally && selectedResult === 'DRAW' ? 1 : 0);

  const homePct = totalVotes === 0 ? 0 : Math.round((homeVotes / totalVotes) * 100);
  const awayPct = totalVotes === 0 ? 0 : Math.round((awayVotes / totalVotes) * 100);
  const drawPct = totalVotes === 0 ? 0 : Math.round((drawVotes / totalVotes) * 100);

  const handleVoteClick = (result: 'HOME' | 'AWAY' | 'DRAW') => {
    if (hasVotedLocally) return;
    setSelectedResult(result);
    setShowModal(true);
  };

  const submitPrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voterName || !voterContact || !selectedResult) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fixtureId, voterName, voterContact, predictedResult: selectedResult }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit prediction');
      }

      setHasVotedLocally(true);
      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h4 style={{ fontSize: '0.85rem', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Audience Prediction</h4>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{totalVotes} Votes</span>
      </div>

      {/* Voting Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={() => handleVoteClick('HOME')}
          disabled={hasVotedLocally}
          style={{
            background: hasVotedLocally && selectedResult === 'HOME' ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.03)',
            border: hasVotedLocally && selectedResult === 'HOME' ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
            padding: '0.6rem', borderRadius: '8px', color: '#fff', cursor: hasVotedLocally ? 'default' : 'pointer',
            transition: 'all 0.2s', fontSize: '0.8rem', fontWeight: 600
          }}
        >
          {homeTeamName} Win
        </button>
        <button
          onClick={() => handleVoteClick('DRAW')}
          disabled={hasVotedLocally}
          style={{
            background: hasVotedLocally && selectedResult === 'DRAW' ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.03)',
            border: hasVotedLocally && selectedResult === 'DRAW' ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
            padding: '0.6rem 1rem', borderRadius: '8px', color: 'rgba(255,255,255,0.6)', cursor: hasVotedLocally ? 'default' : 'pointer',
            transition: 'all 0.2s', fontSize: '0.8rem'
          }}
        >
          Draw
        </button>
        <button
          onClick={() => handleVoteClick('AWAY')}
          disabled={hasVotedLocally}
          style={{
            background: hasVotedLocally && selectedResult === 'AWAY' ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.03)',
            border: hasVotedLocally && selectedResult === 'AWAY' ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
            padding: '0.6rem', borderRadius: '8px', color: '#fff', cursor: hasVotedLocally ? 'default' : 'pointer',
            transition: 'all 0.2s', fontSize: '0.8rem', fontWeight: 600
          }}
        >
          {awayTeamName} Win
        </button>
      </div>

      {/* Progress Bar */}
      {totalVotes > 0 && (
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', display: 'flex', overflow: 'hidden' }}>
          <div style={{ width: `${homePct}%`, background: '#22c55e', transition: 'width 1s ease' }} title={`Home: ${homePct}%`} />
          <div style={{ width: `${drawPct}%`, background: '#eab308', transition: 'width 1s ease' }} title={`Draw: ${drawPct}%`} />
          <div style={{ width: `${awayPct}%`, background: '#3b82f6', transition: 'width 1s ease' }} title={`Away: ${awayPct}%`} />
        </div>
      )}
      
      {totalVotes > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.4rem' }}>
          <span style={{ color: '#22c55e' }}>{homePct}%</span>
          <span style={{ color: '#eab308' }}>{drawPct}%</span>
          <span style={{ color: '#3b82f6' }}>{awayPct}%</span>
        </div>
      )}

      {/* Prediction Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border-gold)',
              padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '400px',
              position: 'relative'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>Enter Lucky Draw</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Submit your prediction to enter the Lucky Draw. Winners are announced after the match!
            </p>
            
            <form onSubmit={submitPrediction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Your Name</label>
                <input
                  type="text" required value={voterName} onChange={e => setVoterName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem' }}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Phone Number or Email</label>
                <input
                  type="text" required value={voterContact} onChange={e => setVoterContact(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem' }}
                  placeholder="e.g. +91 9876543210"
                />
              </div>
              
              {error && <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>{error}</div>}
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: '0.75rem', background: '#FFD700', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 600, cursor: 'pointer' }}>
                  {loading ? 'Submitting...' : 'Submit Prediction'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
