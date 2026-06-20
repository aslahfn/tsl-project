'use client';

import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  fallback: React.ReactNode;
}

export function SafeImage({ src, alt, style, fallback }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src || src.startsWith('placeholder')) {
    return <>{fallback}</>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      style={style}
      onError={() => setFailed(true)}
    />
  );
}
