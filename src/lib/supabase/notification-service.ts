import { Notification, NotificationCreate } from '@/lib/types/notifications';
import { supabase } from './client';

export class NotificationService {
  // Create a new notification
  static async create(notification: NotificationCreate): Promise<{ data: Notification | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          created_at: new Date().toISOString(),
          read: false
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating notification:', error);
      return { data: null, error };
    }
  }

  // Get notifications for a specific user
  static async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  // Get all notifications (for admin)
  static async getAllNotifications(): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  // Create notifications for common admin actions
  static async notifyOrderAssigned(orderId: string, partnerId: string): Promise<void> {
    await this.create({
      title: 'Order Assigned',
      message: `Order #${orderId} has been assigned to you`,
      type: 'info',
      user_id: partnerId
    });
  }

  static async notifyBalanceUpdated(userId: string, amount: number, type: 'add' | 'subtract'): Promise<void> {
    await this.create({
      title: 'Balance Updated',
      message: `Your wallet balance has been ${type === 'add' ? 'credited' : 'debited'} with $${amount.toFixed(2)}`,
      type: 'success',
      user_id: userId
    });
  }

  static async notifyPartnerApproved(userId: string): Promise<void> {
    await this.create({
      title: 'Partner Application Approved',
      message: 'Congratulations! Your partner application has been approved. You can now access your partner dashboard.',
      type: 'success',
      user_id: userId
    });
  }

  static async notifyPartnerStatusChanged(userId: string, newStatus: PartnerStatus): Promise<void> {
    const statusMessages = {
      'approved': 'Your partner application has been approved! You can now access your partner dashboard.',
      'rejected': 'Your partner application has been reviewed. Please check your account for details.',
      'suspended': 'Your partner account has been suspended. Please contact support for more information.',
      'pending': 'Your partner application is being reviewed. We will notify you once a decision is made.'
    };

    await this.create({
      title: 'Partner Status Updated',
      message: statusMessages[newStatus] || 'Your partner status has been updated.',
      type: newStatus === 'approved' ? 'success' : newStatus === 'rejected' ? 'error' : 'warning',
      user_id: userId
    });
  }
}
