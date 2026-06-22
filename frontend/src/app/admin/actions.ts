'use server';

import { prisma } from '@/lib/prisma';
import { recalculateStandings } from '@/lib/standings';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { signAdminJWT } from '@/lib/jwt';
import { recalculatePlayerStats } from '@/lib/playerStats';
import { matchEvents } from '@/lib/events';
import { saveBase64Image } from '@/lib/upload';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

// Helper for unified error handling
async function withErrorHandling<T>(action: () => Promise<T>) {
  try {
    const data = await action();
    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Server Action Error:', err);
    return { success: false, data: null, error: err.message || 'An unexpected error occurred' };
  }
}


// Helper to broadcast event payloads to active SSE client streams
function broadcastEvent(type: string, data: Record<string, unknown>) {
  const payload = { type, timestamp: new Date().toISOString(), ...data };
  try {
    matchEvents.emit('update', payload);
  } catch (err) {
    console.error('Failed to emit event:', err);
  }
}

// Explicit stats recalculation action
export async function triggerRecalculate() {
  return withErrorHandling(async () => {

  await recalculateStandings();
  await recalculatePlayerStats();
  revalidatePath('/');
  revalidatePath('/standings');
  revalidatePath('/players');
  broadcastEvent('STANDINGS_UPDATE', {});
  return { success: true };

  });
}

// Teams CRUD Actions
export async function saveTeam(formData: {
  id?: string;
  name: string;
  shortName: string;
  slug: string;
  logo: string;
  city: string;
  founded: number;
  manager: string;
  stadium: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
}) {
  return withErrorHandling(async () => {

  // Save logo as image file
  const fileName = `team-logo-${Date.now()}.jpg`;
  const logoUrl = await saveBase64Image(formData.logo, fileName);

  const data = {
    name: formData.name,
    shortName: formData.shortName.toUpperCase(),
    slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    logo: logoUrl || '/logos/lfc.svg',
    city: '',
    founded: Number(formData.founded),
    manager: formData.manager,
    stadium: '',
    primaryColor: formData.primaryColor,
    secondaryColor: formData.secondaryColor,
    description: '',
  };

  let team;
  if (formData.id) {
    team = await prisma.team.update({
      where: { id: formData.id },
      data,
    });
  } else {
    team = await prisma.team.create({
      data,
    });
    // Create default standings row
    await prisma.standing.create({
      data: {
        position: 99,
        teamId: team.id,
        form: '',
        positionChange: 'SAME',
      },
    });
    await recalculateStandings();
  }

  revalidatePath('/');
  revalidatePath('/teams');
  revalidatePath(`/teams/${team.slug}`);
  revalidatePath('/standings');
  broadcastEvent('STANDINGS_UPDATE', {});
  return team;

  });
}

export async function deleteTeam(id: string) {
  return withErrorHandling(async () => {

  const team = await prisma.team.delete({
    where: { id },
  });
  await recalculateStandings();
  revalidatePath('/');
  revalidatePath('/teams');
  revalidatePath('/standings');
  broadcastEvent('STANDINGS_UPDATE', {});
  return team;

  });
}

// Players CRUD Actions
export async function savePlayer(formData: {
  id?: string;
  name: string;
  teamId: string;
  position: string;
  number: number;
  nationality: string;
  nationalityFlag?: string;
  age: number;
  photo: string;
  goals?: number;
  assists?: number;
  matches?: number;
  yellowCards?: number;
  redCards?: number;
  cleanSheets?: number;
  rating?: number;
}) {
  return withErrorHandling(async () => {

  const fileName = `player-photo-${Date.now()}.jpg`;
  const photoUrl = await saveBase64Image(formData.photo, fileName);

  const data = {
    name: formData.name,
    teamId: formData.teamId,
    position: formData.position,
    number: Number(formData.number),
    nationality: formData.nationality,
    nationalityFlag: formData.nationalityFlag || '🇮🇳',
    age: Number(formData.age),
    photo: photoUrl || '/players/default.jpg',
    goals: Number(formData.goals ?? 0),
    assists: Number(formData.assists ?? 0),
    matches: Number(formData.matches ?? 0),
    yellowCards: Number(formData.yellowCards ?? 0),
    redCards: Number(formData.redCards ?? 0),
    cleanSheets: Number(formData.cleanSheets ?? 0),
    rating: Number(formData.rating ?? 6.0),
  };

  let player;
  if (formData.id) {
    player = await prisma.player.update({
      where: { id: formData.id },
      data,
    });
  } else {
    player = await prisma.player.create({
      data,
    });
  }

  // Auto recalculate stats when a player is saved to keep numbers in sync
  await recalculatePlayerStats();

  revalidatePath('/players');
  revalidatePath(`/players/${player.id}`);
  revalidatePath(`/teams`);
  return player;

  });
}

export async function deletePlayer(id: string) {
  return withErrorHandling(async () => {

  const player = await prisma.player.delete({
    where: { id },
  });
  await recalculatePlayerStats();
  revalidatePath('/players');
  return player;

  });
}

// Fixtures / Matches CRUD Actions
export async function saveFixture(formData: {
  id?: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  time: string;
  venue: string;
  matchday: number;
  status: string;
  homeScore?: number | null;
  awayScore?: number | null;
  goalScorers?: string | null;
  yellowCards?: string | null;
  redCards?: string | null;
  manOfTheMatchId?: string | null;
  matchReport?: string | null;
  referee?: string | null;
  attendance?: number | null;
}) {
  return withErrorHandling(async () => {

  const data = {
    homeTeamId: formData.homeTeamId,
    awayTeamId: formData.awayTeamId,
    date: formData.date,
    time: formData.time,
    venue: formData.venue,
    matchday: Number(formData.matchday),
    status: formData.status,
    homeScore: formData.homeScore !== undefined && formData.homeScore !== null ? Number(formData.homeScore) : null,
    awayScore: formData.awayScore !== undefined && formData.awayScore !== null ? Number(formData.awayScore) : null,
    goalScorers: formData.goalScorers || "",
    yellowCards: formData.yellowCards || "",
    redCards: formData.redCards || "",
    manOfTheMatchId: formData.manOfTheMatchId || null,
    matchReport: formData.matchReport || "",
    referee: formData.referee || "",
    attendance: formData.attendance !== undefined && formData.attendance !== null ? Number(formData.attendance) : 0,
  };

  let fixture;
  if (formData.id) {
    fixture = await prisma.fixture.update({
      where: { id: formData.id },
      data,
      include: { homeTeam: true, awayTeam: true },
    });
  } else {
    fixture = await prisma.fixture.create({
      data,
      include: { homeTeam: true, awayTeam: true },
    });
  }

  // Recalculate standings and player stats automatically
  await recalculateStandings();
  await recalculatePlayerStats();

  if (fixture.status === 'FINISHED') {
    broadcastEvent('STANDINGS_UPDATE', {});
  } else if (fixture.status === 'LIVE') {
    broadcastEvent('SCORE_UPDATE', {
      fixtureId: fixture.id,
      homeTeamName: fixture.homeTeam.name,
      awayTeamName: fixture.awayTeam.name,
      homeScore: fixture.homeScore ?? 0,
      awayScore: fixture.awayScore ?? 0,
      status: 'LIVE',
      message: `KICKOFF! ${fixture.homeTeam.name} vs ${fixture.awayTeam.name} is now LIVE!`,
    });
  }

  revalidatePath('/');
  revalidatePath('/fixtures');
  revalidatePath('/standings');
  revalidatePath('/players');
  return fixture;

  });
}

export async function deleteFixture(id: string) {
  return withErrorHandling(async () => {

  const fixture = await prisma.fixture.delete({
    where: { id },
  });
  await recalculateStandings();
  await recalculatePlayerStats();
  revalidatePath('/');
  revalidatePath('/fixtures');
  revalidatePath('/standings');
  revalidatePath('/players');
  broadcastEvent('STANDINGS_UPDATE', {});
  return fixture;

  });
}

// Live Match Controller Actions
export async function updateLiveMatch(fixtureId: string, updates: {
  status: 'UPCOMING' | 'LIVE' | 'FINISHED';
  homeScore?: number | null;
  awayScore?: number | null;
  eventText?: string;
  goalScorers?: string | null;
  yellowCards?: string | null;
  redCards?: string | null;
  manOfTheMatchId?: string | null;
  matchReport?: string | null;
  referee?: string | null;
  attendance?: number | null;
}) {
  return withErrorHandling(async () => {

  const fixture = await prisma.fixture.update({
    where: { id: fixtureId },
    data: {
      status: updates.status,
      homeScore: updates.homeScore !== undefined && updates.homeScore !== null ? Number(updates.homeScore) : undefined,
      awayScore: updates.awayScore !== undefined && updates.awayScore !== null ? Number(updates.awayScore) : undefined,
      goalScorers: updates.goalScorers !== undefined ? (updates.goalScorers || "") : undefined,
      yellowCards: updates.yellowCards !== undefined ? (updates.yellowCards || "") : undefined,
      redCards: updates.redCards !== undefined ? (updates.redCards || "") : undefined,
      manOfTheMatchId: updates.manOfTheMatchId !== undefined ? (updates.manOfTheMatchId || null) : undefined,
      matchReport: updates.matchReport !== undefined ? (updates.matchReport || "") : undefined,
      referee: updates.referee !== undefined ? (updates.referee || "") : undefined,
      attendance: updates.attendance !== undefined && updates.attendance !== null ? Number(updates.attendance) : undefined,
    },
    include: { homeTeam: true, awayTeam: true },
  });

  const homeScore = fixture.homeScore ?? 0;
  const awayScore = fixture.awayScore ?? 0;

  // Trigger statistics calculation automatically on match completion or updates
  await recalculateStandings();
  await recalculatePlayerStats();

  if (updates.status === 'FINISHED') {
    broadcastEvent('STANDINGS_UPDATE', {});
  }

  let notificationTitle = 'Match Update';
  let notificationMessage = `${fixture.homeTeam.name} ${homeScore} - ${awayScore} ${fixture.awayTeam.name}`;

  if (updates.eventText) {
    notificationTitle = 'GOAL ALERT!';
    notificationMessage = updates.eventText;
  } else if (updates.status === 'LIVE' && updates.homeScore === undefined) {
    notificationTitle = 'Match Started!';
    notificationMessage = `KICKOFF! ${fixture.homeTeam.name} vs ${fixture.awayTeam.name} is now LIVE at ${fixture.venue}!`;
  } else if (updates.status === 'FINISHED') {
    notificationTitle = 'Full Time!';
    notificationMessage = `FT: ${fixture.homeTeam.name} ${homeScore} - ${awayScore} ${fixture.awayTeam.name}`;
  }

  const notification = await prisma.notification.create({
    data: {
      title: notificationTitle,
      message: notificationMessage,
    },
  });

  broadcastEvent(updates.eventText ? 'GOAL_EVENT' : 'SCORE_UPDATE', {
    fixtureId,
    homeTeamName: fixture.homeTeam.name,
    awayTeamName: fixture.awayTeam.name,
    homeScore,
    awayScore,
    status: fixture.status,
    title: notificationTitle,
    message: notificationMessage,
    notificationId: notification.id,
  });

  revalidatePath('/');
  revalidatePath('/fixtures');
  revalidatePath('/standings');
  revalidatePath('/players');
  return fixture;

  });
}

// News CRUD Actions
export async function saveNews(formData: {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  coverImage: string;
  featured: boolean;
  tags: string;
  manOfTheMatch?: string;
}) {
  return withErrorHandling(async () => {

  const fileName = `news-cover-${Date.now()}.jpg`;
  const coverImageUrl = await saveBase64Image(formData.coverImage, fileName);

  const data = {
    title: formData.title,
    slug: formData.slug.toLowerCase(),
    excerpt: formData.excerpt,
    content: formData.content,
    category: formData.category,
    author: formData.author,
    coverImage: coverImageUrl || '/news/default.jpg',
    featured: formData.featured,
    tags: formData.tags,
    manOfTheMatch: formData.manOfTheMatch || '',
  };

  let news;
  if (formData.id) {
    news = await prisma.newsArticle.update({
      where: { id: formData.id },
      data,
    });
  } else {
    news = await prisma.newsArticle.create({
      data,
    });
  }

  broadcastEvent('NEWS_UPDATE', {});
  revalidatePath('/');
  revalidatePath('/news');
  revalidatePath(`/news/${news.slug}`);
  return news;

  });
}

export async function deleteNews(id: string) {
  return withErrorHandling(async () => {

  const news = await prisma.newsArticle.delete({
    where: { id },
  });
  broadcastEvent('NEWS_UPDATE', {});
  revalidatePath('/');
  revalidatePath('/news');
  return news;

  });
}

// Kickoff Pre-match Notification (15 min warning simulated manual trigger)
export async function triggerKickoffAlert(fixtureId: string) {
  return withErrorHandling(async () => {

  const fixture = await prisma.fixture.findUnique({
    where: { id: fixtureId },
    include: { homeTeam: true, awayTeam: true },
  });

  if (!fixture) return null;

  const title = 'Upcoming Match Alert';
  const message = `Kickoff in 15 minutes: ${fixture.homeTeam.name} vs ${fixture.awayTeam.name} at ${fixture.venue} (${fixture.time})`;

  const notification = await prisma.notification.create({
    data: { title, message },
  });

  broadcastEvent('KICKOFF_ALERT', {
    fixtureId,
    homeTeamName: fixture.homeTeam.name,
    awayTeamName: fixture.awayTeam.name,
    venue: fixture.venue,
    time: fixture.time,
    title,
    message,
    notificationId: notification.id,
  });

  return notification;

  });
}

// Sponsors CRUD Actions
export async function saveSponsor(formData: {
  id?: string;
  name: string;
  logo: string;
  url: string;
  tier: string;
  description?: string;
}) {
  return withErrorHandling(async () => {

  const fileName = `sponsor-logo-${Date.now()}.jpg`;
  const logoUrl = await saveBase64Image(formData.logo, fileName);

  const data = {
    name: formData.name,
    logo: logoUrl || '/sponsors/default.svg',
    url: formData.url,
    tier: formData.tier,
    description: formData.description || null,
  };

  let sponsor;
  if (formData.id) {
    sponsor = await prisma.sponsor.update({
      where: { id: formData.id },
      data,
    });
  } else {
    sponsor = await prisma.sponsor.create({
      data,
    });
  }

  revalidatePath('/');
  return sponsor;

  });
}

export async function deleteSponsor(id: string) {
  return withErrorHandling(async () => {

  const sponsor = await prisma.sponsor.delete({
    where: { id },
  });
  revalidatePath('/');
  return sponsor;

  });
}

// Gallery CRUD Actions
export async function saveGalleryImage(formData: {
  id?: string;
  url: string;
  caption: string;
  matchId?: string;
  tags: string;
}) {
  return withErrorHandling(async () => {

  const fileName = `gallery-photo-${Date.now()}.jpg`;
  const imageUrl = await saveBase64Image(formData.url, fileName);

  const data = {
    url: imageUrl || '/gallery/default.jpg',
    caption: formData.caption,
    matchId: formData.matchId || null,
    tags: formData.tags,
    width: 1200,
    height: 800,
  };

  let image;
  if (formData.id) {
    image = await prisma.galleryImage.update({
      where: { id: formData.id },
      data,
    });
  } else {
    image = await prisma.galleryImage.create({
      data,
    });
  }

  revalidatePath('/');
  revalidatePath('/gallery');
  return image;

  });
}

export async function deleteGalleryImage(id: string) {
  return withErrorHandling(async () => {

  const image = await prisma.galleryImage.delete({
    where: { id },
  });
  revalidatePath('/');
  revalidatePath('/gallery');
  return image;

  });
}

// Notifications CRUD Actions
export async function saveNotification(formData: {
  id?: string;
  title: string;
  message: string;
}) {
  return withErrorHandling(async () => {

  const data = {
    title: formData.title,
    message: formData.message,
  };

  let notification;
  if (formData.id) {
    notification = await prisma.notification.update({
      where: { id: formData.id },
      data,
    });
  } else {
    notification = await prisma.notification.create({
      data,
    });
  }

  broadcastEvent('NEW_NOTIFICATION', {
    title: notification.title,
    message: notification.message,
    notificationId: notification.id,
  });

  revalidatePath('/');
  return notification;

  });
}

export async function deleteNotification(id: string) {
  return withErrorHandling(async () => {

  const notification = await prisma.notification.delete({
    where: { id },
  });
  revalidatePath('/');
  return notification;

  });
}

// Users CRUD Actions
export async function saveUser(formData: {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: string;
}) {
  return withErrorHandling(async () => {

  const lowercaseEmail = formData.email.toLowerCase();

  const data: Record<string, any> = {
    name: formData.name,
    email: lowercaseEmail,
    role: formData.role,
  };

  if (formData.password && formData.password.trim() !== '') {
    data.password = await bcrypt.hash(formData.password, 12);
  }

  let user;
  if (formData.id) {
    user = await prisma.user.update({
      where: { id: formData.id },
      data,
    });
  } else {
    if (!formData.password) {
      throw new Error('Password is required for new users.');
    }
    user = await prisma.user.create({
      data: {
        name: formData.name,
        email: lowercaseEmail,
        password: await bcrypt.hash(formData.password, 12),
        role: formData.role,
      },
    });
  }

  return user;

  });
}

export async function deleteUser(id: string) {
  return withErrorHandling(async () => {

  const user = await prisma.user.delete({
    where: { id },
  });
  return user;

  });
}

export async function approvePendingAdmin(id: string) {
  return withErrorHandling(async () => {
    const user = await prisma.user.update({
      where: { id },
      data: { role: 'admin' }
    });
    return user;
  });
}

const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const WINDOW_SIZE_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5;

export async function loginAdminAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  // Rate limiting check
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for') || 'local-ip';
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  if (attempt && now <= attempt.resetTime && attempt.count >= MAX_ATTEMPTS) {
    return { success: false, error: 'Too many login attempts. Please try again in 1 minute.' };
  }

  if (!attempt || now > attempt.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + WINDOW_SIZE_MS });
  } else {
    attempt.count++;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    if (user.role === 'pending') {
      return { success: false, error: 'Your admin request is still pending approval.' };
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Access denied.' };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Generate custom admin JWT
    const token = await signAdminJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return { success: true };
  } catch (error: any) {
    console.error('Admin login error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  redirect('/admin/login');
}
