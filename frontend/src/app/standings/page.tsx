import type { Metadata } from 'next';
import StandingsPageClient from './StandingsPageClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'League Standings',
  description: 'Full Super League Season 08 standings table — positions, wins, draws, losses, goals, and points.',
};

export default async function StandingsPage() {
  const dbStandings = await prisma.standing.findMany({
    orderBy: { position: 'asc' },
    include: { team: true },
  });
  return <StandingsPageClient standings={dbStandings} />;
}
