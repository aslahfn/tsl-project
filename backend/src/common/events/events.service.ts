import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import type { RealtimeEventDto } from '../dto/api.dto';

@Injectable()
export class EventsService {
  private readonly emitter = new EventEmitter();

  constructor() {
    this.emitter.setMaxListeners(100);
  }

  emit(event: RealtimeEventDto) {
    this.emitter.emit('realtime', event);
  }

  onRealtime(listener: (event: RealtimeEventDto) => void) {
    this.emitter.on('realtime', listener);
    return () => this.emitter.off('realtime', listener);
  }
}
