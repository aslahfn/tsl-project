import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.team.findMany({ orderBy: { name: 'asc' } });
  }

  async findBySlug(slug: string) {
    const team = await this.prisma.team.findUnique({
      where: { slug },
      include: {
        players: { orderBy: { number: 'asc' } },
        homeFixtures: {
          include: { homeTeam: true, awayTeam: true },
          orderBy: [{ date: 'asc' }, { time: 'asc' }],
        },
        awayFixtures: {
          include: { homeTeam: true, awayTeam: true },
          orderBy: [{ date: 'asc' }, { time: 'asc' }],
        },
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }
}
