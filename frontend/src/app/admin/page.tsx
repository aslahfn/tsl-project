'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  saveTeam, deleteTeam, 
  savePlayer, deletePlayer, 
  saveFixture, deleteFixture, 
  updateLiveMatch, triggerKickoffAlert,
  saveNews, deleteNews,
  saveSponsor, deleteSponsor,
  saveGalleryImage, deleteGalleryImage,
  saveNotification, deleteNotification,
  saveUser, deleteUser,
  triggerRecalculate, logoutAdmin
} from './actions';

type Tab = 'overview' | 'teams' | 'players' | 'fixtures' | 'news' | 'sponsors' | 'gallery' | 'notifications' | 'users' | 'standings';

function teamName(team?: { name?: string } | null, fallback = 'Unknown Team') {
  return team?.name ?? fallback;
}

function teamShort(team?: { shortName?: string } | null, fallback = '???') {
  return team?.shortName ?? fallback;
}

function fixtureLabel(f: {
  homeTeam?: { name?: string } | null;
  awayTeam?: { name?: string } | null;
  status?: string;
  homeScore?: number | null;
  awayScore?: number | null;
}) {
  const home = teamName(f.homeTeam);
  const away = teamName(f.awayTeam);
  if (f.status === 'FINISHED' || f.status === 'LIVE') {
    return `${home} [${f.homeScore ?? 0} - ${f.awayScore ?? 0}] ${away}`;
  }
  return `${home} vs ${away}`;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [adminSession, setAdminSession] = useState<{ email: string; name: string } | null>(null);
  const [adminStatus, setAdminStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/admin/me');
        if (res.ok) {
          const data = await res.json();
          setAdminSession(data.user);
          setAdminStatus('authenticated');
        } else {
          setAdminStatus('unauthenticated');
          router.push('/admin/login');
        }
      } catch {
        setAdminStatus('unauthenticated');
        router.push('/admin/login');
      }
    }
    checkSession();
  }, [router]);

  // Selected tab
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Database states
  const [teams, setTeams] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // UI state
  const [dbLoading, setDbLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Editing items state
  const [editTeamId, setEditTeamId] = useState<string | null>(null);
  const [teamForm, setTeamForm] = useState({
    name: '', shortName: '', slug: '', logo: '',
    city: '', founded: 2026, manager: '', stadium: '',
    primaryColor: '#FFD700', secondaryColor: '#0A0A0F', description: ''
  });

  const [editPlayerId, setEditPlayerId] = useState<string | null>(null);
  const [playerForm, setPlayerForm] = useState({
    name: '', teamId: '', position: 'MID', number: 10,
    nationality: 'India', age: 22, photo: '',
    goals: 0, assists: 0, matches: 0, yellowCards: 0, redCards: 0,
    cleanSheets: 0, rating: 6.0
  });

  const [editFixtureId, setEditFixtureId] = useState<string | null>(null);
  const [fixtureForm, setFixtureForm] = useState({
    homeTeamId: '', awayTeamId: '', date: '', time: '',
    venue: '', matchday: 1, status: 'UPCOMING', homeScore: 0, awayScore: 0,
    goalScorers: '', yellowCards: '', redCards: '', manOfTheMatchId: '',
    matchReport: '', referee: '', attendance: 0
  });

  const [editNewsId, setEditNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    category: 'MATCH_REPORT', author: 'SLS Admin', coverImage: '',
    featured: false, tags: '', manOfTheMatch: ''
  });

  const [editSponsorId, setEditSponsorId] = useState<string | null>(null);
  type SponsorForm = {
    name: string;
    logo: string;
    url: string;
    tier: string;
    description: string;
  };

  const [sponsorForm, setSponsorForm] = useState<SponsorForm>({
    name: '',
    logo: '',
    url: '',
    tier: 'GOLD',
    description: ''
  });

  const [editGalleryId, setEditGalleryId] = useState<string | null>(null);
  const [galleryForm, setGalleryForm] = useState({
    url: '', caption: '', matchId: '', tags: ''
  });

  const [editNotificationId, setEditNotificationId] = useState<string | null>(null);
  const [notificationForm, setNotificationForm] = useState({
    title: '', message: ''
  });

  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({
    name: '', email: '', password: '', role: 'user'
  });

  // Live Match Controller State
  const [liveFixtureId, setLiveFixtureId] = useState('');
  const [liveHomeScore, setLiveHomeScore] = useState(0);
  const [liveAwayScore, setLiveAwayScore] = useState(0);
  const [liveGoalScorers, setLiveGoalScorers] = useState('');
  const [liveYellowCards, setLiveYellowCards] = useState('');
  const [liveRedCards, setLiveRedCards] = useState('');
  const [liveMOTM, setLiveMOTM] = useState('');
  const [liveReferee, setLiveReferee] = useState('');
  const [liveAttendance, setLiveAttendance] = useState(0);
  const [liveReport, setLiveReport] = useState('');
  const [liveGoalText, setLiveGoalText] = useState('');

  // Redirect handled in checkSession useEffect

  const fetchData = async () => {
    setDbLoading(true);
    try {
      const res = await fetch('/api/admin/data');
      const data = await res.json();
      if (res.ok) {
        setTeams(data.teams || []);
        setPlayers(data.players || []);
        setFixtures(data.fixtures || []);
        setStandings(data.standings || []);
        setNews(data.newsArticles || []);
        setSponsors(data.sponsors || []);
        setGallery(data.gallery || []);
        setNotifications(data.notifications || []);
        setUsers(data.users || []);
        
        // Auto select first live fixture for live controller if exists
        const liveMatch = data.fixtures.find((f: any) => f.status === 'LIVE');
        if (liveMatch) {
          setLiveFixtureId(liveMatch.id);
          setLiveHomeScore(liveMatch.homeScore ?? 0);
          setLiveAwayScore(liveMatch.awayScore ?? 0);
          setLiveGoalScorers(liveMatch.goalScorers || '');
          setLiveYellowCards(liveMatch.yellowCards || '');
          setLiveRedCards(liveMatch.redCards || '');
          setLiveMOTM(liveMatch.manOfTheMatchId || '');
          setLiveReferee(liveMatch.referee || '');
          setLiveAttendance(liveMatch.attendance ?? 0);
          setLiveReport(liveMatch.matchReport || '');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    if (adminStatus === 'authenticated') {
      fetchData();
    }
  }, [adminStatus]);

  const showFeedback = (success: string, error = '') => {
    setSuccessMsg(success);
    setErrorMsg(error);
    setTimeout(() => {
      setSuccessMsg('');
      setErrorMsg('');
    }, 4500);
  };

  // Convert uploaded logo/file to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Recalculate everything
  const handleRecalculate = async () => {
    setSubmitting(true);
    try {
      const res_302mk = await triggerRecalculate();
      if (res_302mk && !res_302mk.success) throw new Error(res_302mk.error || 'Failed');;
      showFeedback('Standings and Player Stats recalculated successfully!');
      fetchData();
    } catch {
      showFeedback('', 'Recalculation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Handlers
  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res_t7r7q = await saveTeam({
        id: editTeamId || undefined,
        ...teamForm
      });
      if (res_t7r7q && !res_t7r7q.success) throw new Error(res_t7r7q.error || 'Failed');;
      showFeedback(editTeamId ? 'Team updated successfully!' : 'Team created successfully!');
      setEditTeamId(null);
      setTeamForm({
        name: '', shortName: '', slug: '', logo: '',
        city: '', founded: 2026, manager: '', stadium: '',
        primaryColor: '#FFD700', secondaryColor: '#0A0A0F', description: ''
      });
      fetchData();
    } catch (err: any) {
      showFeedback('', err.message || 'Failed to save team.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res_jgpi8 = await savePlayer({
        id: editPlayerId || undefined,
        ...playerForm
      });
      if (res_jgpi8 && !res_jgpi8.success) throw new Error(res_jgpi8.error || 'Failed');;
      showFeedback(editPlayerId ? 'Player updated successfully!' : 'Player created successfully!');
      setEditPlayerId(null);
      setPlayerForm({
        name: '', teamId: teams[0]?.id || '', position: 'MID', number: 10,
        nationality: 'India', age: 22, photo: '',
        goals: 0, assists: 0, matches: 0, yellowCards: 0, redCards: 0,
        cleanSheets: 0, rating: 6.0
      });
      fetchData();
    } catch (err: any) {
      showFeedback('', err.message || 'Failed to save player.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFixtureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res_bfa99 = await saveFixture({
        id: editFixtureId || undefined,
        ...fixtureForm
      });
      if (res_bfa99 && !res_bfa99.success) throw new Error(res_bfa99.error || 'Failed');;
      showFeedback(editFixtureId ? 'Fixture updated successfully!' : 'Fixture created successfully!');
      setEditFixtureId(null);
      setFixtureForm({
        homeTeamId: teams[0]?.id || '', awayTeamId: teams[1]?.id || '', date: '', time: '',
        venue: '', matchday: 1, status: 'UPCOMING', homeScore: 0, awayScore: 0,
        goalScorers: '', yellowCards: '', redCards: '', manOfTheMatchId: '',
        matchReport: '', referee: '', attendance: 0
      });
      fetchData();
    } catch (err: any) {
      showFeedback('', err.message || 'Failed to save fixture.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const generatedSlug = newsForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
      const res_e84zq = await saveNews({
        id: editNewsId || undefined,
        ...newsForm,
        slug: editNewsId ? newsForm.slug || generatedSlug : generatedSlug
      });
      if (res_e84zq && !res_e84zq.success) throw new Error(res_e84zq.error || 'Failed');;
      showFeedback(editNewsId ? 'Article updated successfully!' : 'Article posted successfully!');
      setEditNewsId(null);
      setNewsForm({
        title: '', slug: '', excerpt: '', content: '',
        category: 'MATCH_REPORT', author: 'SLS Admin', coverImage: '',
        featured: false, tags: '', manOfTheMatch: ''
      });
      fetchData();
    } catch (err: any) {
      showFeedback('', err.message || 'Failed to save news.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res_htn59 = await saveSponsor({
        id: editSponsorId || undefined,
        ...sponsorForm
      });
      if (res_htn59 && !res_htn59.success) throw new Error(res_htn59.error || 'Failed');;
      showFeedback(editSponsorId ? 'Sponsor updated successfully!' : 'Sponsor added successfully!');
      setEditSponsorId(null);
      setSponsorForm({ name: '', logo: '', url: '', tier: 'GOLD', description: '' });
      fetchData();
    } catch (err: any) {
      showFeedback('', err.message || 'Failed to save sponsor.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res_rb310 = await saveGalleryImage({
        id: editGalleryId || undefined,
        ...galleryForm
      });
      if (res_rb310 && !res_rb310.success) throw new Error(res_rb310.error || 'Failed');;
      showFeedback(editGalleryId ? 'Gallery photo updated!' : 'Gallery photo added successfully!');
      setEditGalleryId(null);
      setGalleryForm({ url: '', caption: '', matchId: '', tags: '' });
      fetchData();
    } catch (err: any) {
      showFeedback('', err.message || 'Failed to save gallery item.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await saveNotification({
        id: editNotificationId || undefined,
        ...notificationForm
      });
      showFeedback(editNotificationId ? 'Notification updated!' : 'Notification broadcasted successfully!');
      setEditNotificationId(null);
      setNotificationForm({ title: '', message: '' });
      fetchData();
    } catch (err: any) {
      showFeedback('', err.message || 'Failed to broadcast notification.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res_ry7mw = await saveUser({
        id: editUserId || undefined,
        ...userForm
      });
      if (res_ry7mw && !res_ry7mw.success) throw new Error(res_ry7mw.error || 'Failed');;
      showFeedback(editUserId ? 'User updated successfully!' : 'User created successfully!');
      setEditUserId(null);
      setUserForm({ name: '', email: '', password: '', role: 'user' });
      fetchData();
    } catch (err: any) {
      showFeedback('', err.message || 'Failed to save user.');
    } finally {
      setSubmitting(false);
    }
  };

  // Live Match Controls
  const handleStartMatch = async (fid: string) => {
    setSubmitting(true);
    try {
      await updateLiveMatch(fid, {
        status: 'LIVE',
        homeScore: 0,
        awayScore: 0
      });
      showFeedback('Match is now LIVE!');
      fetchData();
    } catch {
      showFeedback('', 'Failed to start live match.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoalEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveFixtureId) return;
    setSubmitting(true);
    try {
      const match = fixtures.find(f => f.id === liveFixtureId);
      const text = liveGoalText || `GOAL! ${teamShort(match?.homeTeam)} ${liveHomeScore} - ${liveAwayScore} ${teamShort(match?.awayTeam)}`;
      await updateLiveMatch(liveFixtureId, {
        status: 'LIVE',
        homeScore: liveHomeScore,
        awayScore: liveAwayScore,
        goalScorers: liveGoalScorers,
        yellowCards: liveYellowCards,
        redCards: liveRedCards,
        manOfTheMatchId: liveMOTM || null,
        referee: liveReferee,
        attendance: liveAttendance,
        matchReport: liveReport,
        eventText: text
      });
      showFeedback('Live score & events updated successfully!');
      setLiveGoalText('');
      fetchData();
    } catch {
      showFeedback('', 'Failed to update live match.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEndMatch = async (fid: string) => {
    setSubmitting(true);
    try {
      const match = fixtures.find(f => f.id === fid);
      await updateLiveMatch(fid, {
        status: 'FINISHED',
        homeScore: fid === liveFixtureId ? liveHomeScore : match.homeScore,
        awayScore: fid === liveFixtureId ? liveAwayScore : match.awayScore,
        goalScorers: fid === liveFixtureId ? liveGoalScorers : match.goalScorers,
        yellowCards: fid === liveFixtureId ? liveYellowCards : match.yellowCards,
        redCards: fid === liveFixtureId ? liveRedCards : match.redCards,
        manOfTheMatchId: fid === liveFixtureId ? liveMOTM : match.manOfTheMatchId,
        referee: fid === liveFixtureId ? liveReferee : match.referee,
        attendance: fid === liveFixtureId ? liveAttendance : match.attendance,
        matchReport: fid === liveFixtureId ? liveReport : match.matchReport,
      });
      showFeedback('Match marked as Full Time! Standings and Player Stats recalculated.');
      fetchData();
    } catch {
      showFeedback('', 'Failed to complete live match.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWarningTrigger = async (fid: string) => {
    setSubmitting(true);
    try {
      await triggerKickoffAlert(fid);
      showFeedback('15-minute warning notification sent!');
    } catch {
      showFeedback('', 'Failed to trigger alert.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper lists of players for active live match home & away teams
  const activeMatchHomePlayers = liveFixtureId
    ? players.filter(p => p.teamId === fixtures.find(f => f.id === liveFixtureId)?.homeTeamId)
    : [];
  const activeMatchAwayPlayers = liveFixtureId
    ? players.filter(p => p.teamId === fixtures.find(f => f.id === liveFixtureId)?.awayTeamId)
    : [];

  const addScorer = (name: string, isHome: boolean) => {
    setLiveGoalScorers(prev => {
      let home = '';
      let away = '';
      if (prev && prev.includes('|')) {
        const parts = prev.split('|');
        home = parts[0].trim();
        away = parts[1] ? parts[1].trim() : '';
      } else if (prev) {
        home = prev.trim();
      }
      
      if (isHome) {
        home = home ? `${home}, ${name}` : name;
      } else {
        away = away ? `${away}, ${name}` : name;
      }
      return `${home} | ${away}`;
    });
  };
  const addYellow = (name: string, isHome: boolean) => {
    setLiveYellowCards(prev => {
      let home = ''; let away = '';
      if (prev && prev.includes('|')) { const p = prev.split('|'); home = p[0].trim(); away = p[1] ? p[1].trim() : ''; } else if (prev) { home = prev.trim(); }
      if (isHome) { home = home ? `${home}, ${name}` : name; } else { away = away ? `${away}, ${name}` : name; }
      return `${home} | ${away}`;
    });
  };
  const addRed = (name: string, isHome: boolean) => {
    setLiveRedCards(prev => {
      let home = ''; let away = '';
      if (prev && prev.includes('|')) { const p = prev.split('|'); home = p[0].trim(); away = p[1] ? p[1].trim() : ''; } else if (prev) { home = prev.trim(); }
      if (isHome) { home = home ? `${home}, ${name}` : name; } else { away = away ? `${away}, ${name}` : name; }
      return `${home} | ${away}`;
    });
  };

  const liveHomeScorersInput = liveGoalScorers.includes('|') ? liveGoalScorers.split('|')[0].trim() : liveGoalScorers.trim();
  const liveAwayScorersInput = liveGoalScorers.includes('|') ? liveGoalScorers.split('|')[1].trim() : '';
  const liveHomeYellowsInput = liveYellowCards.includes('|') ? liveYellowCards.split('|')[0].trim() : liveYellowCards.trim();
  const liveAwayYellowsInput = liveYellowCards.includes('|') ? liveYellowCards.split('|')[1].trim() : '';
  const liveHomeRedsInput = liveRedCards.includes('|') ? liveRedCards.split('|')[0].trim() : liveRedCards.trim();
  const liveAwayRedsInput = liveRedCards.includes('|') ? liveRedCards.split('|')[1].trim() : '';

  const fixtureHomeScorersInput = fixtureForm.goalScorers.includes('|') ? fixtureForm.goalScorers.split('|')[0].trim() : fixtureForm.goalScorers.trim();
  const fixtureAwayScorersInput = fixtureForm.goalScorers.includes('|') ? fixtureForm.goalScorers.split('|')[1].trim() : '';
  const fixtureHomeYellowsInput = fixtureForm.yellowCards.includes('|') ? fixtureForm.yellowCards.split('|')[0].trim() : fixtureForm.yellowCards.trim();
  const fixtureAwayYellowsInput = fixtureForm.yellowCards.includes('|') ? fixtureForm.yellowCards.split('|')[1].trim() : '';
  const fixtureHomeRedsInput = fixtureForm.redCards.includes('|') ? fixtureForm.redCards.split('|')[0].trim() : fixtureForm.redCards.trim();
  const fixtureAwayRedsInput = fixtureForm.redCards.includes('|') ? fixtureForm.redCards.split('|')[1].trim() : '';

  if (adminStatus === 'loading' || adminStatus === 'unauthenticated' || dbLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050508', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid rgba(255,215,0,0.1)', borderTopColor: '#FFD700', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ letterSpacing: '0.25em', textTransform: 'uppercase', fontSize: '0.8rem' }}>Loading Admin Console...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  const globalCardStyle = {
    background: 'rgba(10, 10, 20, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    backdropFilter: 'blur(10px)',
  };

  const labelStyle = {
    display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em'
  } as React.CSSProperties;

  const inputStyle = {
    width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.4rem', color: '#fff', fontSize: '0.9rem', padding: '0.6rem 0.8rem', outline: 'none'
  } as React.CSSProperties;

  const tabList: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'teams', label: 'Teams' },
    { id: 'players', label: 'Players' },
    { id: 'fixtures', label: 'Matches' },
    { id: 'news', label: 'News' },
    { id: 'standings', label: 'Standings' },
    { id: 'sponsors', label: 'Sponsors' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'notifications', label: 'Alerts' },
    { id: 'users', label: 'Users' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: '#fff', fontFamily: 'sans-serif', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header Title */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', marginBottom: '2rem', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg, #FFD700, #E6C200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              THOZHUPADAM SUPER LEAGUE MANAGEMENT HUB
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.3em', marginTop: '0.2rem' }}>
              Real-Time Control Panel • {adminSession?.email}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleRecalculate}
              disabled={submitting}
              style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '0.5rem', color: '#FFD700', padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              🔄 Recalculate Standings & Stats
            </button>
            <button
              onClick={async () => {
                setSubmitting(true);
                await logoutAdmin();
              }}
              disabled={submitting}
              style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '0.5rem', color: '#ff6b6b', padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Feedback Alert Toasts */}
        <AnimatePresence>
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid #FFD700', color: '#FFD700', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontWeight: 600, textAlign: 'center' }}>
              ✅ {successMsg}
            </motion.div>
          )}
          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: 'rgba(255,80,80,0.15)', border: '1px solid #ff6b6b', color: '#ff6b6b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontWeight: 600, textAlign: 'center' }}>
              ❌ {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Controls Navigation */}
        <div style={{ display: 'flex', overflowX: 'auto', gap: '0.5rem', marginBottom: '2rem', paddingBottom: '0.5rem' }} className="hide-scrollbar">
          {tabList.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.1))' : 'rgba(255,255,255,0.02)',
                border: activeTab === tab.id ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.08)',
                color: activeTab === tab.id ? '#FFD700' : 'rgba(255,255,255,0.6)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1.5rem',
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Rendering */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>

            {/* TAB: OVERVIEW & LIVE MATCH CONTROLLER */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Stats Summary Rows */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(140px, 100%), 1fr))', gap: '1rem' }}>
                  {[
                    { label: 'Teams', val: teams.length, icon: '🏆', color: '#FFD700' },
                    { label: 'Players', val: players.length, icon: '⚽', color: '#FFD700' },
                    { label: 'Matches', val: fixtures.length, icon: '📅', color: '#FFD700' },
                    { label: 'Live Matches', val: fixtures.filter(f => f.status === 'LIVE').length, icon: '📡', color: '#FF6B6B' },
                    { label: 'Sponsors', val: sponsors.length, icon: '🤝', color: '#FFD700' },
                    { label: 'Gallery', val: gallery.length, icon: '🖼️', color: '#FFD700' },
                    { label: 'Users', val: users.length, icon: '👤', color: '#FFD700' }
                  ].map((c) => (
                    <div key={c.label} style={{ ...globalCardStyle, border: `1px solid ${c.color}22`, textAlign: 'center', padding: '1rem' }}>
                      <div style={{ fontSize: '1.25rem' }}>{c.icon}</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 950, color: c.color, margin: '0.2rem 0' }}>{c.val}</div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.label}</div>
                    </div>
                  ))}
                </div>

                {/* Live Match Controller Panel */}
                <div style={globalCardStyle}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFD700', textTransform: 'uppercase', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📡</span> Live Match Controller
                  </h2>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2rem' }}>
                    {/* Goal & Score Input Form */}
                    <form onSubmit={handleGoalEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={labelStyle}>Select Active / Upcoming Match</label>
                        <select
                          value={liveFixtureId}
                          onChange={(e) => {
                            const id = e.target.value;
                            setLiveFixtureId(id);
                            const m = fixtures.find(f => f.id === id);
                            if (m) {
                              setLiveHomeScore(m.homeScore ?? 0);
                              setLiveAwayScore(m.awayScore ?? 0);
                              setLiveGoalScorers(m.goalScorers || '');
                              setLiveYellowCards(m.yellowCards || '');
                              setLiveRedCards(m.redCards || '');
                              setLiveMOTM(m.manOfTheMatchId || '');
                              setLiveReferee(m.referee || '');
                              setLiveAttendance(m.attendance ?? 0);
                              setLiveReport(m.matchReport || '');
                            }
                          }}
                          style={inputStyle}
                        >
                          <option value="">-- Select Fixture --</option>
                          {fixtures.filter(f => f.status !== 'FINISHED').map(f => (
                            <option key={f.id} value={f.id}>
                              [{f.status}] {fixtureLabel(f)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {liveFixtureId && (
                        <>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                              <label style={labelStyle}>
                                Home Score ({teamShort(fixtures.find(f => f.id === liveFixtureId)?.homeTeam)})
                              </label>
                              <input type="number" min="0" value={liveHomeScore} onChange={e => setLiveHomeScore(Number(e.target.value))} style={inputStyle} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <label style={labelStyle}>
                                Away Score ({teamShort(fixtures.find(f => f.id === liveFixtureId)?.awayTeam)})
                              </label>
                              <input type="number" min="0" value={liveAwayScore} onChange={e => setLiveAwayScore(Number(e.target.value))} style={inputStyle} />
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '1rem' }}>

                          </div>

                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                              <label style={labelStyle}>Home Goal Scorers</label>
                              <input
                                type="text"
                                value={liveHomeScorersInput}
                                onChange={e => setLiveGoalScorers(`${e.target.value} | ${liveAwayScorersInput}`)}
                                placeholder="e.g. Arjun Faize"
                                style={inputStyle}
                              />
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                                {activeMatchHomePlayers.map(p => (
                                  <button type="button" key={p.id} onClick={() => addScorer(p.name, true)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.65rem', color: '#aaa', padding: '0.2rem 0.4rem', cursor: 'pointer' }}>+{p.name}</button>
                                ))}
                              </div>
                            </div>
                            <div style={{ flex: 1 }}>
                              <label style={labelStyle}>Away Goal Scorers</label>
                              <input
                                type="text"
                                value={liveAwayScorersInput}
                                onChange={e => setLiveGoalScorers(`${liveHomeScorersInput} | ${e.target.value}`)}
                                placeholder="e.g. Rafi Pettikada"
                                style={inputStyle}
                              />
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                                {activeMatchAwayPlayers.map(p => (
                                  <button type="button" key={p.id} onClick={() => addScorer(p.name, false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.65rem', color: '#aaa', padding: '0.2rem 0.4rem', cursor: 'pointer' }}>+{p.name}</button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                              <label style={labelStyle}>Home Yellow Cards</label>
                              <input
                                type="text"
                                value={liveHomeYellowsInput}
                                onChange={e => setLiveYellowCards(`${e.target.value} | ${liveAwayYellowsInput}`)}
                                placeholder="e.g. Zain"
                                style={inputStyle}
                              />
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                                {activeMatchHomePlayers.map(p => (
                                  <button type="button" key={p.id} onClick={() => addYellow(p.name, true)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.65rem', color: '#aaa', padding: '0.2rem 0.4rem', cursor: 'pointer' }}>+{p.name}</button>
                                ))}
                              </div>
                            </div>
                            <div style={{ flex: 1 }}>
                              <label style={labelStyle}>Away Yellow Cards</label>
                              <input
                                type="text"
                                value={liveAwayYellowsInput}
                                onChange={e => setLiveYellowCards(`${liveHomeYellowsInput} | ${e.target.value}`)}
                                placeholder="e.g. Zain"
                                style={inputStyle}
                              />
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                                {activeMatchAwayPlayers.map(p => (
                                  <button type="button" key={p.id} onClick={() => addYellow(p.name, false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.65rem', color: '#aaa', padding: '0.2rem 0.4rem', cursor: 'pointer' }}>+{p.name}</button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                              <label style={labelStyle}>Home Red Cards</label>
                              <input
                                type="text"
                                value={liveHomeRedsInput}
                                onChange={e => setLiveRedCards(`${e.target.value} | ${liveAwayRedsInput}`)}
                                placeholder="e.g. Zain"
                                style={inputStyle}
                              />
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                                {activeMatchHomePlayers.map(p => (
                                  <button type="button" key={p.id} onClick={() => addRed(p.name, true)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.65rem', color: '#aaa', padding: '0.2rem 0.4rem', cursor: 'pointer' }}>+{p.name}</button>
                                ))}
                              </div>
                            </div>
                            <div style={{ flex: 1 }}>
                              <label style={labelStyle}>Away Red Cards</label>
                              <input
                                type="text"
                                value={liveAwayRedsInput}
                                onChange={e => setLiveRedCards(`${liveHomeRedsInput} | ${e.target.value}`)}
                                placeholder="e.g. Zain"
                                style={inputStyle}
                              />
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                                {activeMatchAwayPlayers.map(p => (
                                  <button type="button" key={p.id} onClick={() => addRed(p.name, false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.65rem', color: '#aaa', padding: '0.2rem 0.4rem', cursor: 'pointer' }}>+{p.name}</button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div>
                            <label style={labelStyle}>Man of the Match</label>
                            <select value={liveMOTM} onChange={e => setLiveMOTM(e.target.value)} style={inputStyle}>
                              <option value="">-- Select Player --</option>
                              {activeMatchHomePlayers.concat(activeMatchAwayPlayers).map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({teamShort(p.team)})</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label style={labelStyle}>Match Report</label>
                            <textarea rows={3} value={liveReport} onChange={e => setLiveReport(e.target.value)} placeholder="Write report highlights..." style={{ ...inputStyle, resize: 'none' }} />
                          </div>

                          <div>
                            <label style={labelStyle}>Goal Broadcast Text (Optional)</label>
                            <input
                              type="text"
                              value={liveGoalText}
                              onChange={e => setLiveGoalText(e.target.value)}
                              placeholder="e.g. GOAL! Arjun Faize strikes a volley! PKD 1 - 0 ALM"
                              style={inputStyle}
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={submitting}
                            style={{ background: 'linear-gradient(90deg, #FFD700, #E6C200)', border: 'none', borderRadius: '0.4rem', color: '#050508', fontWeight: 800, padding: '0.75rem', cursor: submitting ? 'not-allowed' : 'pointer' }}
                          >
                            {submitting ? 'Saving match data...' : 'Save Match Data & Send Alert'}
                          </button>
                        </>
                      )}
                    </form>

                    {/* Controller Action List */}
                    <div>
                      <h3 style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                        Active Fixtures Actions
                      </h3>
                      {fixtures.filter(f => f.status !== 'FINISHED').slice(0, 5).map(f => (
                        <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{fixtureLabel(f)}</div>
                            <div style={{ fontSize: '0.7rem', color: f.status === 'LIVE' ? '#ff6b6b' : 'rgba(255,255,255,0.4)' }}>
                              Status: {f.status} • {f.date} {f.time}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleWarningTrigger(f.id)}
                              style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700', borderRadius: '0.3rem', fontSize: '0.7rem', padding: '0.35rem 0.60rem', cursor: 'pointer' }}
                            >
                              🔔 15m Warning
                            </button>
                            {f.status === 'UPCOMING' && (
                              <button
                                onClick={() => handleStartMatch(f.id)}
                                style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700', borderRadius: '0.3rem', fontSize: '0.7rem', padding: '0.35rem 0.60rem', cursor: 'pointer' }}
                              >
                                Start Match
                              </button>
                            )}
                            {f.status === 'LIVE' && (
                              <button
                                onClick={() => handleEndMatch(f.id)}
                                style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.3)', color: '#ff6b6b', borderRadius: '0.3rem', fontSize: '0.7rem', padding: '0.35rem 0.60rem', cursor: 'pointer' }}
                              >
                                Full Time
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: TEAMS MANAGEMENT */}
            {activeTab === 'teams' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '2rem' }}>
                {/* Team Roster Form */}
                <div style={globalCardStyle}>
                  <h2 style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    {editTeamId ? '✍️ Edit Team' : '➕ Add New Team'}
                  </h2>
                  <form onSubmit={handleTeamSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Team Name</label>
                      <input type="text" required value={teamForm.name} onChange={e => setTeamForm({ ...teamForm, name: e.target.value })} placeholder="e.g. LIONS FC" style={inputStyle} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Short Name</label>
                        <input type="text" maxLength={4} required value={teamForm.shortName} onChange={e => setTeamForm({ ...teamForm, shortName: e.target.value })} placeholder="e.g. LFC" style={inputStyle} />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Upload Team Logo (PNG/SVG/JPEG)</label>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (b64) => setTeamForm({ ...teamForm, logo: b64 }))} style={{ color: '#fff', fontSize: '0.8rem' }} />
                      {teamForm.logo && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img src={teamForm.logo} alt="Preview" style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', objectFit: 'contain' }} />
                          <span style={{ fontSize: '0.7rem', color: '#FFD700' }}>Logo Ready!</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Manager</label>
                        <input type="text" value={teamForm.manager} onChange={e => setTeamForm({ ...teamForm, manager: e.target.value })} style={inputStyle} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Founded</label>
                        <input type="number" value={teamForm.founded} onChange={e => setTeamForm({ ...teamForm, founded: Number(e.target.value) })} style={inputStyle} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Primary Color</label>
                        <input type="color" value={teamForm.primaryColor} onChange={e => setTeamForm({ ...teamForm, primaryColor: e.target.value })} style={{ ...inputStyle, padding: 0, height: 35, cursor: 'pointer' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Secondary Color</label>
                        <input type="color" value={teamForm.secondaryColor} onChange={e => setTeamForm({ ...teamForm, secondaryColor: e.target.value })} style={{ ...inputStyle, padding: 0, height: 35, cursor: 'pointer' }} />
                      </div>
                    </div>



                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button type="submit" disabled={submitting} style={{ flex: 1, background: '#FFD700', color: '#050508', border: 'none', borderRadius: '0.4rem', fontWeight: 800, padding: '0.75rem', cursor: 'pointer' }}>
                        {editTeamId ? 'Save Edits' : 'Create Team'}
                      </button>
                      {editTeamId && (
                        <button type="button" onClick={() => {
                          setEditTeamId(null);
                          setTeamForm({ name: '', shortName: '', slug: '', logo: '', city: '', founded: 2026, manager: '', stadium: '', primaryColor: '#FFD700', secondaryColor: '#0A0A0F', description: '' });
                        }} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.4rem', padding: '0.75rem', cursor: 'pointer' }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Team Directory List */}
                <div style={globalCardStyle}>
                  <h2 style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    🏆 Team Directory
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {teams.map(t => (
                      <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {t.logo ? (
                            <img src={t.logo} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'contain' }} />
                          ) : (
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>⚽</div>
                          )}
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{t.name} ({t.shortName})</div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Manager: {t.manager} • Stadium: {t.stadium}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => {
                              setEditTeamId(t.id);
                              setTeamForm({
                                name: t.name, shortName: t.shortName, slug: t.slug, logo: t.logo || '',
                                city: t.city || '', founded: t.founded || 2026, manager: t.manager || '',
                                stadium: t.stadium || '', primaryColor: t.primaryColor || '#FFD700',
                                secondaryColor: t.secondaryColor || '#0A0A0F', description: t.description || ''
                              });
                            }}
                            style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Are you sure you want to delete ${t.name}?`)) {
                                try {
                                  const res_mo7li = await deleteTeam(t.id);
      if (res_mo7li && !res_mo7li.success) throw new Error(res_mo7li.error || 'Failed');;
                                  showFeedback('Team deleted successfully!');
                                  fetchData();
                                } catch {
                                  showFeedback('', 'Failed to delete team.');
                                }
                              }
                            }}
                            style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PLAYERS MANAGEMENT */}
            {activeTab === 'players' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '2rem' }}>
                {/* Player Form */}
                <div style={globalCardStyle}>
                  <h2 style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    {editPlayerId ? '✍️ Edit Player' : '➕ Add New Player'}
                  </h2>
                  <form onSubmit={handlePlayerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Player Name</label>
                      <input type="text" required value={playerForm.name} onChange={e => setPlayerForm({ ...playerForm, name: e.target.value })} placeholder="e.g. Arjun Junior" style={inputStyle} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Select Team</label>
                        <select required value={playerForm.teamId} onChange={e => setPlayerForm({ ...playerForm, teamId: e.target.value })} style={inputStyle}>
                          <option value="">-- Select Team --</option>
                          {teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Position</label>
                        <input type="text" required value={playerForm.position} onChange={e => setPlayerForm({ ...playerForm, position: e.target.value })} placeholder="e.g. Left Wing" style={inputStyle} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Age</label>
                        <input type="number" required min="15" max="45" value={playerForm.age} onChange={e => setPlayerForm({ ...playerForm, age: Number(e.target.value) })} style={inputStyle} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                      <div>
                        <label style={labelStyle}>Goals</label>
                        <input type="number" min="0" value={playerForm.goals} onChange={e => setPlayerForm({ ...playerForm, goals: Number(e.target.value) })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Assists</label>
                        <input type="number" min="0" value={playerForm.assists} onChange={e => setPlayerForm({ ...playerForm, assists: Number(e.target.value) })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Clean Sheets</label>
                        <input type="number" min="0" value={playerForm.cleanSheets} onChange={e => setPlayerForm({ ...playerForm, cleanSheets: Number(e.target.value) })} style={inputStyle} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Yellow Cards</label>
                        <input type="number" min="0" value={playerForm.yellowCards} onChange={e => setPlayerForm({ ...playerForm, yellowCards: Number(e.target.value) })} style={inputStyle} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Red Cards</label>
                        <input type="number" min="0" value={playerForm.redCards} onChange={e => setPlayerForm({ ...playerForm, redCards: Number(e.target.value) })} style={inputStyle} />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Upload Photo (JPEG/PNG)</label>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (b64) => setPlayerForm({ ...playerForm, photo: b64 }))} style={{ color: '#fff', fontSize: '0.8rem' }} />
                      {playerForm.photo && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img src={playerForm.photo} alt="Preview" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                          <span style={{ fontSize: '0.7rem', color: '#FFD700' }}>Photo Ready!</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button type="submit" disabled={submitting} style={{ flex: 1, background: '#FFD700', color: '#050508', border: 'none', borderRadius: '0.4rem', fontWeight: 800, padding: '0.75rem', cursor: 'pointer' }}>
                        {editPlayerId ? 'Save Edits' : 'Create Player'}
                      </button>
                      {editPlayerId && (
                        <button type="button" onClick={() => {
                          setEditPlayerId(null);
                          setPlayerForm({ name: '', teamId: teams[0]?.id || '', position: 'MID', number: 10, nationality: 'India', age: 22, photo: '', goals: 0, assists: 0, matches: 0, yellowCards: 0, redCards: 0, cleanSheets: 0, rating: 6.0 });
                        }} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.4rem', padding: '0.75rem', cursor: 'pointer' }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Player Directory List */}
                <div style={globalCardStyle}>
                  <h2 style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    ⚽ Player Directory
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 600, overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {players.map(p => {
                      const playerTeam = teams.find(t => t.id === p.teamId);
                      return (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.01)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {p.photo ? (
                              <img src={p.photo} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>👤</div>
                            )}
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{p.name} (#{p.number})</div>
                              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                                {playerTeam?.name || 'Free Agent'} • {p.position} • Rating: {p.rating}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: '#FFD700', marginTop: '0.1rem' }}>
                                Goals: {p.goals} | Yellow: {p.yellowCards} | Red: {p.redCards} | Played: {p.matches}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => {
                                setEditPlayerId(p.id);
                                setPlayerForm({
                                  name: p.name, teamId: p.teamId, position: p.position || 'MID',
                                  number: p.number || 10, nationality: p.nationality || 'India',
                                  age: p.age || 22, photo: p.photo || '',
                                  goals: p.goals || 0, assists: p.assists || 0, matches: p.matches || 0,
                                  yellowCards: p.yellowCards || 0, redCards: p.redCards || 0,
                                  cleanSheets: p.cleanSheets || 0, rating: p.rating || 6.0
                                });
                              }}
                              style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                                  try {
                                    const res_qkp3c = await deletePlayer(p.id);
      if (res_qkp3c && !res_qkp3c.success) throw new Error(res_qkp3c.error || 'Failed');;
                                    showFeedback('Player removed successfully!');
                                    fetchData();
                                  } catch {
                                    showFeedback('', 'Failed to delete player.');
                                  }
                                }
                              }}
                              style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: FIXTURES/MATCHES MANAGEMENT */}
            {activeTab === 'fixtures' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '2rem' }}>
                {/* Fixture Schedule Form */}
                <div style={globalCardStyle}>
                  <h2 style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    {editFixtureId ? '✍️ Edit Match Details' : '📅 Schedule Fixture'}
                  </h2>
                  <form onSubmit={handleFixtureSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Home Team</label>
                        <select required value={fixtureForm.homeTeamId} onChange={e => setFixtureForm({ ...fixtureForm, homeTeamId: e.target.value })} style={inputStyle}>
                          <option value="">-- Select --</option>
                          {teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Away Team</label>
                        <select required value={fixtureForm.awayTeamId} onChange={e => setFixtureForm({ ...fixtureForm, awayTeamId: e.target.value })} style={inputStyle}>
                          <option value="">-- Select --</option>
                          {teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Date (YYYY-MM-DD)</label>
                        <input type="text" required value={fixtureForm.date} onChange={e => setFixtureForm({ ...fixtureForm, date: e.target.value })} placeholder="e.g. 2026-06-25" style={inputStyle} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Time (HH:MM)</label>
                        <input type="text" required value={fixtureForm.time} onChange={e => setFixtureForm({ ...fixtureForm, time: e.target.value })} placeholder="e.g. 20:00" style={inputStyle} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Matchday</label>
                        <input type="number" required min="1" value={fixtureForm.matchday} onChange={e => setFixtureForm({ ...fixtureForm, matchday: Number(e.target.value) })} style={inputStyle} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Status</label>
                        <select value={fixtureForm.status} onChange={e => setFixtureForm({ ...fixtureForm, status: e.target.value })} style={inputStyle}>
                          <option value="UPCOMING">Upcoming</option>
                          <option value="LIVE">Live</option>
                          <option value="FINISHED">Finished (Full Time)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Venue</label>
                        <input type="text" required value={fixtureForm.venue} onChange={e => setFixtureForm({ ...fixtureForm, venue: e.target.value })} placeholder="e.g. Pettikada Arena" style={inputStyle} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Man of the Match</label>
                        <select value={fixtureForm.manOfTheMatchId} onChange={e => setFixtureForm({ ...fixtureForm, manOfTheMatchId: e.target.value })} style={inputStyle}>
                          <option value="">-- Select --</option>
                          {players.filter(p => p.teamId === fixtureForm.homeTeamId || p.teamId === fixtureForm.awayTeamId).map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {(fixtureForm.status === 'FINISHED' || fixtureForm.status === 'LIVE') && (
                      <>
                        <div style={{ display: 'flex', gap: '1rem', padding: '0.75rem', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '0.4rem', background: 'rgba(255,215,0,0.02)' }}>
                          <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Home Score</label>
                            <input type="number" min="0" value={fixtureForm.homeScore} onChange={e => setFixtureForm({ ...fixtureForm, homeScore: Number(e.target.value) })} style={inputStyle} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Away Score</label>
                            <input type="number" min="0" value={fixtureForm.awayScore} onChange={e => setFixtureForm({ ...fixtureForm, awayScore: Number(e.target.value) })} style={inputStyle} />
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Home Goal Scorers</label>
                            <input type="text" value={fixtureHomeScorersInput} onChange={e => setFixtureForm({ ...fixtureForm, goalScorers: `${e.target.value} | ${fixtureAwayScorersInput}` })} placeholder="e.g. Home Scorers" style={inputStyle} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Away Goal Scorers</label>
                            <input type="text" value={fixtureAwayScorersInput} onChange={e => setFixtureForm({ ...fixtureForm, goalScorers: `${fixtureHomeScorersInput} | ${e.target.value}` })} placeholder="e.g. Away Scorers" style={inputStyle} />
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Home Yellow Cards</label>
                            <input type="text" value={fixtureHomeYellowsInput} onChange={e => setFixtureForm({ ...fixtureForm, yellowCards: `${e.target.value} | ${fixtureAwayYellowsInput}` })} placeholder="e.g. Home Yellows" style={inputStyle} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Away Yellow Cards</label>
                            <input type="text" value={fixtureAwayYellowsInput} onChange={e => setFixtureForm({ ...fixtureForm, yellowCards: `${fixtureHomeYellowsInput} | ${e.target.value}` })} placeholder="e.g. Away Yellows" style={inputStyle} />
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Home Red Cards</label>
                            <input type="text" value={fixtureHomeRedsInput} onChange={e => setFixtureForm({ ...fixtureForm, redCards: `${e.target.value} | ${fixtureAwayRedsInput}` })} placeholder="e.g. Home Reds" style={inputStyle} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Away Red Cards</label>
                            <input type="text" value={fixtureAwayRedsInput} onChange={e => setFixtureForm({ ...fixtureForm, redCards: `${fixtureHomeRedsInput} | ${e.target.value}` })} placeholder="e.g. Away Reds" style={inputStyle} />
                          </div>
                        </div>

                        <div>
                          <label style={labelStyle}>Match Report</label>
                          <textarea rows={3} value={fixtureForm.matchReport} onChange={e => setFixtureForm({ ...fixtureForm, matchReport: e.target.value })} style={{ ...inputStyle, resize: 'none' }} />
                        </div>
                      </>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button type="submit" disabled={submitting} style={{ flex: 1, background: '#FFD700', color: '#050508', border: 'none', borderRadius: '0.4rem', fontWeight: 800, padding: '0.75rem', cursor: 'pointer' }}>
                        {editFixtureId ? 'Save Edits' : 'Schedule Match'}
                      </button>
                      {editFixtureId && (
                        <button type="button" onClick={() => {
                          setEditFixtureId(null);
                          setFixtureForm({ homeTeamId: teams[0]?.id || '', awayTeamId: teams[1]?.id || '', date: '', time: '', venue: '', matchday: 1, status: 'UPCOMING', homeScore: 0, awayScore: 0, goalScorers: '', yellowCards: '', redCards: '', manOfTheMatchId: '', matchReport: '', referee: '', attendance: 0 });
                        }} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.4rem', padding: '0.75rem', cursor: 'pointer' }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Fixture Schedule List */}
                <div style={globalCardStyle}>
                  <h2 style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    📅 Fixtures Schedule
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 550, overflowY: 'auto' }}>
                    {fixtures.map(f => (
                      <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.01)' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                            {fixtureLabel(f)}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>
                            Matchday {f.matchday} • {f.date} @ {f.time} • {f.venue}
                          </div>
                          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                            <span style={{ fontSize: '0.65rem', display: 'inline-block', padding: '0.1rem 0.4rem', borderRadius: '0.2rem', background: f.status === 'LIVE' ? 'rgba(255,80,80,0.15)' : 'rgba(255,255,255,0.05)', color: f.status === 'LIVE' ? '#ff6b6b' : '#FFD700', fontWeight: 700, textTransform: 'uppercase' }}>
                              {f.status}
                            </span>

                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          {f.status === 'FINISHED' && !f.predictionWinnerName && (
                            <button
                              onClick={async () => {
                                if (confirm('Pick a random prediction winner for this match?')) {
                                  try {
                                    const res = await fetch('/api/admin/predictions/pick-winner', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ fixtureId: f.id })
                                    });
                                    const data = await res.json();
                                    if (!res.ok) throw new Error(data.error);
                                    alert(`🎉 Prediction Winner: ${data.winner}`);
                                    // You can't call showFeedback directly here unless it's defined, but it is.
                                    // Actually showFeedback is available in this scope.
                                    fetchData(); // reload
                                  } catch (e: any) {
                                    alert(`Failed: ${e.message}`);
                                  }
                                }
                              }}
                              style={{ background: '#FFD700', border: 'none', color: '#000', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase' }}
                            >
                              Pick Winner
                            </button>
                          )}
                          {f.predictionWinnerName && (
                            <span style={{ fontSize: '0.65rem', color: '#FFD700', fontWeight: 600 }}>Winner: {f.predictionWinnerName}</span>
                          )}
                          <button
                            onClick={() => {
                              setEditFixtureId(f.id);
                              setFixtureForm({
                                homeTeamId: f.homeTeamId, awayTeamId: f.awayTeamId, date: f.date, time: f.time,
                                venue: f.venue, matchday: f.matchday, status: f.status,
                                homeScore: f.homeScore ?? 0, awayScore: f.awayScore ?? 0,
                                goalScorers: f.goalScorers || '', yellowCards: f.yellowCards || '',
                                redCards: f.redCards || '', manOfTheMatchId: f.manOfTheMatchId || '',
                                matchReport: f.matchReport || '', referee: f.referee || '',
                                attendance: f.attendance ?? 0
                              });
                            }}
                            style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this fixture?')) {
                                try {
                                  const res_ogkt0 = await deleteFixture(f.id);
      if (res_ogkt0 && !res_ogkt0.success) throw new Error(res_ogkt0.error || 'Failed');;
                                  showFeedback('Fixture deleted successfully!');
                                  fetchData();
                                } catch {
                                  showFeedback('', 'Failed to delete fixture.');
                                }
                              }
                            }}
                            style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: NEWS MANAGEMENT */}
            {activeTab === 'news' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '2rem' }}>
                {/* News Article Form */}
                <div style={globalCardStyle}>
                  <h2 style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    {editNewsId ? '✍️ Edit News' : '📝 Write News Article'}
                  </h2>
                  <form onSubmit={handleNewsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Article Title</label>
                      <input type="text" required value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} placeholder="e.g. Lions FC win 2-1 in Matchday 11" style={inputStyle} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Category</label>
                        <select value={newsForm.category} onChange={e => setNewsForm({ ...newsForm, category: e.target.value })} style={inputStyle}>
                          <option value="MATCH_REPORT">Match Report</option>
                          <option value="TRANSFER">Transfer News</option>
                          <option value="INJURY">Injury Update</option>
                          <option value="PREVIEW">Match Preview</option>
                          <option value="FEATURE">Club Feature</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Author</label>
                        <input type="text" required value={newsForm.author} onChange={e => setNewsForm({ ...newsForm, author: e.target.value })} style={inputStyle} />
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginTop: '1.2rem' }}>
                        <input type="checkbox" checked={newsForm.featured} onChange={e => setNewsForm({ ...newsForm, featured: e.target.checked })} style={{ accentColor: '#FFD700' }} />
                        Featured Article
                      </label>
                    </div>

                    <div>
                      <label style={labelStyle}>Man of the Match name (for article card)</label>
                      <input type="text" value={newsForm.manOfTheMatch} onChange={e => setNewsForm({ ...newsForm, manOfTheMatch: e.target.value })} placeholder="e.g. Arjun Faize" style={inputStyle} />
                    </div>



                    <div>
                      <label style={labelStyle}>Upload Cover Image (JPEG/PNG)</label>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (b64) => setNewsForm({ ...newsForm, coverImage: b64 }))} style={{ color: '#fff', fontSize: '0.8rem' }} />
                      {newsForm.coverImage && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img src={newsForm.coverImage} alt="Cover Preview" style={{ width: 45, height: 30, borderRadius: '4px', objectFit: 'cover' }} />
                          <span style={{ fontSize: '0.7rem', color: '#FFD700' }}>Cover Ready!</span>
                        </div>
                      )}
                    </div>



                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button type="submit" disabled={submitting} style={{ flex: 1, background: '#FFD700', color: '#050508', border: 'none', borderRadius: '0.4rem', fontWeight: 800, padding: '0.75rem', cursor: 'pointer' }}>
                        {editNewsId ? 'Save Edits' : 'Publish Article'}
                      </button>
                      {editNewsId && (
                        <button type="button" onClick={() => {
                          setEditNewsId(null);
                          setNewsForm({ title: '', slug: '', excerpt: '', content: '', category: 'MATCH_REPORT', author: 'SLS Admin', coverImage: '', featured: false, tags: '', manOfTheMatch: '' });
                        }} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.4rem', padding: '0.75rem', cursor: 'pointer' }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* News Articles Directory */}
                <div style={globalCardStyle}>
                  <h2 style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    📰 News Articles
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 580, overflowY: 'auto' }}>
                    {news.map(n => (
                      <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {n.coverImage ? (
                            <img src={n.coverImage} alt="" style={{ width: 45, height: 30, borderRadius: '0.25rem', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: 45, height: 30, borderRadius: '0.25rem', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>📰</div>
                          )}
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{n.title.slice(0, 35)}...</div>
                            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>
                              By {n.author} • Category: {n.category} {n.manOfTheMatch && `• MOTM: ${n.manOfTheMatch}`}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => {
                              setEditNewsId(n.id);
                              setNewsForm({
                                title: n.title, slug: n.slug, excerpt: n.excerpt || '',
                                content: n.content || '', category: n.category || 'MATCH_REPORT',
                                author: n.author || 'SLS Admin', coverImage: n.coverImage || '',
                                featured: n.featured || false, tags: n.tags || '', manOfTheMatch: n.manOfTheMatch || ''
                              });
                            }}
                            style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this news article?')) {
                                try {
                                  const res_rhykg = await deleteNews(n.id);
      if (res_rhykg && !res_rhykg.success) throw new Error(res_rhykg.error || 'Failed');;
                                  showFeedback('Article deleted successfully!');
                                  fetchData();
                                } catch {
                                  showFeedback('', 'Failed to delete article.');
                                }
                              }
                            }}
                            style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SPONSORS MANAGEMENT */}
            {activeTab === 'sponsors' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '2rem' }}>
                <div style={globalCardStyle}>
                  <h2 style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    {editSponsorId ? '✍️ Edit Sponsor' : '➕ Add Sponsor'}
                  </h2>
                  <form onSubmit={handleSponsorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Sponsor Name</label>
                      <input type="text" required value={sponsorForm.name} onChange={e => setSponsorForm({ ...sponsorForm, name: e.target.value })} placeholder="e.g. Kerala Bank" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Website URL</label>
                      <input type="text" value={sponsorForm.url} onChange={e => setSponsorForm({ ...sponsorForm, url: e.target.value })} placeholder="https://example.com" style={inputStyle} />
                    </div>
                     <div>
  <label style={labelStyle}>Description</label>
  <input
    type="text"
    placeholder="Type anything..."
    value={sponsorForm.description || ''}
    onChange={e =>
      setSponsorForm({
        ...sponsorForm,
        description: e.target.value
      })
    }
    style={inputStyle}
  />
</div>
                    <div>
                      <label style={labelStyle}>Upload Logo (PNG/SVG)</label>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (b64) => setSponsorForm({ ...sponsorForm, logo: b64 }))} style={{ color: '#fff', fontSize: '0.8rem' }} />
                      {sponsorForm.logo && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img src={sponsorForm.logo} alt="" style={{ width: 80, height: 35, objectFit: 'contain', background: 'rgba(255,255,255,0.05)' }} />
                          <span style={{ fontSize: '0.7rem', color: '#FFD700' }}>Logo Ready!</span>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button type="submit" disabled={submitting} style={{ flex: 1, background: '#FFD700', color: '#050508', border: 'none', borderRadius: '0.4rem', fontWeight: 800, padding: '0.75rem', cursor: 'pointer' }}>
                        {editSponsorId ? 'Save Sponsor' : 'Add Sponsor'}
                      </button>
                      {editSponsorId && (
                        <button type="button" onClick={() => {
                          setEditSponsorId(null);
                          setSponsorForm({ name: '', logo: '', url: '', tier: 'GOLD', description: '' });
                        }} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.4rem', padding: '0.75rem', cursor: 'pointer' }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div style={globalCardStyle}>
                  <h2 style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    🤝 League Sponsors
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {sponsors.map(s => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={s.logo} alt="" style={{ width: 60, height: 25, objectFit: 'contain', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{s.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Tier: {s.tier}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => {
                              setEditSponsorId(s.id);
                              setSponsorForm({ name: s.name, logo: s.logo || '', url: s.url || '', tier: s.tier, description: s.description || '' });
                            }}
                            style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete sponsor ${s.name}?`)) {
                                const res_of019 = await deleteSponsor(s.id);
      if (res_of019 && !res_of019.success) throw new Error(res_of019.error || 'Failed');;
                                showFeedback('Sponsor deleted!');
                                fetchData();
                              }
                            }}
                            style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GALLERY MANAGEMENT */}
            {activeTab === 'gallery' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '2rem' }}>
                <div style={globalCardStyle}>
                  <h2 style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    {editGalleryId ? '✍️ Edit Image' : '🖼️ Add Gallery Photo'}
                  </h2>
                  <form onSubmit={handleGallerySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Caption</label>
                      <input type="text" required value={galleryForm.caption} onChange={e => setGalleryForm({ ...galleryForm, caption: e.target.value })} placeholder="e.g. Fans celebrating at stadium" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Related Match (Optional)</label>
                      <select value={galleryForm.matchId} onChange={e => setGalleryForm({ ...galleryForm, matchId: e.target.value })} style={inputStyle}>
                        <option value="">-- None --</option>
                        {fixtures.map(f => (
                          <option key={f.id} value={f.id}>{fixtureLabel(f)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Tags (comma separated)</label>
                      <input type="text" value={galleryForm.tags} onChange={e => setGalleryForm({ ...galleryForm, tags: e.target.value })} placeholder="e.g. Fans, Pettikada, Stadium" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Upload Image File (JPEG/PNG)</label>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (b64) => setGalleryForm({ ...galleryForm, url: b64 }))} style={{ color: '#fff', fontSize: '0.8rem' }} />
                      {galleryForm.url && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img src={galleryForm.url} alt="" style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: '4px' }} />
                          <span style={{ fontSize: '0.7rem', color: '#FFD700' }}>Photo Ready!</span>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button type="submit" disabled={submitting} style={{ flex: 1, background: '#FFD700', color: '#050508', border: 'none', borderRadius: '0.4rem', fontWeight: 800, padding: '0.75rem', cursor: 'pointer' }}>
                        {editGalleryId ? 'Save Photo' : 'Add Photo'}
                      </button>
                      {editGalleryId && (
                        <button type="button" onClick={() => {
                          setEditGalleryId(null);
                          setGalleryForm({ url: '', caption: '', matchId: '', tags: '' });
                        }} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.4rem', padding: '0.75rem', cursor: 'pointer' }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div style={globalCardStyle}>
                  <h2 style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    🖼️ Gallery Images ({gallery.length})
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(140px, 100%), 1fr))', gap: '1rem', maxHeight: 550, overflowY: 'auto' }}>
                    {gallery.map(g => (
                      <div key={g.id} style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden', background: 'rgba(255,255,255,0.01)', position: 'relative' }}>
                        <img src={g.url} alt="" style={{ width: '100%', height: 90, objectFit: 'cover' }} />
                        <div style={{ padding: '0.5rem' }}>
                          <p style={{ fontSize: '0.7rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.caption}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                            <button onClick={() => {
                              setEditGalleryId(g.id);
                              setGalleryForm({ url: g.url || '', caption: g.caption || '', matchId: g.matchId || '', tags: g.tags || '' });
                            }} style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: '0.65rem', cursor: 'pointer' }}>Edit</button>
                            <button onClick={async () => {
                              if (confirm('Delete photo?')) {
                                const res_hmql1 = await deleteGalleryImage(g.id);
      if (res_hmql1 && !res_hmql1.success) throw new Error(res_hmql1.error || 'Failed');;
                                showFeedback('Photo deleted!');
                                fetchData();
                              }
                            }} style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '0.65rem', cursor: 'pointer' }}>Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ALERTS / NOTIFICATIONS MANAGEMENT */}
            {activeTab === 'notifications' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '2rem' }}>
                <div style={globalCardStyle}>
                  <h2 style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    {editNotificationId ? '✍️ Edit Alert' : '📢 Broadcast Custom Alert'}
                  </h2>
                  <form onSubmit={handleNotificationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Notification Title</label>
                      <input type="text" required value={notificationForm.title} onChange={e => setNotificationForm({ ...notificationForm, title: e.target.value })} placeholder="e.g. WEATHER DELAY" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Alert Message</label>
                      <textarea rows={3} required value={notificationForm.message} onChange={e => setNotificationForm({ ...notificationForm, message: e.target.value })} placeholder="Write notification message..." style={{ ...inputStyle, resize: 'none' }} />
                    </div>
                    <button type="submit" disabled={submitting} style={{ background: '#FFD700', color: '#050508', border: 'none', borderRadius: '0.4rem', fontWeight: 800, padding: '0.75rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                      {editNotificationId ? 'Save Notification' : 'Broadcast & Save'}
                    </button>
                  </form>
                </div>

                <div style={globalCardStyle}>
                  <h2 style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    📢 Alert Broadcast History
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 500, overflowY: 'auto' }}>
                    {notifications.map(n => (
                      <div key={n.id} style={{ padding: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFD700' }}>{n.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.2rem' }}>{n.message}</div>
                          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.4rem' }}>{new Date(n.createdAt).toLocaleString()}</div>
                        </div>
                        <button
                          onClick={async () => {
                            if (confirm('Delete alert history?')) {
                              await deleteNotification(n.id);
                              showFeedback('Alert deleted!');
                              fetchData();
                            }
                          }}
                          style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: USERS MANAGEMENT */}
            {activeTab === 'users' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '2rem' }}>
                <div style={globalCardStyle}>
                  <h2 style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    {editUserId ? '✍️ Edit User Account' : '👤 Create User Account'}
                  </h2>
                  <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>User Name</label>
                      <input type="text" required value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} placeholder="e.g. John Doe" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address</label>
                      <input type="email" required value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} placeholder="e.g. john@example.com" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Password {editUserId && '(Leave blank to keep unchanged)'}</label>
                      <input type="password" required={!editUserId} value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} placeholder="••••••••" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>System Role</label>
                      <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })} style={inputStyle}>
                        <option value="user">User (Standard Access)</option>
                        <option value="admin">Admin (Console Hub Access)</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button type="submit" disabled={submitting} style={{ flex: 1, background: '#FFD700', color: '#050508', border: 'none', borderRadius: '0.4rem', fontWeight: 800, padding: '0.75rem', cursor: 'pointer' }}>
                        {editUserId ? 'Save Account' : 'Create User'}
                      </button>
                      {editUserId && (
                        <button type="button" onClick={() => {
                          setEditUserId(null);
                          setUserForm({ name: '', email: '', password: '', role: 'user' });
                        }} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.4rem', padding: '0.75rem', cursor: 'pointer' }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div style={globalCardStyle}>
                  <h2 style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    👥 User Accounts Directory
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {users.map(u => (
                      <div key={u.id} style={{ padding: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{u.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{u.email}</div>
                          <span style={{ display: 'inline-block', fontSize: '0.65rem', background: u.role === 'admin' ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)', color: u.role === 'admin' ? '#FFD700' : '#aaa', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', marginTop: '0.3rem' }}>{u.role}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => {
                              setEditUserId(u.id);
                              setUserForm({ name: u.name, email: u.email, password: '', role: u.role });
                            }}
                            style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete account for ${u.name}?`)) {
                                const res_8jy71 = await deleteUser(u.id);
      if (res_8jy71 && !res_8jy71.success) throw new Error(res_8jy71.error || 'Failed');;
                                showFeedback('User deleted!');
                                fetchData();
                              }
                            }}
                            style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: STANDINGS (read-only, auto-calculated) */}
            {activeTab === 'standings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>🏆 League Standings</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Auto-calculated from finished fixtures. Click Recalculate after entering results.</p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        setSubmitting(true);
                        const res_i8zsv = await triggerRecalculate();
      if (res_i8zsv && !res_i8zsv.success) throw new Error(res_i8zsv.error || 'Failed');;
                        showFeedback('Standings recalculated successfully!');
                        fetchData();
                      } catch {
                        showFeedback('', 'Failed to recalculate standings.');
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    disabled={submitting}
                    style={{ background: 'linear-gradient(135deg, #FFD700, #E6C200)', color: '#050508', border: 'none', borderRadius: '0.5rem', fontWeight: 800, padding: '0.65rem 1.5rem', cursor: 'pointer', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                  >
                    {submitting ? '⏳ Recalculating…' : '🔄 Recalculate Now'}
                  </button>
                </div>

                {/* Standings Table */}
                <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,215,0,0.06)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        {['#', 'Team', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts', 'Form'].map(h => (
                          <th key={h} style={{ padding: '0.75rem 1rem', textAlign: h === 'Team' ? 'left' : 'center', color: '#FFD700', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {standings.length === 0 ? (
                        <tr><td colSpan={11} style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)' }}>No standings data yet — schedule & finish some matches first.</td></tr>
                      ) : standings.map((s: any, i: number) => {
                        const qualifies = i < 4;
                        return (
                          <tr key={s.id ?? s.teamId ?? i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent', transition: 'background 0.2s' }}>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 700, color: qualifies ? '#FFD700' : 'rgba(255,255,255,0.5)' }}>{s.position ?? i + 1}</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800, color: '#FFD700', flexShrink: 0 }}>
                                  {(s.team?.shortName ?? s.teamShort ?? '?').slice(0, 3)}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, color: '#fff' }}>{s.team?.name ?? s.teamName ?? '—'}</div>
                                  {qualifies && <div style={{ fontSize: '0.6rem', color: '#4CAF50', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Qualified</div>}
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>{s.played ?? 0}</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#4CAF50', fontWeight: 600 }}>{s.won ?? 0}</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>{s.drawn ?? 0}</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#ff6b6b' }}>{s.lost ?? 0}</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>{s.goalsFor ?? 0}</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>{s.goalsAgainst ?? 0}</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: (s.goalDifference ?? 0) > 0 ? '#4CAF50' : (s.goalDifference ?? 0) < 0 ? '#ff6b6b' : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                              {(s.goalDifference ?? 0) > 0 ? '+' : ''}{s.goalDifference ?? 0}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 900, fontSize: '0.95rem', color: '#FFD700' }}>{s.points ?? 0}</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '0.2rem', justifyContent: 'center' }}>
                                {(typeof s.form === 'string' ? (s.form ? s.form.split(',') : []) : (s.form || [])).slice(-5).map((r: string, fi: number) => (
                                  <span key={fi} style={{ width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 800, background: r === 'W' ? 'rgba(76,175,80,0.2)' : r === 'L' ? 'rgba(255,107,107,0.2)' : 'rgba(255,255,255,0.08)', color: r === 'W' ? '#4CAF50' : r === 'L' ? '#ff6b6b' : '#aaa', border: `1px solid ${r === 'W' ? 'rgba(76,175,80,0.4)' : r === 'L' ? 'rgba(255,107,107,0.4)' : 'rgba(255,255,255,0.1)'}` }}>
                                    {r}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
