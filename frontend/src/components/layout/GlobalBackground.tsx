'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function GlobalBackground() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    let ticking = false;

    const updateBlur = () => {
      if (overlayRef.current) {
        const blurAmount = Math.min(window.scrollY / 50, 12);
        overlayRef.current.style.backdropFilter = `blur(${blurAmount}px)`;
        overlayRef.current.style.setProperty('-webkit-backdrop-filter', `blur(${blurAmount}px)`);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateBlur);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once on mount
    updateBlur();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Avoid rendering on the server to prevent hydration mismatch with usePathname
  if (!mounted) return null;

  // The homepage already has a dedicated hero background.
  if (pathname === '/') return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'var(--bg-void)', // Fallback deep dark background
      }}
    >
      {/* 
        The actual image layer with ken-burns animation.
        Opacity is increased to 35% to be more visible.
      */}
      <div
        className="global-bg-anim"
        style={{
          position: 'absolute',
          top: '-5%',
          left: '-5%',
          width: '110%',
          height: '110%',
          backgroundImage: "url('/football-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.4,
          filter: 'blur(8px)',
        }}
      />
      
      {/* 
        Dark overlay to improve contrast, now lighter (30%) 
        and adds dynamic backdrop blur on scroll.
      */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: `blur(0px)`,
          WebkitBackdropFilter: `blur(0px)`,
        }}
      />

      {/* Cinematic Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8), inset 0 0 300px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
