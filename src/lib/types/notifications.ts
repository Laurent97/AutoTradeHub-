// Notification system types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  user_id?: string;
  created_at: string;
  read: boolean;
}

export interface NotificationCreate {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  user_id?: string;
}
