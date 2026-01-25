import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationContextType {
  notifications: any[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  requestNotificationPermission: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  
  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    
    getUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const notificationHook = useNotifications(userId || undefined);

  const contextValue: NotificationContextType = {
    notifications: notificationHook.notifications,
    unreadCount: notificationHook.unreadCount,
    isLoading: notificationHook.isLoading,
    markAsRead: notificationHook.markAsRead,
    markAllAsRead: notificationHook.markAllAsRead,
    deleteNotification: notificationHook.deleteNotification,
    requestNotificationPermission: notificationHook.requestNotificationPermission,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
