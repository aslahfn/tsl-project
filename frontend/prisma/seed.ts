import bcrypt from 'bcryptjs';
import { teams, players, standings, fixtures, newsArticles, galleryImages, sponsors } from '../src/lib/data';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Seeding database...');

  // 1. Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tsl.com' },
    update: {},
    create: {
      name: 'TSL Administrator',
      email: 'admin@tsl.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('Admin user seeded:', admin.email);

  // 2. Seed Teams
  console.log('Seeding teams...');
  await prisma.team.deleteMany();
  for (const t of teams) {
    await prisma.team.upsert({
      where: { slug: t.slug },
      update: {},
      create: {
        id: t.id,
        name: t.name,
        shortName: t.shortName,
        slug: t.slug,
        logo: t.logo,
        city: t.city,
        founded: t.founded,
        manager: t.manager,
        stadium: t.stadium,
        primaryColor: t.primaryColor,
        secondaryColor: t.secondaryColor,
        description: t.description,
      },
    });
  }

  // 3. Seed Players
  console.log('Seeding players...');
  await prisma.player.deleteMany();
  for (const p of players) {
    await prisma.player.create({
      data: {
        id: p.id,
        name: p.name,
        teamId: p.teamId,
        position: p.position,
        number: p.number,
        nationality: p.nationality,
        nationalityFlag: p.nationalityFlag || '🇮🇳',
        age: p.age,
        photo: p.photo,
        goals: p.goals,
        assists: p.assists,
        matches: p.matches,
        yellowCards: p.yellowCards,
        redCards: p.redCards,
        cleanSheets: p.cleanSheets || 0,
        rating: p.rating,
      },
    });
  }

  // 4. Seed Standings
  console.log('Seeding standings...');
  await prisma.standing.deleteMany();
  for (const s of standings) {
    await prisma.standing.create({
      data: {
        position: s.position,
        teamId: s.teamId,
        played: s.played,
        won: s.won,
        drawn: s.drawn,
        lost: s.lost,
        goalsFor: s.goalsFor,
        goalsAgainst: s.goalsAgainst,
        goalDifference: s.goalDifference,
        points: s.points,
        form: s.form.join(','),
        positionChange: s.positionChange,
      },
    });
  }

  // 5. Seed Fixtures
  console.log('Seeding fixtures...');
  await prisma.fixture.deleteMany();
  for (const f of fixtures) {
    await prisma.fixture.create({
      data: {
        id: f.id,
        homeTeamId: f.homeTeamId,
        awayTeamId: f.awayTeamId,
        date: f.date,
        time: f.time,
        venue: f.venue,
        matchday: f.matchday,
        status: f.status,
        homeScore: f.homeScore,
        awayScore: f.awayScore,
      },
    });
  }

  // 6. Seed News Articles
  console.log('Seeding news articles...');
  for (const n of newsArticles) {
    await prisma.newsArticle.upsert({
      where: { slug: n.slug },
      update: {},
      create: {
        id: n.id,
        title: n.title,
        slug: n.slug,
        excerpt: n.excerpt,
        content: n.content,
        category: n.category,
        author: n.author,
        coverImage: n.coverImage,
        publishedAt: new Date(n.publishedAt),
        featured: n.featured,
        tags: n.tags.join(','),
      },
    });
  }

  // 7. Seed Gallery Images
  console.log('Seeding gallery images...');
  await prisma.galleryImage.deleteMany();
  for (const g of galleryImages) {
    await prisma.galleryImage.create({
      data: {
        id: g.id,
        url: g.url,
        caption: g.caption,
        matchId: g.matchId,
        tags: g.tags.join(','),
        width: g.width,
        height: g.height,
      },
    });
  }

  // 8. Seed Sponsors
  console.log('Seeding sponsors...');
  await prisma.sponsor.deleteMany();
  for (const s of sponsors) {
    await prisma.sponsor.create({
      data: {
        id: s.id,
        name: s.name,
        logo: s.logo,
        url: s.url,
        tier: s.tier,
      },
    });
  }

  console.log('Database seeding completed!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
