import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toFixtureDto } from '../common/mappers/entity.mappers';

@Injectable()
export class FixturesService {
  constructor(private readonly prisma: PrismaService) {}

  private fixtureInclude = {
    homeTeam: true,
    awayTeam: true,
  } as const;

  async findAll(status?: string) {
    const fixtures = await this.prisma.fixture.findMany({
      where: status ? { status } : undefined,
      include: this.fixtureInclude,
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });
    return fixtures.map(toFixtureDto);
  }

  async findResults() {
    return this.findAll('FINISHED');
  }

  async findLive() {
    return this.findAll('LIVE');
  }

  async findOne(id: string) {
    const fixture = await this.prisma.fixture.findUnique({
      where: { id },
      include: this.fixtureInclude,
    });
    if (!fixture) {
      throw new NotFoundException('Fixture not found');
    }
    return toFixtureDto(fixture);
  }
}
