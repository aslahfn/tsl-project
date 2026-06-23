'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function StadiumParticles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate 30 random particles
    const generatedParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage across width
      y: Math.random() * 100, // percentage across height
      size: Math.random() * 4 + 1, // 1px to 5px
      duration: Math.random() * 20 + 20, // 20s to 40s float time
      delay: Math.random() * 10,
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 0,
            x: `${p.x}vw`,
            y: `${p.y + 20}vh`, // Start slightly lower
          }}
          animate={{
            opacity: [0, 0.5, 0.8, 0.3, 0],
            x: [`${p.x}vw`, `${p.x + (Math.random() * 10 - 5)}vw`], // Drift left/right
            y: [`${p.y + 20}vh`, `${p.y - 30}vh`], // Float up
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'var(--gold)',
            filter: 'blur(1px)',
            boxShadow: '0 0 10px var(--gold)',
          }}
        />
      ))}
    </div>
  );
}
