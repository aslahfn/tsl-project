import { EventEmitter } from 'events';

const globalForEvents = globalThis as unknown as {
  matchEvents: EventEmitter | undefined;
};

export const matchEvents = globalForEvents.matchEvents ?? new EventEmitter();

// Allow up to 100 concurrent streams to connect
matchEvents.setMaxListeners(100);

if (process.env.NODE_ENV !== 'production') {
  globalForEvents.matchEvents = matchEvents;
}
