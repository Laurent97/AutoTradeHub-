import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { paymentService } from '../../lib/supabase/payment-service';
import { useAuth } from '../../contexts/AuthContext';

interface PayPalPaymentProps {
  amount: number;
  orderId?: string;
  onSuccess: (data: any) => void;
  onError: (error: string) => void;
}

export default function PayPalPayment({ amount, orderId, onSuccess, onError }: PayPalPaymentProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';

  const createOrder = async () => {
    setLoading(true);
    try {
      const transactionId = `order_${Date.now()}_${user?.id || 'guest'}`;
      
      const { data, error } = await paymentService.createPayPalTransaction({
        orderId: transactionId,
        amount,
        currency: 'USD'
      });

      if (error) throw error;
      
      return transactionId;
    } catch (error: any) {
      onError(error.message);
      return '';
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (data: any) => {
    setLoading(true);
    try {
      // Update transaction status
      await paymentService.updatePayPalTransaction(
        data.orderID,
        'completed',
        data.paymentID
      );

      // Link to order if exists
      if (orderId) {
        await paymentService.linkOrderToPayment(
          orderId,
          'paypal',
          amount,
          data.orderID
        );
      }

      onSuccess({
        orderId: data.orderID,
        amount,
        method: 'paypal'
      });
    } catch (error: any) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <PayPalScriptProvider
          options={{
            clientId: paypalClientId,
            currency: "USD",
            intent: "capture"
          }}
        >
          <PayPalButtons
            style={{
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "paypal"
            }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={(err) => onError(err.message)}
            disabled={loading}
          />
        </PayPalScriptProvider>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-800 mb-2">PayPal Information:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• You'll be redirected to PayPal to complete payment</li>
          <li>• Use sandbox account for testing: sb-4a1dq39276485@personal.example.com</li>
          <li>• Password: K5L=fP2+</li>
          <li>• Orders are processed after payment confirmation</li>
        </ul>
      </div>
    </div>
  );
}
