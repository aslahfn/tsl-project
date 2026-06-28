'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 400);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 5;
      });
    }, 15);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="loading-screen"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'var(--bg-void)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Ambient Glow Orbs behind the loader */}
          <div className="orb orb-gold" style={{ width: '50vw', height: '50vw', top: '-15%', left: '-10%', opacity: 0.4 }} />
          <div className="orb orb-blue" style={{ width: '40vw', height: '40vw', bottom: '-5%', right: '-10%', opacity: 0.3 }} />

          <motion.div
            className="glass-2"
            style={{
              padding: '4rem 5rem',
              borderRadius: 'var(--radius-xl, 32px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3rem',
              position: 'relative',
              boxShadow: 'var(--shadow-xl, 0 30px 60px rgba(0, 0, 0, 0.8))',
              border: '1px solid var(--border-soft)',
            }}
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Logo Wrapper */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative"
            >
              {/* Spinning Premium Ring */}
              <div
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  borderTop: '2px solid var(--gold-bright)',
                  borderRight: '2px solid transparent',
                  borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
                  borderLeft: '2px solid transparent',
                  animation: 'spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
                  position: 'absolute',
                  inset: -15,
                  boxShadow: '0 0 25px rgba(212,175,55,0.15), inset 0 0 15px rgba(212,175,55,0.1)',
                }}
              />
              
              {/* Logo Mark with Pulse Glow */}
              <div
                className="pulse-glow"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'var(--glass-1)',
                  border: '1px solid var(--border-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  padding: '2px',
                  boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.6)',
                }}
              >
                <img 
                  src="/logo.png" 
                  alt="TSL Logo" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }} 
                />
              </div>
            </motion.div>

            {/* Typography */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}
            >
              <div style={{
                fontFamily: 'var(--font-bebas, Bebas Neue), sans-serif',
                fontSize: '2rem',
                letterSpacing: '0.35em',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                textShadow: '0 4px 25px rgba(0,0,0,0.6)',
              }}>
                Super League
              </div>
              <div className="gradient-text" style={{
                fontFamily: 'var(--font-bebas, Bebas Neue), sans-serif',
                fontSize: '1.15rem',
                letterSpacing: '0.6em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}>
                Season 08
              </div>
            </motion.div>

            {/* Premium Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
            >
              <div style={{
                width: 260,
                height: 4,
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '4px',
                overflow: 'hidden',
                boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.6)',
              }}>
                <div 
                  className="shimmer"
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'var(--gradient-gold)',
                    borderRadius: '4px',
                    transition: 'width 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 0 15px rgba(212,175,55,0.6)',
                  }} 
                />
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.25em',
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}>
                {progress}%
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
