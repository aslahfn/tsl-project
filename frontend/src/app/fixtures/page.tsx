import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import FixturesPageClient from './FixturesPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Fixtures & Results | Super League Season 08',
  description: 'Schedule, dates, kickoff times, venues, and live/final scores for all Super League Season 08 matchdays.',
};

export default async function FixturesPage() {
  const [fixtures, teams] = await Promise.all([
    prisma.fixture.findMany({
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
      include: { homeTeam: true, awayTeam: true, manOfTheMatch: true, predictions: true },
    }),
    prisma.team.findMany({ orderBy: { name: 'asc' } }),
  ]);
  return <FixturesPageClient fixtures={fixtures} teams={teams} />;
}
