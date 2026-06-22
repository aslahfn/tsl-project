'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Trophy } from 'lucide-react';
import { useSession } from 'next-auth/react';
import NotificationBell from './NotificationBell';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/fixtures', label: 'Fixtures' },
  { href: '/standings', label: 'Table' },
  { href: '/teams', label: 'Teams' },
  { href: '/players', label: 'Players' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/news', label: 'News' },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container-wide">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                overflow: 'hidden',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid var(--border-gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img src="/logo.png" alt="TSL" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <div>
                <div className="gradient-text" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '0.05em', lineHeight: 1 }}>
                  TSL
                </div>
                <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', lineHeight: 1 }}>
                  Season 08
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden-mobile">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Admin button + Hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <NotificationBell />
              {status === 'authenticated' && session?.user ? (
                <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }} aria-label="User Profile">
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    border: '1px solid var(--gold)', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(212,175,55,0.1)', padding: '2px', boxSizing: 'border-box'
                  }}>
                    {session.user.image ? (
                      <img src={session.user.image} alt={session.user.name || ''} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 'bold' }}>
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                </Link>
              ) : (
                <Link href="/login" style={{ padding: '0.5rem 1.25rem', fontSize: '0.75rem', border: '1px solid var(--border-green)', background: 'transparent', color: '#fff', borderRadius: '0.375rem', textDecoration: 'none', transition: 'all 0.2s', fontWeight: 600 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-green)'; e.currentTarget.style.color = '#fff'; }}
                >
                  Sign In
                </Link>
              )}
              <Link href="/admin" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.75rem' }} aria-label="Admin Panel">
                Admin
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: '#fff', 
                  cursor: 'pointer', 
                  display: 'none',
                  padding: '0.4rem',
                  borderRadius: '8px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                className="show-mobile"
              >
                <Menu size={26} color="#FFD700" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              style={{ 
                position: 'absolute', 
                top: '1.5rem', 
                right: '1.5rem', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                color: '#fff', 
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              aria-label="Close menu"
            >
              <X size={26} color="#FFD700" />
            </button>
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link href={link.href} className="mobile-nav-link" onClick={closeMenu}>{link.label}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
