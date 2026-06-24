'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, Calendar, BarChart3 } from 'lucide-react';
import { getCountdown } from '@/lib/utils';

interface NextMatch {
  id: string;
  matchday: number;
  date: string;
  time: string;
  homeTeam: { shortName: string };
  awayTeam: { shortName: string };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ textAlign: 'center', minWidth: '5rem' }}>
      <div className="countdown-digit">{String(value).padStart(2, '0')}</div>
      <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: '-0.25rem' }}>{label}</div>
    </div>
  );
}

function CountdownSeparator() {
  return (
    <div className="countdown-digit" style={{ alignSelf: 'flex-start', paddingTop: '0.25rem', opacity: 0.5 }}>:</div>
  );
}

function FloatingFootballs() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const particles = Array.from({ length: 8 });
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {particles.map((_, i) => {
        const size = Math.random() * 20 + 10;
        return (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-50px',
              width: size,
              height: size,
              background: 'transparent',
              fontSize: `${size}px`,
              animationDuration: `${Math.random() * 10 + 15}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3,
            }}
          >
            ⚽
          </div>
        );
      })}
    </div>
  );
}

export default function HeroSection({ nextMatch }: { nextMatch: NextMatch | null }) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nextMatch) return;
    const { date, time } = nextMatch;
    const update = () => setCountdown(getCountdown(date, time));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [nextMatch]);

  // Parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollY = window.scrollY;
      const bg = containerRef.current.querySelector('.hero-bg') as HTMLElement;
      if (bg) bg.style.transform = `translateY(${scrollY * 0.4}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background — deep void + ambient orbs */}
      <div
        className="hero-bg"
        style={{
          position: 'absolute',
          inset: '-20%',
          background: `
            radial-gradient(ellipse 70% 60% at 50% 20%, rgba(212,175,55,0.13) 0%, transparent 55%),
            radial-gradient(ellipse 50% 45% at 15% 55%, rgba(212,175,55,0.07) 0%, transparent 50%),
            radial-gradient(ellipse 55% 45% at 85% 55%, rgba(80,60,200,0.06) 0%, transparent 50%),
            radial-gradient(ellipse 80% 40% at 50% 100%, rgba(80,60,200,0.04) 0%, transparent 55%),
            linear-gradient(180deg, #04040A 0%, #08081A 40%, #06060F 70%, #04040A 100%)
          `,
        }}
      />

      {/* Stadium grid lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(212,175,55,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(212,175,55,0.015) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }} />

      {/* Stadium lights & sweeping effects */}
      <style>{`
        @keyframes sweep-left {
          0%, 100% { transform: rotate(-15deg) translateY(-10%); }
          50% { transform: rotate(5deg) translateY(0%); }
        }
        @keyframes sweep-right {
          0%, 100% { transform: rotate(15deg) translateY(-10%); }
          50% { transform: rotate(-5deg) translateY(0%); }
        }
        .floodlight {
          position: absolute;
          width: 40vw;
          height: 120vh;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(212, 175, 55, 0.02) 40%, transparent 80%);
          filter: blur(40px);
          pointer-events: none;
          transform-origin: top center;
        }
        .floodlight-left {
          top: -20%;
          left: -10%;
          animation: sweep-left 14s ease-in-out infinite;
        }
        .floodlight-right {
          top: -20%;
          right: -10%;
          animation: sweep-right 16s ease-in-out infinite;
        }
      `}</style>
      
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div className="floodlight floodlight-left" />
        <div className="floodlight floodlight-right" />
        {/* Core light sources */}
        <div style={{ position: 'absolute', top: '-10%', left: '10%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', top: '-10%', right: '10%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      </div>

      <FloatingFootballs />

<motion.img
  src="/league-logo.png"
  alt="League Background"
  initial={{
    opacity: 0,
    scale: 0.8,
  }}
  animate={{
    opacity: 0.25,
    scale: 1,
  }}
  transition={{
    duration: 2.5,
    ease: 'easeOut',
  }}
  style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '110vw',
    height: '110vh',
    objectFit: 'cover',
    translate: '-50% -50%',
    zIndex: 1,
    pointerEvents: 'none',
    filter: 'blur(6px) drop-shadow(0 0 50px rgba(212,175,55,0.1))',
  }}
/>
      {/* Overlay */}
      <div className="hero-gradient-overlay" style={{ position: 'absolute', inset: 0 }} />
       
<motion.div
  initial={{
    opacity: 1,
    scale: 0.8,
  }}
  animate={{
    opacity: 0,
    scale: 1.2,
  }}
  transition={{
    duration: 1.8,
    ease: 'easeOut',
  }}
  style={{
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000',
    zIndex: 100,
    pointerEvents: 'none',
  }}
>
  <img
    src="/league-logo.png"
    alt="League Logo"
    style={{
      width: '250px',
      height: '250px',
      objectFit: 'contain',
    }}
  />
</motion.div>
      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        padding: '3.5rem 2.5rem',
        maxWidth: '900px',
        background: 'rgba(4, 4, 10, 0.55)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRadius: '32px',
        border: '1px solid rgba(212,175,55,0.22)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 80px rgba(0,0,0,0.75), 0 0 60px rgba(212,175,55,0.07)'
      }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="section-badge"
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
          Season 08 · Matchday {nextMatch?.matchday ?? '—'}
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1.1 }}
        >
          <h1 className="font-display" style={{
            fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
            letterSpacing: '0.02em',
            lineHeight: 1.1,
            color: '#fff',
            textShadow: '0 0 80px rgba(212,175,55,0.08)',
          }}>
            THOZHUPADAM<br />
            <span className="gradient-text">SUPER LEAGUE</span><br />
            SEASON 08
          </h1>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="font-serif-luxury"
          style={{ color: 'var(--text-secondary)', fontSize: '1.4rem', letterSpacing: '0.02em', maxWidth: '500px', lineHeight: 1.6, margin: '0 auto' }}
        >
          The Legacy of TPM
        </motion.p>

        {/* Countdown */}
        {nextMatch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
              padding: '1.5rem 2.5rem',
              background: 'rgba(3,3,5,0.6)',
              backdropFilter: 'blur(30px)',
              border: '1px solid var(--border-gold)',
              borderRadius: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block', animation: 'pulse 1.5s ease infinite' }} />
              Next Match — MD{nextMatch.matchday}: {nextMatch.homeTeam.shortName} vs {nextMatch.awayTeam.shortName}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <CountdownUnit value={countdown.days} label="Days" />
              <CountdownSeparator />
              <CountdownUnit value={countdown.hours} label="Hrs" />
              <CountdownSeparator />
              <CountdownUnit value={countdown.minutes} label="Min" />
              <CountdownSeparator />
              <CountdownUnit value={countdown.seconds} label="Sec" />
            </div>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.6 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link href="/fixtures" className="btn-primary" id="hero-fixtures-btn">
            <Calendar size={16} />
            View Fixtures
          </Link>
          <Link href="/standings" className="btn-secondary" id="hero-standings-btn">
            <BarChart3 size={16} />
            League Table
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          color: 'rgba(255,255,255,0.3)',
        }}
      >
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}
