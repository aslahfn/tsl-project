import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(limit = 20) {
    const notifications = await this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return notifications.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      createdAt: n.createdAt.toISOString(),
      read: n.read,
    }));
  }

  async markAsRead(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }
}
