import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import TeamsPageClient from './TeamsPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Teams | Super League Season 08',
  description: 'Explore all competing football clubs in Super League Season 08. View squads, statistics, managers, and histories.',
};

export default async function TeamsPage() {
  const teams = await prisma.team.findMany({
    orderBy: { name: 'asc' },
    include: { standing: true },
  });
  return <TeamsPageClient teams={teams} />;
}
