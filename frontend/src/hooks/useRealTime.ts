import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useRealTime(onEventReceived?: (event: any) => void) {
  const router = useRouter();

  useEffect(() => {
    // Connect to the Server-Sent Events real-time feed
    const eventSource = new EventSource('/api/realtime');

    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log('Real-time event:', data);

        // Refresh Next.js Server Component data on active pages
        router.refresh();

        // Trigger custom UI event listener
        if (onEventReceived) {
          onEventReceived(data);
        }

        // Trigger browser push notification for key events
        if (
          Notification.permission === 'granted' && 
          (data.type === 'GOAL_EVENT' || data.type === 'KICKOFF_ALERT')
        ) {
          new Notification(data.title || 'Goal Alert!', {
            body: data.message || '',
            icon: '/favicon.ico',
          });
        }
      } catch (err) {
        // heartbeats/pings will fail JSON parsing, which is safe to ignore
      }
    };

    eventSource.onerror = (err) => {
      console.warn('Real-time connection interrupted. Automatically reconnecting...', err);
    };

    return () => {
      eventSource.close();
    };
  }, [router, onEventReceived]);
}
