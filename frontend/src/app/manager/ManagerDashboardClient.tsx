'use client';

import { useState, useRef } from 'react';
import { updateManagerTeam, saveManagerPlayer, deleteManagerPlayer } from './actions';
import { Upload, Users, Settings, Trash2 } from 'lucide-react';
import Image from 'next/image';

type Tab = 'team' | 'players';

export default function ManagerDashboardClient({ team, players }: { team: any, players: any[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('team');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Team Form State
  const [teamForm, setTeamForm] = useState({
    manager: team.manager || '',
    primaryColor: team.primaryColor || '#ffffff',
    secondaryColor: team.secondaryColor || '#000000',
    logo: team.logo || ''
  });

  // Player Form State
  const [editPlayerId, setEditPlayerId] = useState<string | null>(null);
  const [playerForm, setPlayerForm] = useState({
    name: '',
    position: 'MID',
    number: '',
    nationality: 'India',
    age: '',
    photo: ''
  });

  const fileInputRefTeam = useRef<HTMLInputElement>(null);
  const fileInputRefPlayer = useRef<HTMLInputElement>(null);

  const showFeedback = (msg: string, isError = false) => {
    setFeedback({ type: isError ? 'error' : 'success', message: msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'team' | 'player') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (type === 'team') {
        setTeamForm(prev => ({ ...prev, logo: ev.target?.result as string }));
      } else {
        setPlayerForm(prev => ({ ...prev, photo: ev.target?.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await updateManagerTeam(teamForm);
      if (!res.success) throw new Error(res.error || 'Failed to update team.');
      showFeedback('Team details updated successfully!');
    } catch (err: any) {
      showFeedback(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await saveManagerPlayer({
        id: editPlayerId || undefined,
        name: playerForm.name,
        position: playerForm.position,
        number: parseInt(playerForm.number),
        nationality: playerForm.nationality,
        age: parseInt(playerForm.age),
        photo: playerForm.photo,
      });
      if (!res.success) throw new Error(res.error || 'Failed to save player.');
      showFeedback(editPlayerId ? 'Player updated!' : 'Player added!');
      setEditPlayerId(null);
      setPlayerForm({ name: '', position: 'MID', number: '', nationality: 'India', age: '', photo: '' });
    } catch (err: any) {
      showFeedback(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePlayer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await deleteManagerPlayer(id);
      if (!res.success) throw new Error(res.error || 'Failed to delete player.');
      showFeedback('Player deleted.');
    } catch (err: any) {
      showFeedback(err.message, true);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.4rem', color: '#fff', outline: 'none',
    boxSizing: 'border-box' as const
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      
      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={() => setActiveTab('team')}
          style={{
            background: 'none', border: 'none', color: activeTab === 'team' ? '#FFD700' : 'rgba(255,255,255,0.5)',
            borderBottom: activeTab === 'team' ? '2px solid #FFD700' : '2px solid transparent',
            padding: '0.5rem 1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <Settings size={18} /> Team Settings
        </button>
        <button
          onClick={() => setActiveTab('players')}
          style={{
            background: 'none', border: 'none', color: activeTab === 'players' ? '#FFD700' : 'rgba(255,255,255,0.5)',
            borderBottom: activeTab === 'players' ? '2px solid #FFD700' : '2px solid transparent',
            padding: '0.5rem 1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <Users size={18} /> Squad Management
        </button>
      </div>

      {feedback && (
        <div style={{
          background: feedback.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 80, 80, 0.1)',
          border: `1px solid ${feedback.type === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 80, 80, 0.3)'}`,
          color: feedback.type === 'success' ? '#4caf50' : '#ff6b6b',
          padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', textAlign: 'center', fontWeight: 600
        }}>
          {feedback.message}
        </div>
      )}

      {/* TEAM TAB */}
      {activeTab === 'team' && (
        <div style={{ background: 'rgba(10, 10, 20, 0.7)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#FFD700', marginBottom: '1.5rem', fontWeight: 800 }}>Edit Team Profile</h2>
          
          <form onSubmit={handleTeamSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Left Col */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Manager Name</label>
                <input type="text" required value={teamForm.manager} onChange={e => setTeamForm({ ...teamForm, manager: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Primary Color</label>
                  <input type="color" value={teamForm.primaryColor} onChange={e => setTeamForm({ ...teamForm, primaryColor: e.target.value })} style={{ ...inputStyle, padding: '0.2rem', height: '40px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Secondary Color</label>
                  <input type="color" value={teamForm.secondaryColor} onChange={e => setTeamForm({ ...teamForm, secondaryColor: e.target.value })} style={{ ...inputStyle, padding: '0.2rem', height: '40px' }} />
                </div>
              </div>
            </div>

            {/* Right Col */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Team Logo</label>
              <div
                onClick={() => fileInputRefTeam.current?.click()}
                style={{
                  height: 150, border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '0.5rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  background: teamForm.logo ? 'rgba(255,255,255,0.05)' : 'transparent',
                  overflow: 'hidden', position: 'relative'
                }}
              >
                {teamForm.logo ? (
                  <img src={teamForm.logo} alt="Logo" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                ) : (
                  <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                    <Upload size={24} style={{ margin: '0 auto 0.5rem auto' }} />
                    <span style={{ fontSize: '0.8rem' }}>Click to upload logo</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" ref={fileInputRefTeam} onChange={e => handleFileUpload(e, 'team')} style={{ display: 'none' }} />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <button disabled={submitting} type="submit" style={{ background: '#FFD700', color: '#000', fontWeight: 800, padding: '0.75rem 2rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
                {submitting ? 'Saving...' : 'Save Team Details'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PLAYERS TAB */}
      {activeTab === 'players' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* Player Form */}
          <div style={{ background: 'rgba(10, 10, 20, 0.7)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', alignSelf: 'start' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#FFD700', marginBottom: '1.5rem', fontWeight: 800 }}>{editPlayerId ? 'Edit Player' : 'Add New Player'}</h2>
            
            <form onSubmit={handlePlayerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Name</label>
                <input type="text" required value={playerForm.name} onChange={e => setPlayerForm({ ...playerForm, name: e.target.value })} style={inputStyle} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Position</label>
                  <select value={playerForm.position} onChange={e => setPlayerForm({ ...playerForm, position: e.target.value })} style={inputStyle}>
                    <option value="GK">Goalkeeper (GK)</option>
                    <option value="DEF">Defender (DEF)</option>
                    <option value="MID">Midfielder (MID)</option>
                    <option value="FWD">Forward (FWD)</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Number</label>
                  <input type="number" required value={playerForm.number} onChange={e => setPlayerForm({ ...playerForm, number: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Nationality</label>
                  <input type="text" required value={playerForm.nationality} onChange={e => setPlayerForm({ ...playerForm, nationality: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Age</label>
                  <input type="number" required value={playerForm.age} onChange={e => setPlayerForm({ ...playerForm, age: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Photo</label>
                <div
                  onClick={() => fileInputRefPlayer.current?.click()}
                  style={{
                    height: 100, border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '0.5rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    background: playerForm.photo ? 'rgba(255,255,255,0.05)' : 'transparent',
                    overflow: 'hidden'
                  }}
                >
                  {playerForm.photo ? (
                    <img src={playerForm.photo} alt="Player" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Click to upload</div>
                  )}
                </div>
                <input type="file" accept="image/*" ref={fileInputRefPlayer} onChange={e => handleFileUpload(e, 'player')} style={{ display: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button disabled={submitting} type="submit" style={{ flex: 1, background: '#FFD700', color: '#000', fontWeight: 800, padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
                  {editPlayerId ? 'Save Player' : 'Add Player'}
                </button>
                {editPlayerId && (
                  <button type="button" onClick={() => {
                    setEditPlayerId(null);
                    setPlayerForm({ name: '', position: 'MID', number: '', nationality: 'India', age: '', photo: '' });
                  }} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.75rem', cursor: 'pointer' }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Squad List */}
          <div style={{ background: 'rgba(10, 10, 20, 0.7)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem', fontWeight: 800 }}>Current Squad</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {players.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>No players added yet.</div>
              ) : players.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.1)' }}>
                      <img src={p.photo} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>#{p.number} • {p.position}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => {
                      setEditPlayerId(p.id);
                      setPlayerForm({
                        name: p.name, position: p.position, number: p.number.toString(),
                        nationality: p.nationality, age: p.age.toString(), photo: p.photo
                      });
                    }} style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                    
                    <button onClick={() => handleDeletePlayer(p.id, p.name)} style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
