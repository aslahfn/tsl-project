'use client';

import { motion } from 'framer-motion';

interface PageHeaderProps {
  badge: string;
  title: string;
  titleHighlight: string;
  description?: string;
}

export default function PageHeader({ badge, title, titleHighlight, description }: PageHeaderProps) {
  return (
    <div style={{
      padding: '4rem 0 3rem',
      borderBottom: '1px solid rgba(255,215,0,0.08)',
      marginBottom: '3rem',
      background: 'linear-gradient(180deg, rgba(255,215,0,0.03) 0%, transparent 100%)',
    }}>
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">{badge}</div>
          <h1 className="section-title" style={{ marginTop: '0.5rem', fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}>
            {title}<br />
            <span className="gradient-text">{titleHighlight}</span>
          </h1>
          {description && (
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', marginTop: '1rem', maxWidth: '500px', lineHeight: 1.7 }}>
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
