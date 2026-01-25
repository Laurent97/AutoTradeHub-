import { notificationService } from './notificationService';
import { paymentService } from '@/lib/supabase/payment-service';
import { orderService } from '@/lib/supabase/order-service';

/**
 * Integration service to connect notifications with existing payment and order flows
 */

export class NotificationIntegrations {
  
  // Payment notification integrations
  static async handlePaymentSuccess(
    userId: string,
    orderId: string,
    amount: number,
    paymentMethod: string = 'stripe'
  ) {
    try {
      await notificationService.sendPaymentNotification(userId, {
        orderId,
        amount,
        success: true,
        paymentMethod
      });
    } catch (error) {
      console.error('Error sending payment success notification:', error);
    }
  }

  static async handlePaymentFailure(
    userId: string,
    orderId: string,
    amount: number,
    reason: string = 'Payment processing failed'
  ) {
    try {
      await notificationService.sendPaymentNotification(userId, {
        orderId,
        amount,
        success: false,
        paymentMethod: 'stripe'
      });
      
      // Send additional system notification with failure reason
      await notificationService.sendSystemNotification(
        userId,
        'Payment Failed',
        `Your payment of $${amount} for order #${orderId} failed: ${reason}`,
        'high',
        `/orders/${orderId}`
      );
    } catch (error) {
      console.error('Error sending payment failure notification:', error);
    }
  }

  static async handlePaymentRefund(
    userId: string,
    orderId: string,
    amount: number,
    refundId: string
  ) {
    try {
      await notificationService.sendSystemNotification(
        userId,
        'Payment Refunded',
        `Your payment of $${amount} for order #${orderId} has been refunded. Refund ID: ${refundId}`,
        'medium',
        `/orders/${orderId}`
      );
    } catch (error) {
      console.error('Error sending refund notification:', error);
    }
  }

  // Order notification integrations
  static async handleOrderCreated(userId: string, orderData: any) {
    try {
      await notificationService.sendOrderStatusNotification(userId, {
        orderId: orderData.id,
        orderNumber: orderData.order_number,
        status: 'pending',
        previousStatus: null
      });
    } catch (error) {
      console.error('Error sending order created notification:', error);
    }
  }

  static async handleOrderStatusChange(
    userId: string,
    orderId: string,
    orderNumber: string,
    newStatus: string,
    previousStatus?: string
  ) {
    try {
      await notificationService.sendOrderStatusNotification(userId, {
        orderId,
        orderNumber,
        status: newStatus,
        previousStatus
      });
    } catch (error) {
      console.error('Error sending order status change notification:', error);
    }
  }

  static async handleOrderShipped(
    userId: string,
    orderId: string,
    orderNumber: string,
    trackingNumber: string,
    shippingProvider: string,
    estimatedDelivery?: string
  ) {
    try {
      await notificationService.sendShippingNotification(userId, {
        orderId,
        trackingNumber,
        shippingProvider,
        estimatedDelivery
      });
    } catch (error) {
      console.error('Error sending order shipped notification:', error);
    }
  }

  static async handleOrderDelivered(userId: string, orderId: string, orderNumber: string) {
    try {
      await notificationService.sendOrderStatusNotification(userId, {
        orderId,
        orderNumber,
        status: 'delivered',
        previousStatus: 'shipped'
      });
    } catch (error) {
      console.error('Error sending order delivered notification:', error);
    }
  }

  static async handleOrderCancelled(userId: string, orderId: string, orderNumber: string, reason?: string) {
    try {
      await notificationService.sendOrderStatusNotification(userId, {
        orderId,
        orderNumber,
        status: 'cancelled',
        previousStatus: 'pending'
      });

      if (reason) {
        await notificationService.sendSystemNotification(
          userId,
          'Order Cancelled',
          `Order #${orderNumber} has been cancelled. Reason: ${reason}`,
          'high',
          `/orders/${orderId}`
        );
      }
    } catch (error) {
      console.error('Error sending order cancelled notification:', error);
    }
  }

  // Admin notification integrations
  static async sendAdminToUserNotification(
    userId: string,
    title: string,
    message: string,
    adminId: string,
    adminRole: string = 'admin',
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ) {
    try {
      await notificationService.sendAdminMessage(userId, message, {
        sentBy: adminId,
        adminRole
      }, priority);
    } catch (error) {
      console.error('Error sending admin notification:', error);
    }
  }

  // Promotion notification integrations
  static async sendPromotionNotification(
    userId: string,
    promotionTitle: string,
    promotionMessage: string,
    promotionId: string,
    discountCode?: string,
    discountAmount?: number,
    validUntil?: string
  ) {
    try {
      await notificationService.sendPromotionNotification(userId, {
        promotionId,
        discountCode,
        discountAmount,
        validUntil
      });
    } catch (error) {
      console.error('Error sending promotion notification:', error);
    }
  }

  // System notification integrations
  static async sendSystemMaintenanceNotification(
    userId: string,
    scheduledTime: string,
    duration: string
  ) {
    try {
      await notificationService.sendSystemNotification(
        userId,
        'Scheduled Maintenance',
        `System maintenance is scheduled for ${scheduledTime} and will take approximately ${duration}. You may experience temporary service interruptions.`,
        'medium'
      );
    } catch (error) {
      console.error('Error sending maintenance notification:', error);
    }
  }

  static async sendSecurityAlert(
    userId: string,
    alertType: 'login' | 'password_change' | 'email_change' | 'suspicious_activity',
    details: string
  ) {
    try {
      const titles = {
        login: 'New Login Detected',
        password_change: 'Password Changed',
        email_change: 'Email Updated',
        suspicious_activity: 'Security Alert'
      };

      await notificationService.sendSystemNotification(
        userId,
        titles[alertType],
        details,
        'high',
        '/security'
      );
    } catch (error) {
      console.error('Error sending security alert:', error);
    }
  }

  // Wallet notification integrations
  static async handleWalletDeposit(
    userId: string,
    amount: number,
    currency: string,
    transactionId: string
  ) {
    try {
      await notificationService.sendSystemNotification(
        userId,
        'Wallet Deposit Received',
        `Your wallet has been credited with ${amount} ${currency}. Transaction ID: ${transactionId}`,
        'medium',
        '/wallet'
      );
    } catch (error) {
      console.error('Error sending wallet deposit notification:', error);
    }
  }

  static async handleWalletWithdrawal(
    userId: string,
    amount: number,
    currency: string,
    transactionId: string,
    status: 'pending' | 'completed' | 'failed'
  ) {
    try {
      const titles = {
        pending: 'Withdrawal Requested',
        completed: 'Withdrawal Completed',
        failed: 'Withdrawal Failed'
      };

      const messages = {
        pending: `Your withdrawal request for ${amount} ${currency} has been submitted and is being processed.`,
        completed: `Your withdrawal of ${amount} ${currency} has been completed. Transaction ID: ${transactionId}`,
        failed: `Your withdrawal request for ${amount} ${currency} has failed. Please contact support.`
      };

      const priorities = {
        pending: 'medium',
        completed: 'low',
        failed: 'high'
      };

      await notificationService.sendSystemNotification(
        userId,
        titles[status],
        messages[status],
        priorities[status] as 'low' | 'medium' | 'high' | 'urgent',
        '/wallet'
      );
    } catch (error) {
      console.error('Error sending wallet withdrawal notification:', error);
    }
  }
}

export default NotificationIntegrations;
