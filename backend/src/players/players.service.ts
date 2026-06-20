import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toPlayerDto } from '../common/mappers/entity.mappers';

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(teamId?: string) {
    const players = await this.prisma.player.findMany({
      where: teamId ? { teamId } : undefined,
      include: { team: true },
      orderBy: { name: 'asc' },
    });
    return players.map(toPlayerDto);
  }

  async findOne(id: string) {
    const player = await this.prisma.player.findUnique({
      where: { id },
      include: { team: true },
    });
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return toPlayerDto(player);
  }
}
