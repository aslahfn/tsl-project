import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TeamDetailPageClient from './TeamDetailPageClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const team = await prisma.team.findUnique({
    where: { slug },
  });
  if (!team) return { title: 'Team Not Found' };
  return {
    title: `${team.name} | Super League Season 08`,
    description: `Squad, fixtures, standings, and profile for ${team.name} in Super League Season 08.`,
  };
}

export default async function TeamDetailPage({ params }: Props) {
  const { slug } = await params;
  const team = await prisma.team.findUnique({
    where: { slug },
  });
  if (!team) notFound();

  const dbPlayers = await prisma.player.findMany({
  where: { teamId: team.id },
  orderBy: { number: 'asc' },
});

const teamPlayers = dbPlayers.map((p: any) => ({
  ...p,
  position: p.position as any,
  teamName: team.name,
  teamLogo: team.logo,
}));

const dbFixtures = await prisma.fixture.findMany({
  where: {
    OR: [
      { homeTeamId: team.id },
      { awayTeamId: team.id },
    ],
  },
  include: {
    homeTeam: true,
    awayTeam: true,
  },
});

const teamFixtures = dbFixtures.map((f: any) => ({
  id: f.id,
  homeTeamId: f.homeTeamId,
  awayTeamId: f.awayTeamId,
  date: f.date,
  time: f.time,
  venue: f.venue,
  matchday: f.matchday,
  status: f.status as any,
  homeScore: f.homeScore ?? undefined,
  awayScore: f.awayScore ?? undefined,
  homeTeamName: f.homeTeam.name,
  homeTeamShort: f.homeTeam.shortName,
  homeTeamLogo: f.homeTeam.logo,
  awayTeamName: f.awayTeam.name,
  awayTeamShort: f.awayTeam.shortName,
  awayTeamLogo: f.awayTeam.logo,
}));

  return <TeamDetailPageClient team={team} players={teamPlayers} fixtures={teamFixtures} />;
}
