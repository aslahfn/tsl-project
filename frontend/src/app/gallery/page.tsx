import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import GalleryPageClient from './GalleryPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Media Gallery | Super League Season 08',
  description: 'Moments of glory, epic goals, stadium matchdays, fan celebrations, and snapshots from Super League Season 08.',
};

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany();
  return <GalleryPageClient images={images} />;
}
