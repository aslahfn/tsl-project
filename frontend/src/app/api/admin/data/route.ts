import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const teams = await prisma.team.findMany({ orderBy: { name: 'asc' } });
    const players = await prisma.player.findMany({ orderBy: { name: 'asc' } });
    const fixtures = await prisma.fixture.findMany({
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ],
      include: { homeTeam: true, awayTeam: true, manOfTheMatch: true },
    });
    const standings = await prisma.standing.findMany({
      orderBy: { position: 'asc' },
      include: { team: true }
    });
    const newsArticles = await prisma.newsArticle.findMany({ orderBy: { publishedAt: 'desc' } });
    const sponsors = await prisma.sponsor.findMany({ orderBy: { name: 'asc' } });
    const gallery = await prisma.galleryImage.findMany({ orderBy: { id: 'desc' } });
    const notifications = await prisma.notification.findMany({ orderBy: { createdAt: 'desc' } });
    const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });

    return NextResponse.json({
      teams,
      players,
      fixtures,
      standings,
      newsArticles,
      sponsors,
      gallery,
      notifications,
      users,
    });
  } catch (err) {
    console.error('Failed to fetch admin data:', err);
    return NextResponse.json({ error: 'Failed to fetch admin data' }, { status: 500 });
  }
}
