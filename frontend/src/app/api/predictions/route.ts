import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { fixtureId, voterName, voterContact, predictedResult } = await request.json();

    if (!fixtureId || !voterName || !voterContact || !predictedResult) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if the fixture exists and hasn't started
    const fixture = await prisma.fixture.findUnique({ where: { id: fixtureId } });
    if (!fixture) {
      return NextResponse.json({ error: 'Fixture not found' }, { status: 404 });
    }

    if (fixture.status !== 'UPCOMING') {
      return NextResponse.json({ error: 'Voting is closed for this match.' }, { status: 400 });
    }

    // Upsert prediction (one per contact per fixture)
    const prediction = await prisma.prediction.upsert({
      where: {
        fixtureId_voterContact: {
          fixtureId,
          voterContact,
        },
      },
      update: {
        predictedResult,
        voterName,
      },
      create: {
        fixtureId,
        voterName,
        voterContact,
        predictedResult,
      },
    });

    return NextResponse.json({ success: true, prediction });
  } catch (error: any) {
    console.error('Failed to submit prediction:', error);
    return NextResponse.json({ error: 'Failed to submit prediction' }, { status: 500 });
  }
}
