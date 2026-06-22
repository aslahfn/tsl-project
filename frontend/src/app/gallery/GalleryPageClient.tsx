'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { SafeImage } from '@/components/ui/SafeImage';

interface GalleryImageFromDB {
  id: string;
  url: string;
  caption: string;
  matchId: string | null;
  tags: string;
  width: number;
  height: number;
}

interface GalleryPageClientProps {
  images: GalleryImageFromDB[];
}

export default function GalleryPageClient({ images }: GalleryPageClientProps) {
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Parse tags string into array for each image
  const galleryImages = images.map(img => ({
    ...img,
    tags: img.tags ? img.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
  }));

  // Extract all unique tags
  const tags = ['ALL', ...Array.from(new Set(galleryImages.flatMap(img => img.tags)))];

  const filteredImages = galleryImages.filter(img => 
    selectedTag === 'ALL' || img.tags.includes(selectedTag)
  );

  const openLightbox = (imgId: string) => {
    const idx = filteredImages.findIndex(img => img.id === imgId);
    if (idx !== -1) setLightboxIndex(idx);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const navigateLightbox = (direction: 'next' | 'prev') => {
    if (lightboxIndex === null) return;
    let nextIdx = direction === 'next' ? lightboxIndex + 1 : lightboxIndex - 1;
    if (nextIdx >= filteredImages.length) nextIdx = 0;
    if (nextIdx < 0) nextIdx = filteredImages.length - 1;
    setLightboxIndex(nextIdx);
  };

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '5rem' }}>
      <PageHeader
        badge="📸 Visual Showcase"
        title="League"
        titleHighlight="Gallery"
        description="Capturing the thrill, drama, emotions, and matches of the Thozhupadam Super League."
      />

      <div className="container-wide" style={{ marginTop: '2.5rem' }}>
        {/* Filters */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          justifyContent: 'center',
          marginBottom: '3rem',
        }}>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => { setSelectedTag(tag); closeLightbox(); }}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: selectedTag === tag ? '#FFD700' : 'rgba(255,255,255,0.03)',
                color: selectedTag === tag ? '#000' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                if (selectedTag !== tag) {
                  e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={e => {
                if (selectedTag !== tag) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Masonry / Grid */}
        {filteredImages.length > 0 ? (
          <motion.div
            layout
            style={{
              columns: '1 280px',
              columnGap: '1.5rem',
            }}
          >
            {filteredImages.map((img, idx) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
                onClick={() => openLightbox(img.id)}
                style={{
                  breakInside: 'avoid',
                  marginBottom: '1.5rem',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {/* Fallback stylized background block */}
                <div style={{
                  width: '100%',
                  aspectRatio: img.width / img.height,
                  background: `linear-gradient(135deg, rgba(255,255,255,0.01), rgba(255,255,255,0.03))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                  onMouseEnter={e => {
                    const overlay = e.currentTarget.querySelector('.overlay') as HTMLDivElement;
                    if (overlay) overlay.style.opacity = '1';
                  }}
                  onMouseLeave={e => {
                    const overlay = e.currentTarget.querySelector('.overlay') as HTMLDivElement;
                    if (overlay) overlay.style.opacity = '0';
                  }}
                >
                  <SafeImage
                    src={img.url}
                    alt={img.caption}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                    fallback={<Camera size={24} color="rgba(255,255,255,0.15)" />}
                  />

                  {/* Hover Overlay */}
                  <div
                    className="overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '1.5rem',
                      zIndex: 3,
                    }}
                  >
                    <div style={{
                      alignSelf: 'flex-end',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#FFD700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 'auto',
                      transform: 'translateY(-10px)',
                    }}>
                      <ZoomIn size={16} color="#000" />
                    </div>
                    <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.4, margin: 0 }}>
                      {img.caption}
                    </p>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {img.tags.map(t => (
                        <span key={t} style={{ fontSize: '0.65rem', background: 'rgba(255,215,0,0.15)', color: '#FFD700', padding: '1px 6px', borderRadius: '4px' }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.03)',
            borderRadius: '16px',
            color: 'var(--text-secondary)',
          }}>
            <Camera size={48} color="rgba(255,255,255,0.2)" style={{ marginBottom: '1rem', display: 'inline-block' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No Photos Found</h3>
            <p style={{ fontSize: '0.875rem' }}>No images matching the selected category.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(5,5,5,0.95)',
              backdropFilter: 'blur(15px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Top Close Bar */}
            <button
              onClick={closeLightbox}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                transition: 'background 0.2s',
                zIndex: 10,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,59,59,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <X size={20} />
            </button>

            {/* Left Navigate */}
            <button
              onClick={() => navigateLightbox('prev')}
              style={{
                position: 'absolute',
                left: '1.5rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Center Container: Visual placeholder block with caption */}
            <div style={{
              maxWidth: '85vw',
              maxHeight: '75vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              textAlign: 'center',
            }}>
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                style={{
                  width: 'min(700px, 80vw)',
                  aspectRatio: filteredImages[lightboxIndex].width / filteredImages[lightboxIndex].height,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.05))',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                  marginBottom: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <SafeImage
                  src={filteredImages[lightboxIndex].url}
                  alt={filteredImages[lightboxIndex].caption}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  fallback={<Camera size={64} color="rgba(255,255,255,0.08)" />}
                />
              </motion.div>

              <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>
                {filteredImages[lightboxIndex].caption}
              </h4>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                {filteredImages[lightboxIndex].tags.map(t => (
                  <span key={t} style={{ fontSize: '0.75rem', background: 'rgba(255,215,0,0.15)', color: '#FFD700', padding: '2px 8px', borderRadius: '4px' }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Navigate */}
            <button
              onClick={() => navigateLightbox('next')}
              style={{
                position: 'absolute',
                right: '1.5rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
