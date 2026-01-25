import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CreditCard, Shield } from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';

// Initialize Stripe with test key (replace with your actual key)
const stripePromise = loadStripe('pk_test_51234567890abcdefghijklmnopqrstuvwxyz');

interface StripePaymentFormProps {
  orderId: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const StripePaymentFormComponent: React.FC<StripePaymentFormProps> = ({
  orderId,
  amount,
  onSuccess,
  onError
}) => {
  const { user } = useAuth();
  const { recordStripeAttempt } = usePayment();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRejection, setShowRejection] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Collect card data (this will fail but we want to record it)
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method (this will be recorded but rejected)
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      // Record the attempt regardless of outcome
      await recordStripeAttempt({
        order_id: orderId,
        customer_id: user?.id || '',
        amount,
        payment_intent_id: paymentMethod?.id,
        collected_data: {
          last4: paymentMethod?.card?.last4,
          brand: paymentMethod?.card?.brand,
          country: paymentMethod?.card?.country,
          stripe_error: stripeError?.message
        },
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent
      });

      // Always show rejection for customers
      setShowRejection(true);
      
      if (onError) {
        onError(
          'Sorry, the payment method was rejected due to security reasons. ' +
          'Please choose another payment method available.'
        );
      }

    } catch (err) {
      console.error('Stripe payment error:', err);
      
      // Still record the attempt
      await recordStripeAttempt({
        order_id: orderId,
        customer_id: user?.id || '',
        amount,
        collected_data: {
          error: err instanceof Error ? err.message : 'Unknown error',
          timestamp: new Date().toISOString()
        },
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent
      });

      setError('Payment processing failed. Please try another payment method.');
      setShowRejection(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  if (showRejection) {
    return (
      <div className="stripe-rejection-message">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="space-y-2">
              <p className="font-semibold">
                Payment Method Not Available
              </p>
              <p>
                Sorry, the payment method was rejected due to security reasons. 
                Please choose another payment method available.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4" />
                <span>Your payment information has been securely recorded for verification purposes.</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Available payment methods:</strong>
          </p>
          <ul className="text-sm text-gray-600 mt-1 space-y-1">
            <li>• Cryptocurrency (Bitcoin, Ethereum, USDT)</li>
            <li>• PayPal (with admin confirmation)</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="stripe-payment-form">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Pay with Credit/Debit Card</h3>
        </div>
        
        {(user as any)?.user_type === 'customer' && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This payment method is currently under review for your account type.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 border border-gray-300 rounded-lg bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full"
          variant="default"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </Button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <div className="flex items-center justify-center gap-1">
          <Shield className="h-3 w-3" />
          <span>Secured by Stripe encryption</span>
        </div>
      </div>
    </div>
  );
};

// Wrapper component with Elements provider
export const StripePaymentForm: React.FC<StripePaymentFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentFormComponent {...props} />
    </Elements>
  );
};

export default StripePaymentForm;
