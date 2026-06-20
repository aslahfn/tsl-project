import { prisma } from './src/lib/prisma';

const teamData = {
  "KP MONJANZ FC": ["Fasil", "Jaseem", "Adharsh", "Adhil", "Ali Mon", "Rafi", "Shamnad", "Yaseen", "Ajmal", "Minhaj", "Sahad"],
  "PETTIKADA FC": ["Jaseer", "Muthu", "Albin", "Hisham", "Sidharth", "Sarath", "Musthafa", "Shinas", "Afu", "Afeef", "Akash"],
  "TARGARYENS FC": ["Ased", "Bari", "Rinshad", "Shaju", "Ajsal", "Nooru", "Swabah", "Alfas", "Sidhiq", "Fasallu", "Prabin"],
  "LUCA SOCCER FC": ["Habeeb", "Aleeshan", "Udhayan", "Arun", "Abu Thahir", "Subi", "Muthu", "Shesin", "Sahal", "Noorudheen"],
  "AL MOTHALZ FC": ["Siraju", "Anshid", "Aadhiil", "Azhar", "Ijaz", "Murthar", "Uvais", "Muavid", "Ahzab", "Sippy"],
  "LIONS FC": ["Fawas", "Jaseel", "Sinan", "Shameer", "Mujthaba", "Hijas", "Maliq", "Shamil", "Arjun", "Shamseer", "Kannappan"]
};

async function seed() {
  for (const [teamName, playerNames] of Object.entries(teamData)) {
    const team = await prisma.team.findFirst({ where: { name: teamName } });
    if (!team) {
      console.log(`Team not found: ${teamName}`);
      continue;
    }
    
    for (let i = 0; i < playerNames.length; i++) {
      await prisma.player.create({
        data: {
          name: playerNames[i],
          teamId: team.id,
          position: 'MID', // Default position
          number: i + 1,   // Sequential number
          nationality: 'India',
          age: 20,
          photo: '',
          goals: 0,
          assists: 0,
          matches: 0,
          yellowCards: 0,
          redCards: 0,
          rating: 7.0,
          cleanSheets: 0
        }
      });
    }
    console.log(`Added ${playerNames.length} players to ${teamName}`);
  }
}

seed().catch(console.error).finally(() => prisma.$disconnect());
