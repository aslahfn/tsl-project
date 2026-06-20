import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import HeroSection from '@/components/hero/HeroSection';

export const dynamic = 'force-dynamic';
import LatestMatchesSection from '@/components/matches/LatestMatchesSection';
import StandingsSection from '@/components/standings/StandingsSection';
import FixturesSection from '@/components/fixtures/FixturesSection';
import TeamsSection from '@/components/teams/TeamsSection';
import PlayersSection from '@/components/players/PlayersSection';
import GallerySection from '@/components/gallery/GallerySection';
import NewsSection from '@/components/news/NewsSection';
import SponsorsSection from '@/components/sponsors/SponsorsSection';

export const metadata: Metadata = {
  title: 'THOZHUPADAM SUPER LEAGUE | The Ultimate Football Championship',
  description: 'The official home of THOZHUPADAM SUPER LEAGUE — the ultimate football championship. Live scores, fixtures, standings, teams, players, and news.',
};

export default async function HomePage() {
  // Fetch all data in parallel from PostgreSQL
  const [standings, fixtures, teams, players, newsArticles, galleryImages, sponsors] = await Promise.all([
    prisma.standing.findMany({ orderBy: { position: 'asc' }, include: { team: true } }),
    prisma.fixture.findMany({
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
      include: { homeTeam: true, awayTeam: true, manOfTheMatch: true },
    }),
    prisma.team.findMany({ orderBy: { name: 'asc' }, include: { standing: true } }),
    prisma.player.findMany({ orderBy: { goals: 'desc' }, include: { team: true } }),
    prisma.newsArticle.findMany({ orderBy: { publishedAt: 'desc' }, take: 6 }),
    prisma.galleryImage.findMany({ take: 9 }),
    prisma.sponsor.findMany({ orderBy: { tier: 'asc' } }),
  ]);

  // Find the next upcoming fixture for the countdown
  const nextMatch =
  fixtures.find((f: { status: string }) => f.status === 'UPCOMING') || null;

  return (
    <>
      <HeroSection nextMatch={nextMatch} />
      <LatestMatchesSection fixtures={fixtures} />
      <StandingsSection standings={standings} />
      <FixturesSection fixtures={fixtures} />
      <TeamsSection teams={teams} standings={standings} />
      <PlayersSection players={players} />
      <GallerySection images={galleryImages} />
      <NewsSection articles={newsArticles} />
      <SponsorsSection sponsors={sponsors} />
    </>
  );
}
