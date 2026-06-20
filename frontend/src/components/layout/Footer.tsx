'use client';

import Link from 'next/link';
import { Trophy, Mail, MapPin, Phone } from 'lucide-react';

const TwitterIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const FacebookIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function Footer() {
  return (
    <footer style={{ background: '#030305', borderTop: '1px solid var(--border-gold)', paddingTop: '4rem' }}>
      <div className="container-wide">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', paddingBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(212,175,55,0.06)', border: '1px solid var(--border-gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Trophy size={20} color="var(--gold)" />
              </div>
              <div>
                <div className="gradient-text font-display" style={{ fontSize: '1.5rem', lineHeight: 1 }}>TSL</div>
                <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Super League · Season 08</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              The ultimate football championship — where 6 elite clubs battle for glory in Season 08.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[TwitterIcon, InstagramIcon, YoutubeIcon, FacebookIcon].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social" style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-secondary)', transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gold)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-green-bright)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display" style={{ fontSize: '1.1rem', letterSpacing: '0.1em', marginBottom: '1.25rem', color: '#fff' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { href: '/fixtures', label: 'Fixtures' },
                { href: '/standings', label: 'League Table' },
                { href: '/teams', label: 'Teams' },
                { href: '/players', label: 'Players' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/news', label: 'News' },
              ].map(link => (
                <Link key={link.href} href={link.href} style={{
                  color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem',
                  transition: 'color 0.2s ease',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gold)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'; }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Season Info */}
          <div>
            <h4 className="font-display" style={{ fontSize: '1.1rem', letterSpacing: '0.1em', marginBottom: '1.25rem', color: '#fff' }}>Season 08</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Current Matchday', value: '10 of 15' },
                { label: 'Top Scorer', value: 'Arjun Faize (14)' },
                { label: 'Most Assists', value: 'Subijith Luca (10)' },
                { label: 'Clean Sheets', value: 'Hasib GK (5)' },
                { label: 'League Leaders', value: 'PETTIKADA FC' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.label}</span>
                  <span style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display" style={{ fontSize: '1.1rem', letterSpacing: '0.1em', marginBottom: '1.25rem', color: '#fff' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <MapPin size={16} color="var(--gold)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Thozhupadam Home Ground, Thrissur, Kerala, India</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <Phone size={16} color="var(--gold)" style={{ flexShrink: 0 }} />
                <span>+91 7736754823</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <Mail size={16} color="var(--gold)" style={{ flexShrink: 0 }} />
                <span>thozhupadamsl@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '1.5rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © 2026 Super League Season 08. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map(item => (
              <a key={item} href="#" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gold)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'; }}
              >{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
