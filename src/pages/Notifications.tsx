import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Filter, Eye, EyeOff, Package, CreditCard, MessageSquare, Gift, Truck, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '@/services/notificationService';
import { supabase } from '@/lib/supabase/client';
import type { Notification, NotificationType } from '@/lib/types/notifications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, unread: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [filter, typeFilter, page]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const userId = await getCurrentUserId();
      const response = await notificationService.getNotifications(
        userId,
        page,
        20,
        filter === 'unread',
        typeFilter === 'all' ? undefined : typeFilter
      );
      
      setNotifications(response.notifications);
      setStats({ total: response.total, unread: response.unreadCount });
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserId = async (): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || '';
  };

  const markAsRead = async (id: string) => {
    try {
      const userId = await getCurrentUserId();
      await notificationService.markAsRead(id, userId);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setStats(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const userId = await getCurrentUserId();
      await notificationService.markAllAsRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setStats(prev => ({ ...prev, unread: 0 }));
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
      setStats(prev => ({ 
        ...prev, 
        total: prev.total - 1,
        unread: prev.unread - (notification?.read ? 0 : 1)
      }));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAll = async () => {
    if (!confirm('Are you sure you want to delete all notifications?')) return;
    
    try {
      const userId = await getCurrentUserId();
      for (const notification of notifications) {
        await notificationService.deleteNotification(notification.id, userId);
      }
      setNotifications([]);
      setStats({ total: 0, unread: 0 });
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const getTypeColor = (type: NotificationType) => {
    const colors = {
      payment: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      order: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      system: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      promotion: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      shipping: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    };
    return colors[type] || colors.system;
  };

  const getTypeIcon = (type: NotificationType) => {
    const icons = {
      payment: CreditCard,
      order: Package,
      admin: MessageSquare,
      system: Settings,
      promotion: Gift,
      shipping: Truck
    };
    return icons[type] || Bell;
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Bell className="w-8 h-8" />
              Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {stats.unread} unread of {stats.total} total notifications
            </p>
          </div>
          <div className="flex gap-3">
            {stats.unread > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Mark all as read
              </Button>
            )}
            {stats.total > 0 && (
              <Button
                onClick={clearAll}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All notifications</SelectItem>
                    <SelectItem value="unread">Unread only</SelectItem>
                    <SelectItem value="read">Read only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="order">Order</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="promotion">Promotions</SelectItem>
                  <SelectItem value="shipping">Shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                  No notifications found
                </h3>
                <p className="text-gray-500">
                  {filter !== 'all' || typeFilter !== 'all' 
                    ? 'Try changing your filters' 
                    : 'You\'re all caught up!'
                  }
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {notifications.map((notification) => {
                    const IconComponent = getTypeIcon(notification.type);
                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50",
                          !notification.read && "bg-blue-50 dark:bg-blue-950/20"
                        )}
                      >
                        <div className="flex gap-4">
                          {/* Icon */}
                          <div className="flex-shrink-0">
                            <div className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center",
                              notification.read 
                                ? "bg-gray-100 dark:bg-gray-800" 
                                : "bg-blue-100 dark:bg-blue-900"
                            )}>
                              <IconComponent className={cn(
                                "w-6 h-6",
                                notification.read 
                                  ? "text-gray-500" 
                                  : "text-blue-600 dark:text-blue-400"
                              )} />
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <div 
                                    className={cn(
                                      "w-2 h-2 rounded-full",
                                      getPriorityColor(notification.priority)
                                    )} 
                                  />
                                  <h4 className={cn(
                                    "font-medium truncate",
                                    notification.read 
                                      ? "text-gray-700 dark:text-gray-300" 
                                      : "text-gray-900 dark:text-white"
                                  )}>
                                    {notification.title}
                                  </h4>
                                  <span className={cn(
                                    "text-xs px-2 py-1 rounded-full",
                                    getTypeColor(notification.type)
                                  )}>
                                    {notification.type}
                                  </span>
                                  {notification.priority === 'urgent' && (
                                    <Badge variant="destructive" className="text-xs">
                                      Urgent
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                                  <span>{formatDateTime(notification.created_at)}</span>
                                  {!notification.read && (
                                    <Badge variant="secondary" className="text-xs">
                                      New
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex gap-2 ml-4">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-8 w-8 p-0"
                                    title="Mark as read"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="h-8 w-8 p-0"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                              {notification.message}
                            </p>
                            
                            {notification.link && (
                              <Button
                                variant="link"
                                className="p-0 h-auto text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                onClick={() => {
                                  if (!notification.read) {
                                    markAsRead(notification.id);
                                  }
                                  navigate(notification.link);
                                }}
                              >
                                View details →
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
