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
  const sponsorList = sponsors;

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
            marginBottom: '2rem',
          }}
        >
          <div
            className="section-badge"
            style={{ margin: '0 auto' }}
          >
            🤝 Our Partners
          </div>
        </motion.div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem',
          }}
        >
          {sponsorList.map((sponsor) => (
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