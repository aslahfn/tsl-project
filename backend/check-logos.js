const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const teams = await prisma.team.findMany();
  console.log(teams.map(t => ({name: t.name, logo: t.logo ? t.logo.substring(0, 50) + '...' : 'null'})));
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
