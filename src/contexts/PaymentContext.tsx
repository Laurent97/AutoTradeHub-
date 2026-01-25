import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase/client';

export type PaymentMethod = 'stripe' | 'paypal' | 'crypto' | 'wallet';

export interface PaymentMethodConfig {
  id: string;
  method_name: PaymentMethod;
  enabled: boolean;
  customer_access: boolean;
  partner_access: boolean;
  admin_access: boolean;
  admin_confirmation_required: boolean;
  collect_data_only: boolean;
  config_data: Record<string, any>;
}

export interface PaymentContextType {
  availableMethods: PaymentMethod[];
  paymentConfigs: Record<PaymentMethod, PaymentMethodConfig | null>;
  isLoading: boolean;
  canUseMethod: (method: PaymentMethod) => boolean;
  recordStripeAttempt: (data: StripeAttemptData) => Promise<void>;
  recordPendingPayment: (data: PendingPaymentData) => Promise<string>;
  getPendingPayments: () => Promise<any[]>;
  verifyPayment: (paymentId: string, action: 'verify' | 'reject', data?: any) => Promise<void>;
}

export interface StripeAttemptData {
  order_id: string;
  customer_id: string;
  amount: number;
  currency?: string;
  payment_intent_id?: string;
  collected_data?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export interface PendingPaymentData {
  order_id: string;
  customer_id: string;
  payment_method: PaymentMethod;
  amount: number;
  currency?: string;
  paypal_email?: string;
  paypal_transaction_id?: string;
  crypto_address?: string;
  crypto_transaction_id?: string;
  crypto_type?: string;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [paymentConfigs, setPaymentConfigs] = useState<Record<PaymentMethod, PaymentMethodConfig | null>>({} as Record<PaymentMethod, PaymentMethodConfig | null>);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch payment method configurations
  useEffect(() => {
    fetchPaymentConfigs();
  }, []);

  const fetchPaymentConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_method_config')
        .select('*');

      if (error) throw error;

      const configs: Record<PaymentMethod, PaymentMethodConfig | null> = {} as Record<PaymentMethod, PaymentMethodConfig | null>;
      data?.forEach(config => {
        configs[config.method_name as PaymentMethod] = config;
      });

      setPaymentConfigs(configs);
    } catch (error) {
      console.error('Error fetching payment configs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get available payment methods based on user role
  const availableMethods: PaymentMethod[] = Object.entries(paymentConfigs)
    .filter(([_, config]) => {
      if (!config || !config.enabled) return false;
      
      if (!user) return false;
      
      switch (user.user_type) {
        case 'customer':
          return config.customer_access;
        case 'partner':
          return config.partner_access;
        case 'admin':
          return config.admin_access;
        default:
          return false;
      }
    })
    .map(([method]) => method as PaymentMethod);

  // Check if user can use specific payment method
  const canUseMethod = (method: PaymentMethod): boolean => {
    const config = paymentConfigs[method];
    if (!config || !config.enabled) return false;
    
    if (!user) return false;
    
    switch (user.user_type) {
      case 'customer':
        return config.customer_access;
      case 'partner':
        return config.partner_access;
      case 'admin':
        return config.admin_access;
      default:
        return false;
    }
  };

  // Record Stripe payment attempt (for security monitoring)
  const recordStripeAttempt = async (data: StripeAttemptData): Promise<void> => {
    try {
      const { error } = await supabase
        .from('stripe_payment_attempts')
        .insert({
          ...data,
          status: 'rejected',
          rejection_reason: 'customer_not_allowed_stripe'
        });

      if (error) throw error;

      // Log security event
      await logSecurityEvent({
        user_id: data.customer_id,
        event_type: 'customer_stripe_attempt',
        event_data: {
          order_id: data.order_id,
          amount: data.amount,
          ip_address: data.ip_address,
          user_agent: data.user_agent
        },
        ip_address: data.ip_address,
        user_agent: data.user_agent
      });

    } catch (error) {
      console.error('Error recording Stripe attempt:', error);
      throw error;
    }
  };

  // Record pending payment (PayPal or Crypto)
  const recordPendingPayment = async (data: PendingPaymentData): Promise<string> => {
    try {
      const { data: result, error } = await supabase
        .from('pending_payments')
        .insert({
          ...data,
          status: 'pending_confirmation'
        })
        .select()
        .single();

      if (error) throw error;

      // Notify admins
      await notifyAdmins({
        type: 'payment_pending',
        payment_id: result.id,
        payment_method: data.payment_method,
        order_id: data.order_id,
        amount: data.amount
      });

      return result.id;
    } catch (error) {
      console.error('Error recording pending payment:', error);
      throw error;
    }
  };

  // Get pending payments for admin verification
  const getPendingPayments = async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('pending_payments')
        .select(`
          *,
          customer:auth.users(email, full_name)
        `)
        .eq('status', 'pending_confirmation')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      throw error;
    }
  };

  // Verify or reject payment (admin action)
  const verifyPayment = async (paymentId: string, action: 'verify' | 'reject', data?: any): Promise<void> => {
    try {
      const updateData: any = {
        status: action === 'verify' ? 'verified' : 'rejected',
        confirmed_by: user?.id,
        confirmed_at: new Date().toISOString()
      };

      if (action === 'reject' && data?.reason) {
        updateData.rejection_reason = data.reason;
      }

      // Update payment status
      const { error: updateError } = await supabase
        .from('pending_payments')
        .update(updateData)
        .eq('id', paymentId);

      if (updateError) throw updateError;

      // Get payment details
      const { data: payment, error: fetchError } = await supabase
        .from('pending_payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (fetchError) throw fetchError;

      if (action === 'verify') {
        // Update order status to paid
        await updateOrderStatus(payment.order_id, 'paid', {
          payment_method: payment.payment_method,
          payment_transaction_id: payment.crypto_transaction_id || payment.paypal_transaction_id,
          payment_verified_by: user?.id,
          payment_verified_at: new Date().toISOString()
        });

        // Move to paid orders archive
        await moveToPaidOrders(payment.order_id);

        // Notify customer
        await notifyCustomerPaymentVerified(payment.customer_id, payment.order_id);
      } else {
        // Update order status to payment failed
        await updateOrderStatus(payment.order_id, 'payment_failed', {
          payment_rejection_reason: data?.reason
        });

        // Notify customer of rejection
        await notifyCustomerPaymentRejection(payment.customer_id, payment.order_id, data?.reason);
      }

    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  };

  // Helper functions
  const logSecurityEvent = async (eventData: any) => {
    try {
      await supabase
        .from('payment_security_logs')
        .insert(eventData);
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  };

  const notifyAdmins = async (notificationData: any) => {
    try {
      // Get all admin users
      const { data: admins } = await supabase
        .from('auth.users')
        .select('id')
        .eq('user_type', 'admin');

      if (admins) {
        const notifications = admins.map(admin => ({
          admin_id: admin.id,
          payment_id: notificationData.payment_id,
          notification_type: notificationData.type,
          message: `New ${notificationData.payment_method} payment pending for order ${notificationData.order_id} - $${notificationData.amount}`
        }));

        await supabase
          .from('admin_payment_notifications')
          .insert(notifications);
      }
    } catch (error) {
      console.error('Error notifying admins:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, updateData: any) => {
    try {
      await supabase
        .from('orders')
        .update({
          status,
          ...updateData
        })
        .eq('order_number', orderId);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const moveToPaidOrders = async (orderId: string) => {
    try {
      const { error } = await supabase
        .rpc('move_to_paid_orders', { order_id_param: orderId });

      if (error) throw error;
    } catch (error) {
      console.error('Error moving order to paid orders:', error);
      throw error;
    }
  };

  const notifyCustomerPaymentVerified = async (customerId: string, orderId: string) => {
    // Implementation for customer notification (email, in-app, etc.)
    console.log(`Payment verified notification sent to customer ${customerId} for order ${orderId}`);
  };

  const notifyCustomerPaymentRejection = async (customerId: string, orderId: string, reason: string) => {
    // Implementation for customer rejection notification
    console.log(`Payment rejected notification sent to customer ${customerId} for order ${orderId}. Reason: ${reason}`);
  };

  const value: PaymentContextType = {
    availableMethods,
    paymentConfigs,
    isLoading,
    canUseMethod,
    recordStripeAttempt,
    recordPendingPayment,
    getPendingPayments,
    verifyPayment
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
