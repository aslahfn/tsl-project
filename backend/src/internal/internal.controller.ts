import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventsService } from '../common/events/events.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import type { RealtimeEventDto } from '../common/dto/api.dto';

@Controller('internal')
export class InternalController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly realtimeGateway: RealtimeGateway,
    private readonly config: ConfigService,
  ) {}

  @Post('events')
  emitEvent(
    @Headers('x-api-key') apiKey: string,
    @Body() event: RealtimeEventDto,
  ) {
    const expected = this.config.get<string>('INTERNAL_API_KEY');
    if (expected && apiKey !== expected) {
      throw new UnauthorizedException('Invalid API key');
    }

    const payload = {
      ...event,
      timestamp: event.timestamp ?? new Date().toISOString(),
    };

    this.eventsService.emit(payload);
    this.realtimeGateway.broadcast(payload);
    return { ok: true };
  }
}
