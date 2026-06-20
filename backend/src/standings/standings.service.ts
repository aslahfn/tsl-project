import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toStandingDto } from '../common/mappers/entity.mappers';

@Injectable()
export class StandingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const standings = await this.prisma.standing.findMany({
      orderBy: { position: 'asc' },
      include: { team: true },
    });
    return standings.map(toStandingDto);
  }
}
