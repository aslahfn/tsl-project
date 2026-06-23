import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, userId } = body;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Push token is required' }, { status: 400 });
    }

    // Upsert to ensure we don't duplicate tokens, and update userId if it changed
    await prisma.pushToken.upsert({
      where: { token },
      update: { userId: userId || null },
      create: { token, userId: userId || null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error registering push token:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
