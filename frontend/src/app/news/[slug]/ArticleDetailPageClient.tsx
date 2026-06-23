'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react';
import { NewsArticle } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ArticleDetailPageClientProps {
  article: NewsArticle;
}

const categoryLabels: Record<string, string> = {
  MATCH_REPORT: 'Match Report',
  TRANSFER: 'Transfer',
  INJURY: 'Injury',
  PREVIEW: 'Preview',
  FEATURE: 'Feature',
};

const categoryColors: Record<string, string> = {
  MATCH_REPORT: '#00FF87', // Neon Green
  TRANSFER: '#FFD700',     // Gold
  INJURY: '#FF3B3B',       // Red
  PREVIEW: '#0080FF',      // Blue
  FEATURE: '#9B59B6',      // Purple
};

export default function ArticleDetailPageClient({ article }: ArticleDetailPageClientProps) {
  const accentColor = categoryColors[article.category] || '#00FF87';

  return (
    <div style={{ paddingTop: '8rem', minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '5rem' }}>
      <div className="container-wide">
        {/* Back Link */}
        <Link href="/news" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          fontSize: '0.85rem',
          marginBottom: '2rem',
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#00FF87'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={14} />
          <span>Back to Newsroom</span>
        </Link>

        {/* Article Container */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '3fr 1fr',
          gap: '3rem',
          alignItems: 'start',
        }}>
          {/* Main Content Area */}
          <div>
            {/* Category badge & metadata */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <span style={{
                background: accentColor,
                color: '#000',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {categoryLabels[article.category]}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                <Calendar size={14} />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              {article.manOfTheMatch && article.manOfTheMatch.trim() !== '' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(255,215,0,0.1)',
                  border: '1px solid rgba(255,215,0,0.3)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#FFD700',
                  textTransform: 'uppercase',
                }}>
                  ★ MOTM: {article.manOfTheMatch}
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display" style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              lineHeight: 1.15,
              color: '#fff',
              marginBottom: '1.5rem',
            }}>
              {article.title}
            </h1>

            {/* Author */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              paddingBottom: '1.5rem',
              marginBottom: '2.5rem',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#00FF87', fontWeight: 650,
              }}>
                {article.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Reported by</span>
                <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{article.author}</span>
              </div>
            </div>

            {/* Cover Visual Block */}
            <div style={{
              width: '100%',
              height: '380px',
              borderRadius: '20px',
              background: `linear-gradient(135deg, ${accentColor}10, #0E0E14)`,
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              marginBottom: '3rem',
              overflow: 'hidden',
            }}>
              {article.coverImage ? (
                <img src={article.coverImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <span className="font-display" style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.08)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  League Visual Report
                </span>
              )}
            </div>

            {/* Body Content */}
            <div style={{
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              lineHeight: 1.8,
              letterSpacing: '0.01em',
            }}>
              <p style={{ fontWeight: 500, color: '#fff', fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                {article.excerpt}
              </p>
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} style={{ marginBottom: '1.75rem' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{
            position: 'sticky',
            top: '8rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
          }}>
            {/* Tag Cloud */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '16px',
              padding: '1.5rem',
            }}>
              <h3 className="font-display" style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={14} color="#00FF87" />
                <span>Related Tags</span>
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {article.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: '0.75rem',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--text-secondary)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,255,135,0.05) 0%, rgba(255,215,0,0.02) 100%)',
              border: '1px solid rgba(0,255,135,0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center',
            }}>
              <h4 className="font-display" style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Get Live Updates</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                Subscribe to our newsletter to receive direct match notifications and news highlights.
              </p>
              <input
                type="email"
                placeholder="Enter email address"
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  outline: 'none',
                  marginBottom: '0.5rem',
                  textAlign: 'center',
                }}
              />
              <button style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                background: '#00FF87',
                border: 'none',
                color: '#000',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
