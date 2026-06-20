import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import NewsPageClient from './NewsPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Latest News & Transfers | Super League Season 08',
  description: 'Stay updated with Super League Season 08 match reports, transfer rumors, injury reports, tactical previews, and exclusive features.',
};

export default async function NewsPage() {
  const articles = await prisma.newsArticle.findMany({
    orderBy: { publishedAt: 'desc' },
  });
  return <NewsPageClient articles={articles} />;
}
