import { config } from 'dotenv';
config({ path: '.env.local' });
config();
import { prisma } from './src/lib/prisma';

const teamUpdates = [
  { name: 'KP MONJANZ FC', manager: 'Ajmal (Team Coach), Rasheed (Team Owner)' },
  { name: 'PETTIKADA FC', manager: 'Fayiz' },
  { name: 'TARGARYENS FC', manager: 'Niyas, Aslu' },
  { name: 'LUCA SOCCER FC', manager: 'Sujith, Maheesh' },
  { name: 'LIONS FC', manager: 'Shuhaib' },
];

const teamPlayers = {
  'KP MONJANZ FC': ['Fasil', 'Jaseem', 'Adharsh', 'Adhil', 'Ali Mon', 'Rafi', 'Shamnad', 'Yaseen', 'Ajmal', 'Minhaj', 'Sahad'],
  'PETTIKADA FC': ['Jaseer', 'Muthu', 'Albin', 'Hisham', 'Sidharth', 'Sarath', 'Musthafa', 'Shinas', 'Afu', 'Afeef', 'Akash'],
  'TARGARYENS FC': ['Ased', 'Bari', 'Rinshad', 'Shaju', 'Ajsal', 'Nooru', 'Swabah', 'Alfas', 'Sidhiq', 'Fasalu', 'Prabin'],
  'LUCA SOCCER FC': ['Habeeb', 'Aleeshan', 'Udhayan', 'Arun', 'Abu Thahir', 'Subi', 'Muthu', 'Shesin', 'Sahal', 'Noorudheen'],
  'LIONS FC': ['Fawas', 'Jaseel', 'Sinan', 'Shameer', 'Mujthaba', 'Hijas', 'Maliq', 'Shamil', 'Arjun', 'Shamseer', 'Kannappan']
};

async function main() {
  console.log('Fetching teams...');
  const dbTeams = await prisma.team.findMany();

  console.log('Updating team managers...');
  for (const update of teamUpdates) {
    const team = dbTeams.find(t => t.name.toUpperCase() === update.name);
    if (team) {
      await prisma.team.update({
        where: { id: team.id },
        data: { manager: update.manager }
      });
      console.log(`Updated ${team.name} manager to ${update.manager}`);
    } else {
      console.log(`Team not found: ${update.name}`);
    }
  }

  console.log('Inserting players...');
  await prisma.player.deleteMany(); // Just to be safe, clear any existing players

  for (const [teamName, players] of Object.entries(teamPlayers)) {
    const team = dbTeams.find(t => t.name.toUpperCase() === teamName);
    if (!team) {
      console.log(`Team not found for players: ${teamName}`);
      continue;
    }

    for (let i = 0; i < players.length; i++) {
      const pName = players[i];
      await prisma.player.create({
        data: {
          id: `p_${team.slug}_${i}`,
          name: pName,
          teamId: team.id,
          position: 'Player', // Generic position since not provided
          number: i + 1,      // Assign arbitrary number 1-11
          nationality: 'India',
          nationalityFlag: '🇮🇳',
          age: 22,            // Arbitrary age
          photo: '/players/default.jpg', // Default photo
          goals: 0,
          assists: 0,
          matches: 0,
          yellowCards: 0,
          redCards: 0,
          cleanSheets: 0,
          rating: 7.0
        }
      });
    }
    console.log(`Inserted ${players.length} players for ${team.name}`);
  }

  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
