import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, CheckCircle, Clock, Mail, AlertCircle } from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';

interface PayPalPaymentFormProps {
  orderId: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const PayPalPaymentForm: React.FC<PayPalPaymentFormProps> = ({
  orderId,
  amount,
  onSuccess,
  onError
}) => {
  const { user } = useAuth();
  const { recordPendingPayment } = usePayment();
  const [step, setStep] = useState<'instructions' | 'confirming' | 'submitted'>('instructions');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paypalDetails = {
    email: 'payments@autotradehub.com',
    instructions: `Send ${amount.toFixed(2)} USD to payments@autotradehub.com with Order ID: ${orderId} in the notes`
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(paypalDetails.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePaymentSent = async () => {
    if (!transactionId.trim()) {
      setError('Please enter the PayPal transaction ID');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Record payment attempt
      await recordPendingPayment({
        order_id: orderId,
        customer_id: user?.id || '',
        payment_method: 'paypal',
        amount,
        paypal_email: paypalDetails.email,
        paypal_transaction_id: transactionId
      });

      setStep('submitted');
      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {
      console.error('Error recording PayPal payment:', err);
      setError('Failed to record payment. Please try again.');
      if (onError) {
        onError('Failed to record payment. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInstructions = () => (
    <div className="paypal-instructions space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Send Payment via PayPal</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium text-gray-700">PayPal Email:</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input 
                value={paypalDetails.email} 
                readOnly 
                className="font-mono bg-white"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyEmail}
                className="shrink-0"
              >
                {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Amount:</Label>
            <div className="text-lg font-bold text-gray-900 mt-1">
              ${amount.toFixed(2)} USD
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Reference:</Label>
            <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
              Order #{orderId}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Important:</p>
            <ul className="mt-1 space-y-1">
              <li>• Include the Order ID in the PayPal notes</li>
              <li>• Send the exact amount (${amount.toFixed(2)} USD)</li>
              <li>• Keep your transaction ID for confirmation</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Processing time: 1-24 hours after confirmation</span>
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="transactionId" className="text-sm font-medium text-gray-700">
          PayPal Transaction ID:
        </Label>
        <Input
          id="transactionId"
          type="text"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="Enter the transaction ID from your PayPal receipt"
          className="font-mono"
        />
        
        <Button 
          onClick={() => setStep('confirming')}
          className="w-full"
          variant="outline"
        >
          I've Sent the Payment
        </Button>
      </div>
    </div>
  );

  const renderConfirming = () => (
    <div className="paypal-confirming space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Confirm Payment Details</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Order ID:</span>
            <span className="font-mono">#{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-bold">${amount.toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between">
            <span>Transaction ID:</span>
            <span className="font-mono text-xs">{transactionId}</span>
          </div>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          By confirming, you verify that you have sent the payment via PayPal. 
          An admin will verify your transaction and process your order within 1-24 hours.
        </AlertDescription>
      </Alert>

      <div className="flex gap-3">
        <Button 
          onClick={() => setStep('instructions')}
          variant="outline"
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={handlePaymentSent}
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </div>
          ) : (
            'Confirm Payment Sent'
          )}
        </Button>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderSubmitted = () => (
    <div className="paypal-submitted space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">Payment Submitted for Verification</h3>
        
        <div className="space-y-2 text-sm text-green-800">
          <p>Your payment details have been recorded successfully.</p>
          <p>An admin will verify your PayPal transaction within 24 hours.</p>
        </div>

        <div className="mt-4 p-3 bg-white rounded border border-green-200">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Order Status:</span>
              <span className="font-semibold text-yellow-600">Pending Confirmation</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction ID:</span>
              <span className="font-mono text-xs">{transactionId}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Admin will verify your PayPal transaction</li>
          <li>• You'll receive a confirmation email once verified</li>
          <li>• Your order will be processed immediately after verification</li>
          <li>• You can check your order status in your account</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="paypal-payment-form">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Pay with PayPal</h3>
        </div>
      </div>

      {step === 'instructions' && renderInstructions()}
      {step === 'confirming' && renderConfirming()}
      {step === 'submitted' && renderSubmitted()}
    </div>
  );
};

export default PayPalPaymentForm;
