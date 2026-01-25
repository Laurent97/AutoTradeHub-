// Comprehensive Notification system types for AutoTradeHub

export type NotificationType = 'payment' | 'order' | 'admin' | 'system' | 'promotion' | 'shipping';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  icon: string;
  read: boolean;
  link?: string;
  metadata?: Record<string, any>;
  priority: NotificationPriority;
  created_at: string;
  updated_at: string;
}

export interface NotificationCreate {
  user_id: string;
  title: string;
  message: string;
  type?: NotificationType;
  icon?: string;
  link?: string;
  metadata?: Record<string, any>;
  priority?: NotificationPriority;
}

export interface NotificationUpdate {
  read?: boolean;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  totalPages: number;
  currentPage: number;
}

// Notification metadata types for different notification types
export interface PaymentNotificationMetadata {
  orderId: string;
  amount: number;
  success: boolean;
  paymentMethod?: string;
}

export interface OrderNotificationMetadata {
  orderId: string;
  orderNumber: string;
  status: string;
  previousStatus?: string;
}

export interface AdminNotificationMetadata {
  sentBy: string;
  adminRole?: string;
}

export interface ShippingNotificationMetadata {
  orderId: string;
  trackingNumber?: string;
  shippingProvider?: string;
  estimatedDelivery?: string;
}

export interface PromotionNotificationMetadata {
  promotionId: string;
  discountCode?: string;
  discountAmount?: number;
  validUntil?: string;
}
