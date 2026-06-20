const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const teams = await prisma.team.findMany();
  console.log(teams.map(t => ({ id: t.id, name: t.name, shortName: t.shortName })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
