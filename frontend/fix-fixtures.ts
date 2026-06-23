import { config } from 'dotenv';
config({ path: '.env.local' });
config();
import { prisma } from './src/lib/prisma';

const teams = {
  'Pettikkada FC': 't1',
  'Lion FC': 't6', // Listed as LIONS FC in DB
  'KP Monjanz FC': 't3',
  'Al Mothalz FC': 't2',
  'Luca Soccer FC': 't5',
  'Targaryen FC': 't4', // Listed as TARGARYENS FC in DB
};

const fixtures = [
  // Matchday 1 - Sunday, 07 June 2026
  { md: 1, date: '2026-06-07', time: '16:30', h: 'Pettikkada FC', a: 'Lion FC' },
  { md: 1, date: '2026-06-07', time: '17:00', h: 'KP Monjanz FC', a: 'Al Mothalz FC' },
  { md: 1, date: '2026-06-07', time: '17:30', h: 'Luca Soccer FC', a: 'Targaryen FC' },

  // Matchday 2 - Saturday, 13 June 2026
  { md: 2, date: '2026-06-13', time: '17:00', h: 'Luca Soccer FC', a: 'Lion FC' },
  { md: 2, date: '2026-06-13', time: '17:30', h: 'KP Monjanz FC', a: 'Targaryen FC' },

  // Matchday 3 - Sunday, 14 June 2026
  { md: 3, date: '2026-06-14', time: '17:00', h: 'Al Mothalz FC', a: 'Targaryen FC' },
  { md: 3, date: '2026-06-14', time: '17:30', h: 'Pettikkada FC', a: 'Luca Soccer FC' },

  // Matchday 4 - Saturday, 20 June 2026
  { md: 4, date: '2026-06-20', time: '17:00', h: 'Pettikkada FC', a: 'KP Monjanz FC' },
  { md: 4, date: '2026-06-20', time: '17:30', h: 'Lion FC', a: 'Al Mothalz FC' },

  // Matchday 5 - Sunday, 21 June 2026
  { md: 5, date: '2026-06-21', time: '17:00', h: 'Targaryen FC', a: 'Lion FC' },
  { md: 5, date: '2026-06-21', time: '17:30', h: 'KP Monjanz FC', a: 'Luca Soccer FC' },

  // Matchday 6 - Saturday, 27 June 2026
  { md: 6, date: '2026-06-27', time: '17:00', h: 'Al Mothalz FC', a: 'Luca Soccer FC' },
  { md: 6, date: '2026-06-27', time: '17:30', h: 'Targaryen FC', a: 'Pettikkada FC' },

  // Matchday 7 - Sunday, 28 June 2026
  { md: 7, date: '2026-06-28', time: '17:00', h: 'Lion FC', a: 'KP Monjanz FC' },
  { md: 7, date: '2026-06-28', time: '17:30', h: 'Pettikkada FC', a: 'Al Mothalz FC' },
];

async function main() {
  console.log('Fetching teams...');
  const dbTeams = await prisma.team.findMany();
  console.log('Teams in DB:', dbTeams.map(t => t.name));
  
  const getTeamId = (name: string) => {
    // Map names from the user's list to the DB names
    let dbName = name;
    if (name === 'Lion FC') dbName = 'LIONS FC';
    if (name === 'Targaryen FC') dbName = 'TARGARYENS FC';
    if (name === 'Pettikkada FC') dbName = 'PETTIKADA FC';
    
    const team = dbTeams.find(t => t.name.toUpperCase() === dbName.toUpperCase());
    if (!team) throw new Error(`Team not found: ${dbName}`);
    return team.id;
  };

  console.log('Clearing old fixtures...');
  await prisma.fixture.deleteMany();

  console.log('Inserting new fixtures...');
  for (let i = 0; i < fixtures.length; i++) {
    const f = fixtures[i];
    await prisma.fixture.create({
      data: {
        homeTeamId: getTeamId(f.h),
        awayTeamId: getTeamId(f.a),
        date: f.date,
        time: f.time,
        venue: 'Thozhupadam Home Ground',
        matchday: f.md,
        status: 'UPCOMING',
        homeScore: null,
        awayScore: null,
      }
    });
  }

  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
