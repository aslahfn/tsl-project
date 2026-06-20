import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import PlayersPageClient from './PlayersPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Players Leaderboard & Stats | Super League Season 08',
  description: 'View player stats, leaderboards, top scorers, assists, clean sheets, and detailed player profiles for all Super League Season 08 players.',
};

export default async function PlayersPage() {
  const [players, teams] = await Promise.all([
    prisma.player.findMany({
      orderBy: { goals: 'desc' },
      include: { team: true },
    }),
    prisma.team.findMany({ orderBy: { name: 'asc' } }),
  ]);
  return <PlayersPageClient players={players} teams={teams} />;
}
