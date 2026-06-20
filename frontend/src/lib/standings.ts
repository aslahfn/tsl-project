import { prisma } from './prisma';

export async function recalculateStandings() {
  // 1. Get all teams
  const teams = await prisma.team.findMany();
  
  // 2. Get all finished fixtures
  const finishedFixtures = await prisma.fixture.findMany({
    where: { status: 'FINISHED' },
  });

  // 3. Initialize stats map for each team
  const statsMap: Record<string, {
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
    form: string[];
  }> = {};

  for (const team of teams) {
    statsMap[team.id] = {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      form: [],
    };
  }

  // 4. Sort fixtures chronologically to build form history
  const sortedFixtures = [...finishedFixtures].sort(
    (a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
  );

  // 5. Aggregate match stats
  for (const f of sortedFixtures) {
    const homeId = f.homeTeamId;
    const awayId = f.awayTeamId;
    const homeScore = f.homeScore ?? 0;
    const awayScore = f.awayScore ?? 0;

    if (!statsMap[homeId] || !statsMap[awayId]) continue;

    statsMap[homeId].played += 1;
    statsMap[awayId].played += 1;

    statsMap[homeId].goalsFor += homeScore;
    statsMap[homeId].goalsAgainst += awayScore;
    statsMap[awayId].goalsFor += awayScore;
    statsMap[awayId].goalsAgainst += homeScore;

    if (homeScore > awayScore) {
      statsMap[homeId].won += 1;
      statsMap[homeId].points += 3;
      statsMap[homeId].form.push('W');

      statsMap[awayId].lost += 1;
      statsMap[awayId].form.push('L');
    } else if (homeScore < awayScore) {
      statsMap[awayId].won += 1;
      statsMap[awayId].points += 3;
      statsMap[awayId].form.push('W');

      statsMap[homeId].lost += 1;
      statsMap[homeId].form.push('L');
    } else {
      statsMap[homeId].drawn += 1;
      statsMap[homeId].points += 1;
      statsMap[homeId].form.push('D');

      statsMap[awayId].drawn += 1;
      statsMap[awayId].points += 1;
      statsMap[awayId].form.push('D');
    }
  }

  // 6. Create sorted standings data
  const standingsList = teams.map((team) => {
    const stats = statsMap[team.id];
    const gd = stats.goalsFor - stats.goalsAgainst;
    return {
      teamId: team.id,
      played: stats.played,
      won: stats.won,
      drawn: stats.drawn,
      lost: stats.lost,
      goalsFor: stats.goalsFor,
      goalsAgainst: stats.goalsAgainst,
      goalDifference: gd,
      points: stats.points,
      form: stats.form.slice(-5).join(','), // store last 5 games
    };
  });

  // Sort criteria: points desc, goalDifference desc, goalsFor desc
  standingsList.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  // 7. Update Standing rows in a single db transaction
  await prisma.$transaction(async (tx) => {
    const currentStandings = await tx.standing.findMany();
    const currentPosMap: Record<string, number> = {};
    for (const cur of currentStandings) {
      currentPosMap[cur.teamId] = cur.position;
    }

    for (let i = 0; i < standingsList.length; i++) {
      const s = standingsList[i];
      const position = i + 1;
      const oldPos = currentPosMap[s.teamId];

      let positionChange: 'UP' | 'DOWN' | 'SAME' = 'SAME';
      if (oldPos) {
        if (position < oldPos) positionChange = 'UP';
        else if (position > oldPos) positionChange = 'DOWN';
      }

      await tx.standing.upsert({
        where: { teamId: s.teamId },
        update: {
          position,
          played: s.played,
          won: s.won,
          drawn: s.drawn,
          lost: s.lost,
          goalsFor: s.goalsFor,
          goalsAgainst: s.goalsAgainst,
          goalDifference: s.goalDifference,
          points: s.points,
          form: s.form,
          positionChange,
        },
        create: {
          position,
          teamId: s.teamId,
          played: s.played,
          won: s.won,
          drawn: s.drawn,
          lost: s.lost,
          goalsFor: s.goalsFor,
          goalsAgainst: s.goalsAgainst,
          goalDifference: s.goalDifference,
          points: s.points,
          form: s.form,
          positionChange,
        },
      });
    }
  });
}
