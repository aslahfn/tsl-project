'use client';

import { useState, useEffect } from 'react';
import { useRealTime } from '@/hooks/useRealTime';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        if (res.ok) {
          setNotifications(data.notifications || []);
        }
      } catch (err) {
        console.error('Failed to load notifications history:', err);
      }
    };
    fetchNotifications();

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Listen to Server-Sent Events updates
  useRealTime((event) => {
    if (event.title && event.message) {
      const newNotif = {
        id: event.notificationId || Math.random().toString(),
        title: event.title,
        message: event.message,
        createdAt: new Date().toISOString(),
      };

      setNotifications((prev) => [newNotif, ...prev.slice(0, 9)]);
      setUnreadCount((c) => c + 1);

      // Display floating overlay alert
      setToast({ title: event.title, message: event.message });
      setTimeout(() => setToast(null), 6000);
    }
  });

  return (
    <div style={{ position: 'relative' }}>
      {/* Icon trigger */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setUnreadCount(0); // clear count
        }}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          cursor: 'pointer',
          position: 'relative',
          transition: 'border-color 0.2s',
          outline: 'none',
        }}
      >
        <Bell size={18} color={unreadCount > 0 ? '#FFD700' : '#fff'} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#ff6b6b',
            boxShadow: '0 0 10px #ff6b6b',
          }} />
        )}
      </button>

      {/* History dropdown list */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              onClick={() => setIsOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 998 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                top: '3.25rem',
                right: 0,
                width: 320,
                background: 'rgba(10, 10, 20, 0.95)',
                border: '1px solid rgba(0, 255, 137, 0.2)',
                borderRadius: '0.75rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                zIndex: 999,
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#FFD700', letterSpacing: '0.05em' }}>
                  Notifications
                </span>
                {notifications.length > 0 && (
                  <button
                    onClick={() => setNotifications([])}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', cursor: 'pointer' }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                    No recent notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} style={{ padding: '0.85rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFD700' }}>{n.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.15rem', lineHeight: 1.3 }}>{n.message}</div>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Pop-up alert banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              width: 320,
              background: 'rgba(10, 10, 20, 0.95)',
              border: '2px solid #FFD700',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              boxShadow: '0 0 30px rgba(0, 255, 137, 0.25), 0 20px 40px rgba(0,0,0,0.8)',
              zIndex: 9999,
              backdropFilter: 'blur(20px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📢</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {toast.title}
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
