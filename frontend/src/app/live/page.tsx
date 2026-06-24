import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import LivePageClient from './LivePageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Live TV | THOZHUPADAM SUPER LEAGUE',
  description: 'Watch live matches of the Thozhupadam Super League.',
};

export default async function LivePage() {
  const liveMatch = await prisma.fixture.findFirst({
    where: { status: 'LIVE' },
    include: { homeTeam: true, awayTeam: true },
  });

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', background: 'var(--bg-primary)' }}>
      <LivePageClient initialMatch={liveMatch} />
    </div>
  );
}
