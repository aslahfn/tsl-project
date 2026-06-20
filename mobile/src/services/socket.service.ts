import { io, Socket } from 'socket.io-client';
import { env } from '../config/env';
import type { RealtimeEvent } from '../types/api.types';

let socket: Socket | null = null;

export const socketService = {
  connect(onEvent: (event: RealtimeEvent) => void) {
    if (socket?.connected) return socket;

    socket = io(`${env.socketUrl}/realtime`, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('event', onEvent);
    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
    });

    return socket;
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  isConnected() {
    return socket?.connected ?? false;
  },
};
