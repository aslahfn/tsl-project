'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  url: string;
  tier: string;
  description?: string | null;
}

function SponsorItem({ sponsor }: { sponsor: Sponsor }) {
  return (
    <a
      href={sponsor.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem 1.5rem',
        minWidth: '180px',
        flexShrink: 0,
        textDecoration: 'none',
      }}
    >
      {/* Sponsor Logo Container */}
      <div
        style={{
          width: '130px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          padding: '10px',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-green-bright)';
          e.currentTarget.style.background = 'rgba(212, 175, 55, 0.04)';
          const img = e.currentTarget.querySelector('img');
          if (img) {
            img.style.filter = 'grayscale(0%) opacity(1)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
          const img = e.currentTarget.querySelector('img');
          if (img) {
            img.style.filter = 'grayscale(100%) opacity(0.5)';
          }
        }}
      >
        <img
          src={sponsor.logo || '/placeholder-sponsor.png'}
          alt={sponsor.name}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              '/placeholder-sponsor.png';
          }}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            filter: 'grayscale(100%) opacity(0.5)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>

      {/* Sponsor Name */}
      <div
        style={{
          fontFamily: 'var(--font-bebas, Bebas Neue), sans-serif',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginTop: '0.6rem',
          letterSpacing: '0.05em',
        }}
      >
        {sponsor.name}
      </div>

      {/* Sponsor Tier / Description */}
      {sponsor.description && (
        <div
          style={{
            marginTop: '6px',
            padding: '2px 8px',
            background: 'rgba(212, 175, 55, 0.06)',
            border: '1px solid var(--border-gold)',
            borderRadius: '100px',
            color: 'var(--gold)',
            fontSize: '0.6rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            textAlign: 'center',
          }}
        >
          {sponsor.description}
        </div>
      )}
    </a>
  );
}

export default function SponsorsSection({
  sponsors,
}: {
  sponsors: Sponsor[];
}) {
  const [highlightIndex, setHighlightIndex] = useState(0);

  useEffect(() => {
    if (!sponsors || sponsors.length === 0) return;
    const interval = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % sponsors.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sponsors]);

  if (!sponsors || sponsors.length === 0) return null;

  const highlightedSponsor = sponsors[highlightIndex];

  return (
    <section
      style={{
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-gold)',
        borderBottom: '1px solid var(--border-gold)',
        padding: '4rem 0',
      }}
      id="sponsors"
    >
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: 'center',
            marginBottom: '3rem',
          }}
        >
          <div
            className="section-badge"
            style={{ margin: '0 auto' }}
          >
            🤝 Our Partners
          </div>
        </motion.div>

        {/* Featured Highlighted Sponsor Transition */}
        <div style={{ position: 'relative', height: 280, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={highlightedSponsor.id}
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(5px)' }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(10,10,20,0.8) 100%)',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: '1rem',
                padding: '2.5rem 4rem',
                boxShadow: '0 10px 40px -10px rgba(212,175,55,0.15)',
                position: 'absolute'
              }}
            >
              <div style={{ 
                fontSize: '0.75rem', color: 'var(--gold)', textTransform: 'uppercase', 
                letterSpacing: '0.2em', marginBottom: '1.5rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', boxShadow: '0 0 10px var(--gold)' }} />
                Featured Sponsor
              </div>
              
              <a href={highlightedSponsor.url || "#"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img 
                  src={highlightedSponsor.logo || '/placeholder-sponsor.png'} 
                  alt={highlightedSponsor.name}
                  style={{ height: 90, maxWidth: 250, objectFit: 'contain', marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} 
                />
                <div style={{ fontFamily: 'var(--font-bebas, Bebas Neue), sans-serif', fontSize: '1.8rem', color: '#fff', letterSpacing: '0.05em' }}>
                  {highlightedSponsor.name}
                </div>
                {highlightedSponsor.description && (
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
                    {highlightedSponsor.description}
                  </div>
                )}
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* All Sponsors Grid */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          {sponsors.map((sponsor) => (
            <SponsorItem
              key={sponsor.id}
              sponsor={sponsor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}