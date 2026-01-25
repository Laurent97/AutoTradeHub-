import { supabase } from '@/lib/supabase/client';
import { 
  Notification, 
  NotificationCreate, 
  NotificationUpdate, 
  NotificationListResponse,
  PaymentNotificationMetadata,
  OrderNotificationMetadata,
  AdminNotificationMetadata,
  ShippingNotificationMetadata,
  PromotionNotificationMetadata
} from '@/lib/types/notifications';

class NotificationService {
  // Get user notifications with pagination
  async getNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false,
    type?: string
  ): Promise<NotificationListResponse> {
    try {
      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (unreadOnly) {
        query = query.eq('read', false);
      }

      if (type && type !== 'all') {
        query = query.eq('type', type);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;

      // Get unread count
      const { count: unreadCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      return {
        notifications: data || [],
        total: count || 0,
        unreadCount: unreadCount || 0,
        totalPages: Math.ceil((count || 0) / limit),
        currentPage: page
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Get unread count for a user
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Create notification
  async createNotification(notification: NotificationCreate): Promise<Notification> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Send payment notification
  async sendPaymentNotification(
    userId: string,
    paymentData: PaymentNotificationMetadata
  ): Promise<Notification> {
    const notification: NotificationCreate = {
      user_id: userId,
      title: paymentData.success ? 'Payment Successful' : 'Payment Failed',
      message: paymentData.success 
        ? `Your payment of $${paymentData.amount} was processed successfully. Order #${paymentData.orderId}` 
        : `Payment for order #${paymentData.orderId} failed. Please try again.`,
      type: 'payment',
      icon: paymentData.success ? 'check-circle' : 'x-circle',
      link: `/orders/${paymentData.orderId}`,
      metadata: paymentData,
      priority: paymentData.success ? 'medium' : 'high'
    };

    return this.createNotification(notification);
  }

  // Send order status notification
  async sendOrderStatusNotification(
    userId: string,
    orderData: OrderNotificationMetadata
  ): Promise<Notification> {
    const statusMessages: Record<string, string> = {
      processing: 'Your order is being processed',
      shipped: 'Your order has been shipped',
      delivered: 'Your order has been delivered',
      cancelled: 'Your order has been cancelled',
      confirmed: 'Your order has been confirmed',
      pending: 'Your order is pending confirmation'
    };
    
    const notification: NotificationCreate = {
      user_id: userId,
      title: `Order ${orderData.status}`,
      message: `${statusMessages[orderData.status] || `Order status updated to ${orderData.status}`}. Order #${orderData.orderNumber}`,
      type: 'order',
      icon: 'package',
      link: `/orders/${orderData.orderId}`,
      metadata: orderData,
      priority: orderData.status === 'cancelled' ? 'high' : 'medium'
    };

    return this.createNotification(notification);
  }

  // Send admin message notification
  async sendAdminMessage(
    userId: string,
    message: string,
    adminData: AdminNotificationMetadata,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ): Promise<Notification> {
    const notification: NotificationCreate = {
      user_id: userId,
      title: 'Message from Admin',
      message,
      type: 'admin',
      icon: 'message-square',
      metadata: adminData,
      priority
    };

    return this.createNotification(notification);
  }

  // Send shipping notification
  async sendShippingNotification(
    userId: string,
    shippingData: ShippingNotificationMetadata
  ): Promise<Notification> {
    const message = shippingData.trackingNumber
      ? `Your order has been shipped via ${shippingData.shippingProvider}. Tracking: ${shippingData.trackingNumber}`
      : 'Your order has been shipped and is on its way!';

    const notification: NotificationCreate = {
      user_id: userId,
      title: 'Order Shipped',
      message,
      type: 'shipping',
      icon: 'truck',
      link: shippingData.trackingNumber 
        ? `/track/${shippingData.trackingNumber}` 
        : `/orders/${shippingData.orderId}`,
      metadata: shippingData,
      priority: 'medium'
    };

    return this.createNotification(notification);
  }

  // Send promotion notification
  async sendPromotionNotification(
    userId: string,
    promotionData: PromotionNotificationMetadata
  ): Promise<Notification> {
    const message = promotionData.discountCode
      ? `Special offer! Use code ${promotionData.discountCode} to get ${promotionData.discountAmount}% off`
      : 'Check out our latest promotions and deals!';

    const notification: NotificationCreate = {
      user_id: userId,
      title: '🎉 Special Promotion',
      message,
      type: 'promotion',
      icon: 'gift',
      link: '/promotions',
      metadata: promotionData,
      priority: 'low'
    };

    return this.createNotification(notification);
  }

  // Send system notification
  async sendSystemNotification(
    userId: string,
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium',
    link?: string
  ): Promise<Notification> {
    const notification: NotificationCreate = {
      user_id: userId,
      title,
      message,
      type: 'system',
      icon: 'bell',
      link,
      priority
    };

    return this.createNotification(notification);
  }
}

export const notificationService = new NotificationService();
export default notificationService;
