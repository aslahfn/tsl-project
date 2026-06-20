import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return NextResponse.json({ notifications });
  } catch (err) {
    console.error('Failed to get notifications:', err);
    return NextResponse.json({ notifications: [] });
  }
}
