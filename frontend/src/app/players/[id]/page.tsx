import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PlayerDetailPageClient from './PlayerDetailPageClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const player = await prisma.player.findUnique({
    where: { id },
  });
  if (!player) return { title: 'Player Not Found' };
  return {
    title: `${player.name} (${player.position}) Profile | Super League Season 08`,
    description: `Detailed statistics, career rating, goals, assists, and team info for ${player.name} in Super League Season 08.`,
  };
}

export default async function PlayerDetailPage({ params }: Props) {
  const { id } = await params;
  const player = await prisma.player.findUnique({
    where: { id },
    include: { team: true },
  });
  if (!player) notFound();

  const mappedPlayer = {
    ...player,
    position: player.position as any,
    teamName: player.team.name,
    teamLogo: player.team.logo,
  };

  return <PlayerDetailPageClient player={mappedPlayer} team={player.team} />;
}
