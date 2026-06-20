'use client';

import { Suspense, useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Trophy, ArrowLeft, Loader2 } from 'lucide-react';

function UserLoginForm({ isGoogleEnabled }: { isGoogleEnabled: boolean }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError === 'AdminOAuthDenied') {
      setError('Google Sign-In is reserved for normal users. Administrators must log in using the Admin Console with their email and password.');
    } else if (urlError) {
      setError('An error occurred during authentication. Please try again.');
    }
  }, [searchParams]);

  const handleGoogleSignIn = () => {
    if (!isGoogleEnabled) return;
    setLoading(true);
    signIn('google', { callbackUrl: '/profile' });
  };

  return (
    <div style={{
      background: '#050508',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        maxWidth: 420,
        width: '100%',
        background: 'rgba(10, 10, 15, 0.9)',
        border: '1px solid rgba(255, 215, 0, 0.15)',
        borderRadius: '1.5rem',
        padding: '2.5rem',
        backdropFilter: 'blur(15px)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        {/* Back Link */}
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'rgba(255,255,255,0.4)',
          textDecoration: 'none',
          fontSize: '0.8rem',
          marginBottom: '1.5rem',
          fontWeight: 600,
          transition: 'color 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        {/* Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <Trophy size={20} color="#FFD700" />
          </div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#fff',
            margin: 0,
            letterSpacing: '0.02em'
          }}>Fan Portal</h2>
          <p style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.8rem',
            marginTop: '0.4rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>Thozhupadam Super League</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,80,80,0.1)',
            border: '1px solid rgba(255,80,80,0.3)',
            color: '#ff6b6b',
            padding: '1rem',
            borderRadius: '0.5rem',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: 600,
            lineHeight: '1.4'
          }}>
            ⚠️ {error}
          </div>
        )}

        {isGoogleEnabled ? (
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.5rem',
              color: '#fff',
              fontWeight: 700,
              padding: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s',
              fontSize: '1rem'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>
        ) : (
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.4)',
            padding: '1rem',
            borderRadius: '0.5rem',
            textAlign: 'center',
            fontSize: '0.9rem'
          }}>
            Google Sign-In is currently unavailable.
          </div>
        )}

        <div style={{
          textAlign: 'center',
          marginTop: '2.5rem',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.4)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '1.5rem'
        }}>
          Are you a League Manager?{' '}
          <Link href="/admin/login" style={{
            color: '#FFD700',
            textDecoration: 'none',
            fontWeight: 700
          }}>
            Admin Console
          </Link>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function ClientLoginFormWrapper({ isGoogleEnabled }: { isGoogleEnabled: boolean }) {
  return (
    <Suspense fallback={
      <div style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={24} color="#FFD700" />
      </div>
    }>
      <UserLoginForm isGoogleEnabled={isGoogleEnabled} />
    </Suspense>
  );
}
