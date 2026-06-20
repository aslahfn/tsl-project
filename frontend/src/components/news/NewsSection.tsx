'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useRealTime } from '@/hooks/useRealTime';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt: string | Date;
  featured: boolean;
  manOfTheMatch?: string | null;
  coverImage?: string;
}

const categoryColors: Record<string, string> = {
  MATCH_REPORT: '#D4AF37',
  TRANSFER: '#D4AF37',
  INJURY: '#FF3B3B',
  PREVIEW: '#AA820A',
  FEATURE: '#E5D5B3',
};

const categoryLabels: Record<string, string> = {
  MATCH_REPORT: 'Match Report',
  TRANSFER: 'Transfer',
  INJURY: 'Injury',
  PREVIEW: 'Preview',
  FEATURE: 'Feature',
};

const cardGradients = [
  'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(5,5,5,0.95) 70%)',
  'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(5,5,5,0.95) 70%)',
  'linear-gradient(135deg, rgba(170,130,10,0.08) 0%, rgba(5,5,5,0.95) 70%)',
  'linear-gradient(135deg, rgba(229,213,179,0.08) 0%, rgba(5,5,5,0.95) 70%)',
  'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(5,5,5,0.95) 70%)',
  'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(5,5,5,0.95) 70%)',
];

export default function NewsSection({ articles }: { articles: NewsArticle[] }) {
  useRealTime();
  const featured = articles.find(a => a.featured);
  const others = articles.filter(a => !a.featured).slice(0, 4);

  return (
    <section className="section-padding" style={{ background: 'var(--bg-primary)' }} id="news">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <div className="section-badge">📰 Latest</div>
            <h2 className="section-title">League<br /><span className="gradient-text">News</span></h2>
          </div>
          <Link href="/news" className="btn-secondary">
            All News <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {/* Featured article */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ gridColumn: 'span 2' }}
              className="news-card"
            >
              <div style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  position: 'relative',
                  height: 320,
                  background: featured.coverImage ? `url(${featured.coverImage}) center/cover no-repeat` : cardGradients[0],
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid var(--border-gold)',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212,175,55,0.04) 0%, transparent 50%)',
                  }} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(212,175,55,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.015) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem',
                    background: 'linear-gradient(transparent, rgba(3,3,5,0.98))',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem', width: '100%' }}>
                      <span style={{
                        padding: '0.2rem 0.7rem', borderRadius: '100px',
                        background: `${categoryColors[featured.category]}22`,
                        border: `1px solid ${categoryColors[featured.category]}44`,
                        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                        color: categoryColors[featured.category],
                        textTransform: 'uppercase',
                      }}>{categoryLabels[featured.category]}</span>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={11} />{formatDate(featured.publishedAt instanceof Date ? featured.publishedAt.toISOString() : featured.publishedAt)}
                      </span>
                      {featured.manOfTheMatch && featured.manOfTheMatch.trim() !== '' && (
                        <span style={{
                          padding: '0.2rem 0.7rem', borderRadius: '100px',
                          background: 'rgba(212,175,55,0.1)',
                          border: '1px solid var(--border-gold)',
                          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                          color: 'var(--gold)', textTransform: 'uppercase',
                          marginLeft: 'auto'
                        }}>
                          ★ MOTM: {featured.manOfTheMatch}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '0.5rem' }}>
                      {featured.title}
                    </h3>

                  </div>
                  <div style={{
                    position: 'absolute', top: '1.25rem', right: '1.25rem',
                    padding: '0.3rem 0.75rem',
                    background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold)',
                    borderRadius: '100px', fontSize: '0.65rem', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.1em',
                  }}>⭐ FEATURED</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other articles */}
          {others.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="news-card"
            >
              <div style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  height: 240,
                  background: article.coverImage ? `url(${article.coverImage}) center/cover no-repeat` : cardGradients[(i + 1) % cardGradients.length],
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid var(--border-gold)',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem',
                    background: 'linear-gradient(transparent, rgba(3,3,5,0.98))',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', width: '100%' }}>
                      <span style={{
                        padding: '0.15rem 0.5rem', borderRadius: '100px',
                        background: `${categoryColors[article.category]}22`,
                        border: `1px solid ${categoryColors[article.category]}44`,
                        fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em',
                        color: categoryColors[article.category], textTransform: 'uppercase',
                      }}>{categoryLabels[article.category]}</span>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={10} />{formatDate(article.publishedAt instanceof Date ? article.publishedAt.toISOString() : article.publishedAt)}
                      </span>
                      {article.manOfTheMatch && article.manOfTheMatch.trim() !== '' && (
                        <span style={{
                          padding: '0.15rem 0.5rem', borderRadius: '100px',
                          background: 'rgba(212,175,55,0.1)',
                          border: '1px solid var(--border-gold)',
                          fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em',
                          color: 'var(--gold)', textTransform: 'uppercase',
                          marginLeft: 'auto'
                        }}>
                          ★ MOTM: {article.manOfTheMatch}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>
                      {article.title}
                    </h3>

                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
