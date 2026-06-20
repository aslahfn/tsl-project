import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { socketService } from '../services/socket.service';
import {
  registerForPushNotifications,
  showLocalNotification,
} from '../services/notification.service';
import type { RealtimeEvent } from '../types/api.types';

type RefreshListener = () => void;

interface RealtimeContextValue {
  lastEvent: RealtimeEvent | null;
  connected: boolean;
  subscribe: (listener: RefreshListener) => () => void;
}

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const [connected, setConnected] = useState(false);
  const listenersRef = useRef<Set<RefreshListener>>(new Set());

  const notifyListeners = useCallback(() => {
    listenersRef.current.forEach((listener) => listener());
  }, []);

  const subscribe = useCallback((listener: RefreshListener) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  useEffect(() => {
    registerForPushNotifications();

    const socket = socketService.connect((event) => {
      setLastEvent(event);
      notifyListeners();
      showLocalNotification(event);
    });

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    setConnected(socket.connected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socketService.disconnect();
    };
  }, [notifyListeners]);

  const value = useMemo(
    () => ({ lastEvent, connected, subscribe }),
    [lastEvent, connected, subscribe],
  );

  return (
    <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within RealtimeProvider');
  }
  return context;
}

export function useRealtimeRefresh(refresh: () => void) {
  const { subscribe, lastEvent } = useRealtime();

  useEffect(() => subscribe(refresh), [subscribe, refresh]);

  return lastEvent;
}
