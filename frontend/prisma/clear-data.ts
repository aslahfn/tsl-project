import { config } from 'dotenv';
config({ path: '.env.local' });
config();

import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Clearing database tables (except Users)...');

  // Delete all data in the specified tables
  await prisma.matchEvent.deleteMany();
  console.log('Cleared MatchEvent');
  
  await prisma.fixture.deleteMany();
  console.log('Cleared Fixture');
  
  await prisma.standing.deleteMany();
  console.log('Cleared Standing');
  
  await prisma.player.deleteMany();
  console.log('Cleared Player');
  
  await prisma.team.deleteMany();
  console.log('Cleared Team');
  
  await prisma.newsArticle.deleteMany();
  console.log('Cleared NewsArticle');
  
  await prisma.galleryImage.deleteMany();
  console.log('Cleared GalleryImage');
  
  await prisma.sponsor.deleteMany();
  console.log('Cleared Sponsor');
  
  await prisma.notification.deleteMany();
  console.log('Cleared Notification');

  console.log('All requested tables have been successfully cleared! Admin user remains intact.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
