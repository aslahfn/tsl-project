import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ArticleDetailPageClient from './ArticleDetailPageClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.newsArticle.findUnique({
    where: { slug },
  });
  if (!article) return { title: 'Article Not Found' };
  return {
    title: `${article.title} | Super League Season 08 News`,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.newsArticle.findUnique({
    where: { slug },
  });
  if (!article) notFound();

  // Map database tags string to string array and match types
  const mappedArticle = {
    ...article,
    category: article.category as any,
    publishedAt: article.publishedAt.toISOString(),
    tags: typeof article.tags === "string"
  ? article.tags.split(",").map((t) => t.trim()).filter(Boolean)
  : [],
  };

  return <ArticleDetailPageClient article={mappedArticle} />;
}
