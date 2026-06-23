'use client';

import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export default function GlobalLiveScores() {
  return (
    <section className="section-padding" style={{ background: 'var(--bg-primary)', borderTop: '1px solid rgba(255,255,255,0.05)' }} id="global-scores">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem', textAlign: 'center' }}
        >
          <div className="section-badge" style={{ marginBottom: '1rem' }}>
            <Globe size={14} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'text-bottom' }} />
            Global Football
          </div>
          <h2 className="section-title">World Cup &amp;<br /><span className="gradient-text">International Scores</span></h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', marginTop: '1rem' }}>
            Follow the latest live scores from the 2026 FIFA World Cup and other major global football competitions right here.
          </p>
        </motion.div>

        {/* Premium iframe container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            background: 'rgba(10, 10, 15, 0.8)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '24px',
            padding: '1rem',
            boxShadow: '0 20px 50px -20px rgba(0,0,0,0.5), 0 0 30px rgba(212,175,55,0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
          
          <iframe 
            src="https://www.scorebat.com/embed/livescore/" 
            frameBorder="0" 
            width="100%" 
            height="650" 
            allowFullScreen 
            allow="autoplay; fullscreen" 
            style={{ 
              width: '100%', 
              height: '650px', 
              overflow: 'hidden', 
              display: 'block', 
              borderRadius: '16px',
              backgroundColor: '#0a0a0f'
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
