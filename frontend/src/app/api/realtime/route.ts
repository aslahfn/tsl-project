import { NextRequest } from 'next/server';
import { matchEvents } from '@/lib/events';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const responseHeaders = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
  });

  const stream = new ReadableStream({
    start(controller) {
      const onUpdate = (event: any) => {
        try {
          const payload = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(new TextEncoder().encode(payload));
        } catch (err) {
          console.error('SSE Stream enqueue error:', err);
        }
      };

      // Listen for updates from the event emitter
      matchEvents.on('update', onUpdate);

      // Standard SSE heartbeat ping every 15s to keep connections active
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(':\n\n'));
        } catch {
          // Stream might be closed
        }
      }, 15000);

      // Clean up listeners on connection abortion/disconnect
      req.signal.addEventListener('abort', () => {
        matchEvents.off('update', onUpdate);
        clearInterval(pingInterval);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    },
  });

  return new Response(stream, { headers: responseHeaders });
}
