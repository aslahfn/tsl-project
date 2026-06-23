'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trophy, ArrowLeft, Loader2 } from 'lucide-react';
import { registerManagerAction } from '../actions';

export default function ManagerSignupForm({ teams }: { teams: { id: string, name: string }[] }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teamId, setTeamId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('teamId', teamId);

      const result = await registerManagerAction(formData);

      if (result.success) {
        alert(result.message || 'Request sent! Waiting for admin approval.');
        router.push('/manager/login');
      } else {
        setError(result.error || 'Failed to register.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
          }}>Team Manager</h2>
          <p style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.8rem',
            marginTop: '0.4rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>Registration Portal</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,80,80,0.1)',
            border: '1px solid rgba(255,80,80,0.3)',
            color: '#ff6b6b',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: 600
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>Full Name</label>
            <input
              type="text"
              required
              placeholder="Your Name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                color: '#fff',
                fontSize: '0.9rem',
                padding: '0.75rem 1rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#FFD700'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>Email Address</label>
            <input
              type="email"
              required
              placeholder="manager@team.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                color: '#fff',
                fontSize: '0.9rem',
                padding: '0.75rem 1rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#FFD700'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                color: '#fff',
                fontSize: '0.9rem',
                padding: '0.75rem 1rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#FFD700'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>Select Your Team</label>
            <select
              required
              value={teamId}
              onChange={e => setTeamId(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                color: teamId ? '#fff' : 'rgba(255,255,255,0.4)',
                fontSize: '0.9rem',
                padding: '0.75rem 1rem',
                outline: 'none',
                transition: 'all 0.2s',
                appearance: 'none'
              }}
              onFocus={e => e.target.style.borderColor = '#FFD700'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <option value="" disabled>Choose a team...</option>
              {teams.map(t => (
                <option key={t.id} value={t.id} style={{ color: '#000' }}>{t.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#050508',
              fontWeight: 800,
              padding: '0.85rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s, opacity 0.2s',
              fontSize: '0.95rem'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Requesting Access...</span>
              </>
            ) : (
              <span>Request Manager Access</span>
            )}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.75rem',
          color: 'rgba(255,215,0,0.8)'
        }}>
          * Your request will be sent to the League Admin for approval.
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.5)'
        }}>
          Already a Team Manager?{' '}
          <Link href="/manager/login" style={{
            color: '#FFD700',
            textDecoration: 'none',
            fontWeight: 700
          }}>
            Log In
          </Link>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
