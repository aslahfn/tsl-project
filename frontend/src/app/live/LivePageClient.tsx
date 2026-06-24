'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRealTime } from '@/hooks/useRealTime';
import TeamLogo from '@/components/ui/TeamLogo';

function getEmbedUrl(url: string) {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  }
  if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`;
  return url;
}

function StreamPlayer({ url }: { url: string }) {
  if (!url) return null;
  const embedUrl = getEmbedUrl(url);
  const isMjpeg = url.endsWith('/video') || url.endsWith('.mjpg') || url.endsWith('/stream');

  if (isMjpeg) {
    return (
      <img 
        src={embedUrl} 
        alt="Live Stream" 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} 
      />
    );
  }

  return (
    <iframe
      src={embedUrl}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
}

export default function LivePageClient({ initialMatch }: { initialMatch: any }) {
  const [match, setMatch] = useState(initialMatch);

  // useRealTime triggers events, we listen to custom events dispatched by the hook
  useRealTime();

  useEffect(() => {
    const handleScoreUpdate = (e: any) => {
      const payload = e.detail;
      if (match && payload.fixtureId === match.id) {
        setMatch((prev: any) => ({ ...prev, homeScore: payload.homeScore, awayScore: payload.awayScore, status: payload.status }));
      }
    };
    window.addEventListener('score-update', handleScoreUpdate);
    return () => window.removeEventListener('score-update', handleScoreUpdate);
  }, [match]);

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="section-title">Live <span className="gradient-text">TV</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Watch the action as it unfolds.</p>
        </div>

        {match && match.status === 'LIVE' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {match.streamUrl ? (
              <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', borderRadius: '1rem', overflow: 'hidden', border: '2px solid rgba(255,59,59,0.5)', boxShadow: '0 10px 40px rgba(255,59,59,0.3)' }}>
                <StreamPlayer url={match.streamUrl} />
              </div>
            ) : (
              <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-gold)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>Match is Live!</h3>
                <p style={{ color: 'var(--text-muted)' }}>No live stream video available for this match.</p>
              </div>
            )}

            {/* Live Score Strip */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', padding: '1.5rem', background: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-gold)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{match.homeTeam.shortName}</span>
                <TeamLogo name={match.homeTeam.shortName} logo={match.homeTeam.logo} size={48} />
              </div>

              <div className="font-display" style={{ fontSize: '2.5rem', color: '#FF3B3B', textShadow: '0 0 20px rgba(255,59,59,0.5)' }}>
                {match.homeScore ?? 0} - {match.awayScore ?? 0}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <TeamLogo name={match.awayTeam.shortName} logo={match.awayTeam.logo} size={48} />
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{match.awayTeam.shortName}</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '6rem 2rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-gold)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fff' }}>No Live Broadcasts</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>There are currently no live matches being streamed. Check the <a href="/fixtures" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>fixtures</a> for upcoming games.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
