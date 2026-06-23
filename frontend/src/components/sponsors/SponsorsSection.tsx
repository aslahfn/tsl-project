'use client';

import { motion } from 'framer-motion';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  url: string;
  tier: string;
  description?: string | null;
}

function SponsorCard({ sponsor, size = 'medium' }: { sponsor: Sponsor, size?: 'large' | 'medium' | 'small' }) {
  const dimensions = {
    large: { width: '100%', maxWidth: '400px', height: '160px', logoHeight: '80px', fontSize: '1.5rem' },
    medium: { width: '100%', maxWidth: '280px', height: '120px', logoHeight: '60px', fontSize: '1.2rem' },
    small: { width: '100%', maxWidth: '200px', height: '90px', logoHeight: '45px', fontSize: '1rem' }
  }[size];

  return (
    <a
      href={sponsor.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
    >
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: dimensions.width,
          maxWidth: dimensions.maxWidth,
          height: dimensions.height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          border: size === 'large' ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: size === 'large' ? '0 10px 30px rgba(212,175,55,0.05)' : 'none',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(145deg, rgba(212,175,55,0.08) 0%, rgba(255,255,255,0.02) 100%)';
          e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)';
          const img = e.currentTarget.querySelector('img');
          if (img) img.style.filter = 'grayscale(0%) opacity(1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)';
          e.currentTarget.style.borderColor = size === 'large' ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.05)';
          const img = e.currentTarget.querySelector('img');
          if (img) img.style.filter = 'grayscale(100%) opacity(0.6)';
        }}
      >
        <img
          src={sponsor.logo || '/placeholder-sponsor.png'}
          alt={sponsor.name}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder-sponsor.png'; }}
          style={{
            maxHeight: dimensions.logoHeight,
            maxWidth: '100%',
            objectFit: 'contain',
            filter: 'grayscale(100%) opacity(0.6)',
            transition: 'all 0.4s ease',
            marginBottom: '0.75rem'
          }}
        />
        <div style={{
          fontFamily: 'var(--font-bebas, Bebas Neue), sans-serif',
          fontSize: dimensions.fontSize,
          color: size === 'large' ? 'var(--gold)' : 'var(--text-secondary)',
          letterSpacing: '0.05em',
          textAlign: 'center',
          transition: 'color 0.3s ease'
        }}>
          {sponsor.name}
        </div>
      </motion.div>
    </a>
  );
}

export default function SponsorsSection({ sponsors }: { sponsors: Sponsor[] }) {
  if (!sponsors || sponsors.length === 0) return null;

  const titleSponsors = sponsors.filter(s => s.tier.toUpperCase().includes('TITLE'));
  const goldSponsors = sponsors.filter(s => s.tier.toUpperCase().includes('GOLD'));
  const otherSponsors = sponsors.filter(s => !s.tier.toUpperCase().includes('TITLE') && !s.tier.toUpperCase().includes('GOLD'));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <section
      style={{
        background: 'linear-gradient(180deg, var(--bg-primary) 0%, rgba(10,10,15,1) 100%)',
        borderTop: '1px solid rgba(212,175,55,0.2)',
        borderBottom: '1px solid rgba(212,175,55,0.2)',
        padding: '6rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}
      id="sponsors"
    >
      {/* Background Orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(212,175,55,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(80,60,200,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container-wide" style={{ position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <div className="section-badge" style={{ margin: '0 auto' }}>🤝 Official Partners</div>
          <h2 className="section-title" style={{ marginTop: '1rem', fontSize: '3rem' }}>POWERED BY EXCELLENCE</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '1rem auto 0' }}>
            We are proud to be supported by brands that share our passion for the beautiful game and community development.
          </p>
        </motion.div>

        {titleSponsors.length > 0 && (
          <div style={{ marginBottom: '4rem' }}>
            <h3 style={{ textAlign: 'center', color: 'var(--gold)', fontSize: '1rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>Title Sponsor</h3>
            <motion.div 
              variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}
              style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}
            >
              {titleSponsors.map(sponsor => (
                <motion.div key={sponsor.id} variants={itemVariants}>
                  <SponsorCard sponsor={sponsor} size="large" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {goldSponsors.length > 0 && (
          <div style={{ marginBottom: '4rem' }}>
            <h3 style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Gold Sponsors</h3>
            <motion.div 
              variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}
              style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}
            >
              {goldSponsors.map(sponsor => (
                <motion.div key={sponsor.id} variants={itemVariants}>
                  <SponsorCard sponsor={sponsor} size="medium" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {otherSponsors.length > 0 && (
          <div>
            <h3 style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Official Partners</h3>
            <motion.div 
              variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}
              style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}
            >
              {otherSponsors.map(sponsor => (
                <motion.div key={sponsor.id} variants={itemVariants}>
                  <SponsorCard sponsor={sponsor} size="small" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}