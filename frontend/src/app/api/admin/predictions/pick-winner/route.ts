import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fixtureId } = await request.json();

    if (!fixtureId) {
      return NextResponse.json({ error: 'Fixture ID is required' }, { status: 400 });
    }

    const fixture = await prisma.fixture.findUnique({
      where: { id: fixtureId },
      include: {
        predictions: true,
        homeTeam: true,
        awayTeam: true
      }
    });

    if (!fixture) {
      return NextResponse.json({ error: 'Fixture not found' }, { status: 404 });
    }

    if (fixture.status !== 'FINISHED') {
      return NextResponse.json({ error: 'Match is not finished yet.' }, { status: 400 });
    }

    // Determine the actual result
    let actualResult = 'DRAW';
    if ((fixture.homeScore ?? 0) > (fixture.awayScore ?? 0)) {
      actualResult = 'HOME';
    } else if ((fixture.awayScore ?? 0) > (fixture.homeScore ?? 0)) {
      actualResult = 'AWAY';
    }

    // Find all correct predictions
    const correctPredictions = fixture.predictions.filter(p => p.predictedResult === actualResult);

    if (correctPredictions.length === 0) {
      return NextResponse.json({ error: 'No one guessed correctly.' }, { status: 400 });
    }

    // Pick a random winner
    const randomIndex = Math.floor(Math.random() * correctPredictions.length);
    const winner = correctPredictions[randomIndex];

    // Update the fixture with the winner
    await prisma.fixture.update({
      where: { id: fixtureId },
      data: {
        predictionWinnerName: winner.voterName,
        predictionWinnerContact: winner.voterContact,
      }
    });

    // Create a global notification
    await prisma.notification.create({
      data: {
        title: '🎉 Prediction Winner Announced!',
        message: `Congratulations to ${winner.voterName} for correctly predicting the outcome of ${fixture.homeTeam.name} vs ${fixture.awayTeam.name}!`,
      }
    });

    return NextResponse.json({ success: true, winner: winner.voterName });
  } catch (error: any) {
    console.error('Failed to pick winner:', error);
    return NextResponse.json({ error: 'Failed to pick winner' }, { status: 500 });
  }
}
