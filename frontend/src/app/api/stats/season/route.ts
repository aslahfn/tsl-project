import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Top Scorer
    const topScorer = await prisma.player.findFirst({
      orderBy: { goals: 'desc' },
      where: { goals: { gt: 0 } },
    });

    // Most Assists
    const mostAssists = await prisma.player.findFirst({
      orderBy: { assists: 'desc' },
      where: { assists: { gt: 0 } },
    });

    // Clean Sheets
    const cleanSheets = await prisma.player.findFirst({
      orderBy: { cleanSheets: 'desc' },
      where: { cleanSheets: { gt: 0 } },
    });

    // League Leaders
    const leagueLeaders = await prisma.standing.findFirst({
      orderBy: { points: 'desc' },
      include: { team: true },
      where: { played: { gt: 0 } },
    });

    // Current Matchday: Find max matchday of finished fixtures
    const currentMatchdayQuery = await prisma.fixture.aggregate({
      _max: { matchday: true },
      where: { status: 'FINISHED' }
    });
    
    // Total matchdays
    const totalMatchdaysQuery = await prisma.fixture.aggregate({
      _max: { matchday: true }
    });

    const matchdayStr = currentMatchdayQuery._max.matchday 
      ? `${currentMatchdayQuery._max.matchday} of ${totalMatchdaysQuery._max.matchday || 15}`
      : '-';

    return NextResponse.json({
      matchday: matchdayStr,
      topScorer: topScorer ? `${topScorer.name} (${topScorer.goals})` : '-',
      mostAssists: mostAssists ? `${mostAssists.name} (${mostAssists.assists})` : '-',
      cleanSheets: cleanSheets ? `${cleanSheets.name} (${cleanSheets.cleanSheets})` : '-',
      leagueLeaders: leagueLeaders ? leagueLeaders.team.name : '-',
    });
  } catch (error) {
    console.error('Failed to fetch season stats:', error);
    return NextResponse.json({ error: 'Failed to fetch season stats' }, { status: 500 });
  }
}
