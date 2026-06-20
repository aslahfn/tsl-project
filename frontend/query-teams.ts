import { prisma } from './src/lib/prisma';

async function seed() {
  const teams = await prisma.team.findMany();
  console.log(teams.map(t => t.name));
}

seed().catch(console.error).finally(() => prisma.$disconnect());
