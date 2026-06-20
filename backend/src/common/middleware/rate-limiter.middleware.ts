import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private clients = new Map<string, { count: number; resetTime: number }>();
  private readonly WINDOW_SIZE_MS = 60 * 1000; // 1 minute
  private readonly MAX_REQUESTS = 5; // max 5 attempts per window

  use(req: Request, res: Response, next: NextFunction) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'local-ip';
    const now = Date.now();

    const client = this.clients.get(ip);
    if (!client || now > client.resetTime) {
      this.clients.set(ip, {
        count: 1,
        resetTime: now + this.WINDOW_SIZE_MS,
      });
      return next();
    }

    client.count++;
    if (client.count > this.MAX_REQUESTS) {
      throw new HttpException(
        'Too many login attempts. Please try again in 1 minute.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    next();
  }
}
