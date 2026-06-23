'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Newspaper, Search, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import PageHeader from '@/components/ui/PageHeader';
import Link from 'next/link';
import ImagePreviewModal from '@/components/ui/ImagePreviewModal';
import { useRealTime } from '@/hooks/useRealTime';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string | Date;
  featured: boolean;
  manOfTheMatch?: string | null;
  coverImage?: string;
}

const categoryLabels: Record<string, string> = {
  ALL: 'All News',
  MATCH_REPORT: 'Match Reports',
  TRANSFER: 'Transfers',
  INJURY: 'Injuries',
  PREVIEW: 'Previews',
  FEATURE: 'Features',
};

const categoryColors: Record<string, string> = {
  MATCH_REPORT: '#FFD700',
  TRANSFER: '#FFD700',
  INJURY: '#FF3B3B',
  PREVIEW: '#0080FF',
  FEATURE: '#9B59B6',
};

export default function NewsPageClient({ articles }: { articles: NewsArticle[] }) {
  useRealTime();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<{url: string, alt: string} | null>(null);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory = selectedCategory === 'ALL' || article.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const featuredArticle = useMemo(() => {
    return articles.find(a => a.featured);
  }, [articles]);

  const feedArticles = useMemo(() => {
    return filteredArticles.filter(a => a.id !== featuredArticle?.id || selectedCategory !== 'ALL');
  }, [filteredArticles, featuredArticle, selectedCategory]);

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '5rem' }}>
      <PageHeader
        badge="📰 League Newsroom"
        title="Latest News &"
        titleHighlight="Updates"
        description="Exclusive features, match analysis, transfer news, and official league announcements."
      />

      <div className="container-wide" style={{ marginTop: '3rem' }}>
        {/* Featured Article Hero (only shown when no filters are set) */}
        {selectedCategory === 'ALL' && searchQuery === '' && featuredArticle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '3.5rem' }}
          >
            <div style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  const visual = e.currentTarget.querySelector('.hero-visual') as HTMLDivElement;
                  if (visual) visual.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  const visual = e.currentTarget.querySelector('.hero-visual') as HTMLDivElement;
                  if (visual) visual.style.transform = 'scale(1)';
                }}
              >
                {/* Visual Cover Placeholder */}
                <div style={{ overflow: 'hidden', position: 'relative', minHeight: '300px' }}>
                  <div
                    className="hero-visual"
                    style={{
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(135deg, ${categoryColors[featuredArticle.category]}20, #0A0A0F)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.5s ease',
                    }}
                  >
                    {featuredArticle.coverImage ? (
                      <img 
                        src={featuredArticle.coverImage} 
                        alt={featuredArticle.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }} 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPreviewImage({ url: featuredArticle.coverImage!, alt: featuredArticle.title });
                        }}
                      />
                    ) : (
                      <Newspaper size={64} color="rgba(255,255,255,0.08)" />
                    )}
                  </div>
                  {/* Category Badge */}
                  <span style={{
                    position: 'absolute',
                    top: '1.5rem',
                    left: '1.5rem',
                    background: categoryColors[featuredArticle.category],
                    color: '#000',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.3rem 0.8rem',
                    borderRadius: '20px',
                    letterSpacing: '0.05em',
                  }}>
                    {categoryLabels[featuredArticle.category]}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#FFD700', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', display: 'block' }}>
                    ★ Featured Story
                  </span>
                  <h2 className="font-display" style={{ fontSize: '2.25rem', color: '#fff', lineHeight: 1.2, marginBottom: '1rem' }}>
                    {featuredArticle.title}
                  </h2>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <User size={14} color="#FFD700" />
                      <span>{featuredArticle.author}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={14} />
                      <span>{formatDate(featuredArticle.publishedAt)}</span>
                    </div>
                    {featuredArticle.manOfTheMatch && featuredArticle.manOfTheMatch.trim() !== '' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}>
                        <span style={{
                          padding: '0.2rem 0.6rem', borderRadius: '100px',
                          background: 'rgba(255,215,0,0.1)',
                          border: '1px solid rgba(255,215,0,0.3)',
                          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
                          color: '#FFD700', textTransform: 'uppercase'
                        }}>
                          ★ MOTM: {featuredArticle.manOfTheMatch}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters and Search Bar */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Categories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {Object.keys(categoryLabels).map(catKey => (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: 'none',
                  background: selectedCategory === catKey ? '#FFD700' : 'rgba(255,255,255,0.03)',
                  color: selectedCategory === catKey ? '#000' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {categoryLabels[catKey]}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 1rem 0.55rem 2.25rem',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Articles Feed Grid */}
        {feedArticles.length > 0 ? (
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(290px, 100%), 1fr))',
              gap: '2rem',
            }}
          >
            <AnimatePresence mode="popLayout">
              {feedArticles.map((article, idx) => (
                <motion.div
                  key={article.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                  whileHover={{ y: -6 }}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={e => {
                    const visual = e.currentTarget.querySelector('.card-visual') as HTMLDivElement;
                    if (visual) visual.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={e => {
                    const visual = e.currentTarget.querySelector('.card-visual') as HTMLDivElement;
                    if (visual) visual.style.transform = 'scale(1)';
                  }}
                >
                  <div style={{ textDecoration: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Visual Cover */}
                    <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                      <div
                        className="card-visual"
                        style={{
                          width: '100%',
                          height: '100%',
                          background: `linear-gradient(135deg, ${categoryColors[article.category]}15, #0E0E14)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.4s ease',
                        }}
                      >
                        {article.coverImage ? (
                          <img 
                            src={article.coverImage} 
                            alt={article.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'zoom-in' }} 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setPreviewImage({ url: article.coverImage!, alt: article.title });
                            }}
                          />
                        ) : (
                          <Newspaper size={36} color="rgba(255,255,255,0.05)" />
                        )}
                      </div>
                      {/* Category Badge */}
                      <span style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: categoryColors[article.category],
                        color: '#000',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        letterSpacing: '0.05em',
                      }}>
                        {categoryLabels[article.category]}
                      </span>
                      {/* MOTM Badge */}
                      {article.manOfTheMatch && article.manOfTheMatch.trim() !== '' && (
                        <span style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: 'rgba(255,215,0,0.15)',
                          border: '1px solid rgba(255,215,0,0.4)',
                          color: '#FFD700',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          letterSpacing: '0.05em',
                        }}>
                          ★ MOTM: {article.manOfTheMatch}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4 className="font-display" style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem', lineHeight: 1.3, transition: 'color 0.2s' }}>
                          {article.title}
                        </h4>

                      </div>

                      {/* Author & Date */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <User size={12} color="#FFD700" />
                          <span>{article.author}</span>
                        </span>
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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
            <Newspaper size={48} color="rgba(255,255,255,0.2)" style={{ marginBottom: '1rem', display: 'inline-block' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No Articles Found</h3>
            <p style={{ fontSize: '0.875rem' }}>No news matches the selected category or search term.</p>
          </div>
        )}
      </div>

      <ImagePreviewModal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage?.url || ''}
        altText={previewImage?.alt || ''}
      />
    </div>
  );
}
