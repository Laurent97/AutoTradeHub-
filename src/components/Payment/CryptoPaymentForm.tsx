import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, CheckCircle, Clock, Bitcoin, AlertCircle, ExternalLink } from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';

interface CryptoPaymentFormProps {
  orderId: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface CryptoOption {
  symbol: string;
  name: string;
  address: string;
  icon: string;
  color: string;
}

export const CryptoPaymentForm: React.FC<CryptoPaymentFormProps> = ({
  orderId,
  amount,
  onSuccess,
  onError
}) => {
  const { user } = useAuth();
  const { recordPendingPayment } = usePayment();
  const [step, setStep] = useState<'selection' | 'payment' | 'confirmation' | 'submitted'>('selection');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cryptoOptions: CryptoOption[] = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      icon: '₿',
      color: 'text-orange-600',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      icon: 'Ξ',
      color: 'text-blue-600',
    },
    {
      symbol: 'USDT',
      name: 'Tether (ERC20)',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      icon: '₮',
      color: 'text-green-600',
    }
  ];

  const handleCryptoSelect = (crypto: CryptoOption) => {
    setSelectedCrypto(crypto);
    setStep('payment');
  };

  const handleCopyAddress = async () => {
    if (!selectedCrypto) return;
    try {
      await navigator.clipboard.writeText(selectedCrypto.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handleCopyAmount = async () => {
    try {
      await navigator.clipboard.writeText(amount.toString());
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    } catch (err) {
      console.error('Failed to copy amount:', err);
    }
  };

  const handleTransactionSubmit = async () => {
    if (!transactionId.trim()) {
      setError('Please enter a valid transaction ID');
      return;
    }

    if (!selectedCrypto) {
      setError('Please select a cryptocurrency');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Record crypto payment with TX ID
      await recordPendingPayment({
        order_id: orderId,
        customer_id: user?.id || '',
        payment_method: 'crypto',
        amount,
        crypto_address: selectedCrypto.address,
        crypto_transaction_id: transactionId,
        crypto_type: selectedCrypto.symbol
      });

      setStep('submitted');
      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {
      console.error('Error recording crypto payment:', err);
      setError('Failed to record payment. Please try again.');
      if (onError) {
        onError('Failed to record payment. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSelection = () => (
    <div className="crypto-selection space-y-4">
      <div className="text-center mb-4">
        <Bitcoin className="h-8 w-8 text-orange-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Select Cryptocurrency</h3>
        <p className="text-sm text-gray-600">Choose your preferred payment method</p>
      </div>

      <div className="grid gap-3">
        {cryptoOptions.map((crypto) => (
          <button
            key={crypto.symbol}
            onClick={() => handleCryptoSelect(crypto)}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`text-2xl font-bold ${crypto.color}`}>
                {crypto.icon}
              </div>
              <div className="text-left">
                <div className="font-semibold">{crypto.name}</div>
                <div className="text-sm text-gray-600">{crypto.symbol}</div>
              </div>
            </div>
            <div className="text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPayment = () => {
    if (!selectedCrypto) return null;

    return (
      <div className="crypto-payment space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className={`text-xl font-bold ${selectedCrypto.color}`}>
              {selectedCrypto.icon}
            </div>
            <h3 className="font-semibold text-blue-900">
              Send {selectedCrypto.name} ({selectedCrypto.symbol})
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Recipient Address:</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input 
                  value={selectedCrypto.address} 
                  readOnly 
                  className="font-mono text-xs bg-white"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyAddress}
                  className="shrink-0"
                >
                  {copiedAddress ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Amount (USD equivalent):</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input 
                  value={amount.toFixed(2)} 
                  readOnly 
                  className="font-bold bg-white"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyAmount}
                  className="shrink-0"
                >
                  {copiedAmount ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Important:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Send the exact USD equivalent amount</li>
                    <li>• Include sufficient network fees for timely confirmation</li>
                    <li>• Double-check the address before sending</li>
                    <li>• Save your transaction ID/hash for confirmation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={() => setStep('selection')}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
          <Button 
            onClick={() => setStep('confirmation')}
            className="flex-1"
          >
            I've Sent the Payment
          </Button>
        </div>
      </div>
    );
  };

  const renderConfirmation = () => {
    if (!selectedCrypto) return null;

    return (
      <div className="crypto-confirmation space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Confirm Transaction Details</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-mono">#{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Cryptocurrency:</span>
              <span className="font-semibold">{selectedCrypto.name} ({selectedCrypto.symbol})</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-bold">${amount.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Address:</span>
              <span className="font-mono text-xs max-w-[200px] truncate">{selectedCrypto.address}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="transactionId" className="text-sm font-medium text-gray-700">
            Transaction ID (TX Hash):
          </Label>
          <Input
            id="transactionId"
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter the transaction hash from your wallet"
            className="font-mono"
          />
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              By confirming, you verify that you have sent the cryptocurrency. 
              An admin will verify the transaction on the blockchain and process your order within 1-24 hours.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={() => setStep('payment')}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
          <Button 
            onClick={handleTransactionSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              'Submit Transaction ID'
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
  };

  const renderSubmitted = () => (
    <div className="crypto-submitted space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">Transaction Submitted</h3>
        
        <div className="space-y-2 text-sm text-green-800">
          <p>Your crypto payment has been recorded successfully.</p>
          <p>Transaction ID: <code className="bg-white px-1 rounded">{transactionId}</code></p>
          <p>An admin will verify the transaction on blockchain within 24 hours.</p>
        </div>

        <div className="mt-4 p-3 bg-white rounded border border-green-200">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-semibold text-yellow-600">Awaiting Admin Verification</span>
            </div>
            <div className="flex justify-between">
              <span>Order Status:</span>
              <span className="font-semibold text-yellow-600">Pending Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Admin will verify your transaction on the blockchain</li>
          <li>• Transaction amount and confirmation will be checked</li>
          <li>• You'll receive a confirmation email once verified</li>
          <li>• Your order will be processed immediately after verification</li>
        </ul>
      </div>

      {selectedCrypto && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ExternalLink className="h-4 w-4" />
            <span>
              You can track your transaction on any {selectedCrypto.name} block explorer using the TX ID
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="crypto-payment-form">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Bitcoin className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Pay with Cryptocurrency</h3>
        </div>
      </div>

      {step === 'selection' && renderSelection()}
      {step === 'payment' && renderPayment()}
      {step === 'confirmation' && renderConfirmation()}
      {step === 'submitted' && renderSubmitted()}
    </div>
  );
};

export default CryptoPaymentForm;
