import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/lib/types/notifications';

export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const response = await notificationService.getNotifications(
        userId,
        1,
        10,
        false
      );
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    
    try {
      const count = await notificationService.getUnreadCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [userId]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!userId) return;
    
    try {
      await notificationService.markAsRead(notificationId, userId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [userId]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    
    try {
      await notificationService.markAllAsRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [userId]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!userId) return;
    
    try {
      await notificationService.deleteNotification(notificationId, userId);
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [userId, notifications]);

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show browser notification if permitted
          if (Notification.permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/favicon.ico',
              tag: newNotification.id
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const updatedNotification = payload.new as Notification;
          setNotifications(prev => 
            prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
          );
          
          // Update unread count if notification was marked as read
          if (payload.old.read === false && updatedNotification.read === true) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const deletedNotification = payload.old as Notification;
          setNotifications(prev => prev.filter(n => n.id !== deletedNotification.id));
          if (!deletedNotification.read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId, fetchNotifications]);

  // Request notification permission
  const requestNotificationPermission = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    requestNotificationPermission
  };
};
