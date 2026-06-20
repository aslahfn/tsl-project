'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ZoomIn } from 'lucide-react';
import { SafeImage } from '@/components/ui/SafeImage';

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  tags: string;
}

const heights = [200, 260, 180, 240, 220, 200, 280, 190, 250];

export default function GallerySection({ images }: { images: GalleryImage[] }) {
  const preview = images.slice(0, 6);

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }} id="gallery">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <div className="section-badge">📸 Gallery</div>
            <h2 className="section-title">Match<br /><span className="gradient-text">Moments</span></h2>
          </div>
          <Link href="/gallery" className="btn-secondary">
            View All <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Masonry-style grid */}
        <div style={{ columns: 3, columnGap: '1rem' }}>
          {preview.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{ breakInside: 'avoid', marginBottom: '1rem', position: 'relative', borderRadius: 10, overflow: 'hidden', cursor: 'pointer' }}
              whileHover={{ scale: 1.02 }}
            >
              <div style={{
                  height: heights[i],
                  border: '1px solid rgba(255,255,255,0.06)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <SafeImage
                    src={img.url}
                    alt={img.caption}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    fallback={
                      <div style={{
                        height: heights[i],
                        background: `linear-gradient(${135 + i * 30}deg, rgba(212,175,55,${0.05 + (i % 3) * 0.04}) 0%, rgba(5,5,5,0.95) 60%, rgba(212,175,55,0.02) 100%)`,
                        border: '1px solid var(--border-gold)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{ opacity: 0.15, fontSize: '3rem' }}>
                          {['⚽', '🏟️', '🏆', '🥅', '⚡', '🎯'][i % 6]}
                        </div>
                      </div>
                    }
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(3,3,5,0.75)',
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                      display: 'flex', alignItems: 'flex-end',
                      padding: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <p style={{ fontSize: '0.78rem', color: '#fff', lineHeight: 1.4, flex: 1 }}>{img.caption}</p>
                      <ZoomIn size={20} color="var(--gold)" style={{ flexShrink: 0, marginLeft: '0.5rem' }} />
                    </div>
                  </motion.div>
                </div>
            </motion.div>
          ))}
        </div>

        <style>{`
          @media (max-width: 768px) {
            #gallery .container-wide > div:last-of-type { columns: 2 !important; }
          }
          @media (max-width: 480px) {
            #gallery .container-wide > div:last-of-type { columns: 1 !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
