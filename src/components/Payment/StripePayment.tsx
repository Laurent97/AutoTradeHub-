import { useState } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripeService, stripePromise } from '../../lib/stripe/stripe-service';
import { useAuth } from '../../contexts/AuthContext';

interface StripePaymentProps {
  amount: number;
  orderId?: string;
  onSuccess: (data: any) => void;
  onError: (error: string) => void;
}

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

function StripePaymentForm({ amount, orderId, onSuccess, onError }: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !user) {
      setError('Stripe not loaded or user not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const { clientSecret, paymentIntentId } = await stripeService.createPaymentIntent({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'USD',
        userId: user.id,
        orderId,
      });

      if (!clientSecret || clientSecret === 'mock_client_secret') {
        throw new Error('Stripe payment requires backend API configuration. Please set up your Stripe backend endpoint.');
      }

      // Confirm payment with card
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: user.email,
          },
        },
      });

      if (confirmError) {
        throw confirmError;
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess({
          orderId: orderId || `ORD-${Date.now()}`,
          amount,
          method: 'stripe',
          paymentIntentId: paymentIntent.id,
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Payment failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
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
  };

  if (!stripePublishableKey) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-800 mb-2">Stripe Not Configured</h4>
        <p className="text-yellow-700 text-sm">
          Please configure VITE_STRIPE_PUBLISHABLE_KEY in your .env file to use Stripe payments.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Pay with Card</h3>
        <p className="text-blue-700 text-sm mb-4">
          Enter your card details below. Your payment is secured by Stripe.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <CardElement options={cardElementOptions} />
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
      >
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>

      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
        <p>🔒 Your payment information is encrypted and secure</p>
        <p className="mt-1">Powered by Stripe - PCI DSS compliant</p>
      </div>
    </form>
  );
}

export default function StripePayment(props: StripePaymentProps) {
  if (!stripePromise) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-800 mb-2">Stripe Not Available</h4>
        <p className="text-yellow-700 text-sm">
          Stripe is not configured. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file.
        </p>
      </div>
    );
  }

  const options: StripeElementsOptions = {
    mode: 'payment',
    amount: Math.round(props.amount * 100),
    currency: 'usd',
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentForm {...props} />
    </Elements>
  );
}
