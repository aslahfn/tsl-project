'use client';

import { useState, useEffect } from 'react';

interface TeamLogoProps {
  name: string;
  logo?: string | null;
  logoUrl?: string | null;
  size?: number;
  className?: string;
}

const colorMap: Record<string, { bg: string; text: string }> = {
  PKD: { bg: 'rgba(255,215,0,0.15)',   text: '#FFD700' },
  ALM: { bg: 'rgba(255,215,0,0.15)',   text: '#FFD700' },
  KPM: { bg: 'rgba(255,107,53,0.15)',  text: '#FF6B35' },
  TGR: { bg: 'rgba(231,76,60,0.15)',   text: '#E74C3C' },
  LSF: { bg: 'rgba(52,152,219,0.15)',  text: '#3498DB' },
  LFC: { bg: 'rgba(243,156,18,0.15)',  text: '#F39C12' },
};

export default function TeamLogo({ name, logo, logoUrl, size = 48 }: TeamLogoProps) {
  const [imgError, setImgError] = useState(false);
  const colors = colorMap[name] || { bg: 'rgba(255,255,255,0.1)', text: '#fff' };
  const fontSize = size * 0.28;

  useEffect(() => {
    setImgError(false);
  }, [logo, logoUrl]);

  const actualLogo = logoUrl || logo;
  const shouldRenderImage = actualLogo && !imgError;

  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: '50%',
        background: colors.bg,
        border: `1px solid ${colors.text}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: `0 0 ${size * 0.3}px ${colors.text}22`,
      }}
    >
      {shouldRenderImage ? (
        <img
          src={actualLogo}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          style={{
            fontFamily: 'var(--font-bebas, Bebas Neue), sans-serif',
            fontSize,
            letterSpacing: '0.05em',
            color: colors.text,
            fontWeight: 400,
          }}
        >
          {name}
        </div>
      )}
    </div>
  );
}
