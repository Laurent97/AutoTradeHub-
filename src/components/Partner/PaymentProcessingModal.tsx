import React, { useState } from 'react';
import { X, AlertTriangle, Wallet, ArrowRight, Plus, Minus, AlertCircle } from 'lucide-react';

interface PaymentProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  walletBalance: number;
  onConfirmPayment: (orderId: string) => Promise<void>;
  onAddFunds: () => void;
}

export default function PaymentProcessingModal({ 
  isOpen, 
  onClose, 
  order, 
  walletBalance, 
  onConfirmPayment, 
  onAddFunds 
}: PaymentProcessingModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await onConfirmPayment(order.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed');
      setLoading(false);
    }
  };

  const insufficientBalance = walletBalance < order.total_amount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Process Order Payment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Warning for insufficient balance */}
        {insufficientBalance && (
          <div className="mx-6 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                  Insufficient Balance
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Your wallet balance (${formatCurrency(walletBalance)}) is insufficient to process this order (${formatCurrency(order.total_amount)}).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mx-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                  Payment Failed
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Order #{order.order_number || order.id?.slice(0, 8)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total: {formatCurrency(order.total_amount)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Current Balance:</span>
                <span className={`font-bold ${
                  insufficientBalance ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {formatCurrency(walletBalance)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Order Amount:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Remaining Balance:</span>
                <span className={`font-bold ${
                  insufficientBalance ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                }`}>
                  {formatCurrency(walletBalance - order.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleConfirm}
              disabled={loading || insufficientBalance}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                loading || insufficientBalance
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-transparent border-b-transparent border-l-transparent border-r-transparent"></div>
                </div>
              ) : (
                <>
                  <span className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4" />
                    Confirm Payment
                  </span>
                </>
              )}
            </button>

            <button
              onClick={onAddFunds}
              className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <span className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                Add Funds
              </span>
            </button>
          </div>

          {/* Info Message */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                  Wallet Payment Processing
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  This will process the payment using your available wallet balance and update the order status.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: { currency: 'USD' },
      minimumFractionDigits: 2
    }).format(amount);
  }
}
