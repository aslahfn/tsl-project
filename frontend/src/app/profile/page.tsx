'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, LogOut, Loader2, User, Mail, Calendar, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div style={{ minHeight: '100vh', background: '#050508', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} size={32} color="#FFD700" />
          <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Verifying Session...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  const user = session?.user;

  return (
    <div style={{
      background: '#050508',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: 'sans-serif',
      padding: '4rem 1rem',
      position: 'relative'
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        
        {/* Back Link */}
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'rgba(255,255,255,0.4)',
          textDecoration: 'none',
          fontSize: '0.85rem',
          marginBottom: '2rem',
          fontWeight: 600,
          transition: 'color 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        {/* Profile Card */}
        <div style={{
          background: 'rgba(10, 10, 15, 0.85)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          borderRadius: '2rem',
          padding: '3rem 2.5rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          
          {/* Card Accent Grid */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #FFD700, #FFA500)'
          }} />

          {/* User Avatar */}
          <div style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: '2px solid #FFD700',
            padding: '4px',
            background: 'rgba(0,0,0,0.5)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            overflow: 'hidden'
          }}>
            {user?.image ? (
              <img src={user.image} alt={user?.name || ''} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <User size={48} color="#FFD700" />
            )}
          </div>

          <h1 style={{
            fontSize: '2rem',
            fontWeight: 800,
            margin: '0 0 0.5rem 0',
            background: 'linear-gradient(135deg, #fff, #aaa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {user?.name || 'Football Fan'}
          </h1>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.3)',
            borderRadius: '2rem',
            padding: '0.4rem 1.2rem',
            color: '#FFD700',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '2.5rem'
          }}>
            🏆 OFFICIAL FAN MEMBER
          </div>

          {/* Info Rows */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            textAlign: 'left',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Mail size={18} color="#FFD700" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</div>
                <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600 }}>{user?.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
              <Calendar size={18} color="#FFD700" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600 }}>Account Access</div>
                <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600 }}>Google Sign-In Active</div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/" style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.75rem',
              color: '#fff',
              fontWeight: 700,
              padding: '0.85rem',
              textAlign: 'center',
              textDecoration: 'none',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            >
              Go to Home
            </Link>

            <button
              onClick={() => setShowConfirmLogout(true)}
              style={{
                flex: 1,
                background: 'rgba(255,80,80,0.1)',
                border: '1px solid rgba(255,80,80,0.25)',
                borderRadius: '0.75rem',
                color: '#ff6b6b',
                fontWeight: 700,
                padding: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,80,80,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,80,80,0.1)'; }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>

        </div>

      </div>

      {/* Logout Confirmation Modal Dialog */}
      {showConfirmLogout && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            maxWidth: 400,
            width: '100%',
            background: '#0a0a0f',
            border: '1px solid rgba(255,80,80,0.3)',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7)'
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(255,80,80,0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <LogOut size={24} color="#ff6b6b" />
            </div>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Confirm Sign Out</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 2rem 0', lineHeight: 1.4 }}>
              Are you sure you want to sign out of your Thozhupadam Super League account?
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowConfirmLogout(false)}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  padding: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                style={{
                  flex: 1,
                  background: '#ff6b6b',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#050508',
                  padding: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
