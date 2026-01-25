import { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, Settings, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/lib/types/notifications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface NotificationIconProps {
  className?: string;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ className }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    setupRealtimeSubscription();
    requestNotificationPermission();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await notificationService.getNotifications(
        await getCurrentUserId(),
        1,
        5,
        false
      );
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUserId = async (): Promise<string> => {
    // This should get the current user ID from your auth context
    // For now, returning a placeholder - you'll need to implement this
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || '';
  };

  const setupRealtimeSubscription = () => {
    // Set up Supabase realtime subscription for notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${getCurrentUserId()}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
          setUnreadCount(prev => prev + 1);
          
          // Show browser notification if permitted
          if (Notification.permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/favicon.ico'
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (id: string) => {
    try {
      const userId = await getCurrentUserId();
      await notificationService.markAsRead(id, userId);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const userId = await getCurrentUserId();
      await notificationService.markAllAsRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const userId = await getCurrentUserId();
      await notificationService.deleteNotification(id, userId);
      const notification = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment': return '💳';
      case 'order': return '📦';
      case 'admin': return '👤';
      case 'system': return '⚙️';
      case 'promotion': return '🎉';
      case 'shipping': return '🚚';
      default: return '🔔';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center animate-pulse"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-96 p-0">
          <DropdownMenuLabel className="flex items-center justify-between p-4">
            <span className="font-semibold">Notifications</span>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs h-auto p-1"
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/notifications')}
                className="text-xs h-auto p-1"
              >
                View all
              </Button>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <ScrollArea className="h-80">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No notifications
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      "p-4 cursor-pointer flex flex-col items-start space-y-2",
                      !notification.read && "bg-blue-50 dark:bg-blue-950/20"
                    )}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id);
                      }
                      if (notification.link) {
                        navigate(notification.link);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTypeIcon(notification.type)}</span>
                          <div 
                            className={cn(
                              "w-2 h-2 rounded-full",
                              getPriorityColor(notification.priority)
                            )} 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm truncate">
                              {notification.title}
                            </span>
                            {!notification.read && (
                              <Badge variant="secondary" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTimeAgo(notification.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 ml-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </ScrollArea>
          
          <DropdownMenuSeparator />
          
          <div className="p-2">
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => {
                requestNotificationPermission();
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Enable desktop notifications
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationIcon;
