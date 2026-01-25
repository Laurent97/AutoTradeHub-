import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Bitcoin, 
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  User,
  Calendar,
  DollarSign
} from 'lucide-react';

interface PendingPayment {
  id: string;
  order_id: string;
  customer_id: string;
  payment_method: 'paypal' | 'crypto';
  amount: number;
  currency: string;
  paypal_email?: string;
  paypal_transaction_id?: string;
  crypto_address?: string;
  crypto_transaction_id?: string;
  crypto_type?: string;
  status: string;
  created_at: string;
  customer?: {
    email: string;
    full_name: string;
  };
}

export const PaymentVerification: React.FC = () => {
  const { user } = useAuth();
  const { getPendingPayments, verifyPayment } = usePayment();
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<{ [key: string]: string }>({});
  const [showRejectForm, setShowRejectForm] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      const payments = await getPendingPayments();
      setPendingPayments(payments);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (paymentId: string) => {
    setVerifying(paymentId);
    try {
      await verifyPayment(paymentId, 'verify');
      // Remove from pending list
      setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
    } catch (error) {
      console.error('Error verifying payment:', error);
    } finally {
      setVerifying(null);
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    const reason = rejectionReason[paymentId];
    if (!reason?.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setRejecting(paymentId);
    try {
      await verifyPayment(paymentId, 'reject', { reason });
      // Remove from pending list
      setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
      setShowRejectForm(null);
      setRejectionReason(prev => {
        const newReasons = { ...prev };
        delete newReasons[paymentId];
        return newReasons;
      });
    } catch (error) {
      console.error('Error rejecting payment:', error);
    } finally {
      setRejecting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'paypal':
        return <Mail className="h-4 w-4 text-blue-600" />;
      case 'crypto':
        return <Bitcoin className="h-4 w-4 text-orange-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getExplorerUrl = (cryptoType: string, txId: string) => {
    const explorers: { [key: string]: string } = {
      'BTC': 'https://blockstream.info/tx/',
      'ETH': 'https://etherscan.io/tx/',
      'USDT': 'https://etherscan.io/tx/'
    };
    return `${explorers[cryptoType] || ''}${txId}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading pending payments...</span>
      </div>
    );
  }

  return (
    <div className="payment-verification space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Payment Verification</h2>
        <p className="text-gray-600">
          Review and verify pending customer payments
        </p>
      </div>

      {pendingPayments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending payments to verify</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingPayments.map((payment) => (
            <Card key={payment.id} className="border-l-4 border-l-yellow-400">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getPaymentIcon(payment.payment_method)}
                    <div>
                      <CardTitle className="text-lg">
                        Order #{payment.order_id}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {payment.customer?.full_name} • {payment.customer?.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">
                      {payment.payment_method.toUpperCase()}
                    </Badge>
                    <div className="text-lg font-bold">
                      ${payment.amount.toFixed(2)} {payment.currency}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Submitted: {formatDate(payment.created_at)}</span>
                    </div>
                    
                    {payment.payment_method === 'paypal' && (
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">PayPal Email:</span>
                          <span className="ml-2 font-mono">{payment.paypal_email}</span>
                        </div>
                        {payment.paypal_transaction_id && (
                          <div className="text-sm">
                            <span className="font-medium">Transaction ID:</span>
                            <span className="ml-2 font-mono text-xs">{payment.paypal_transaction_id}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {payment.payment_method === 'crypto' && (
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">Crypto Type:</span>
                          <span className="ml-2">{payment.crypto_type}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Address:</span>
                          <span className="ml-1 font-mono text-xs break-all">{payment.crypto_address}</span>
                        </div>
                        {payment.crypto_transaction_id && (
                          <div className="text-sm">
                            <span className="font-medium">TX ID:</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono text-xs break-all flex-1">
                                {payment.crypto_transaction_id}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(
                                  getExplorerUrl(payment.crypto_type || '', payment.crypto_transaction_id || ''),
                                  '_blank'
                                )}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleVerifyPayment(payment.id)}
                        disabled={verifying === payment.id || rejecting === payment.id}
                        className="flex-1"
                      >
                        {verifying === payment.id ? (
                          <div className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Verifying...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Verify & Approve
                          </div>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setShowRejectForm(payment.id)}
                        disabled={verifying === payment.id || rejecting === payment.id}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>

                    {showRejectForm === payment.id && (
                      <div className="space-y-2 p-3 border border-red-200 rounded-lg bg-red-50">
                        <Label htmlFor={`rejection-${payment.id}`} className="text-sm font-medium">
                          Rejection Reason:
                        </Label>
                        <Textarea
                          id={`rejection-${payment.id}`}
                          value={rejectionReason[payment.id] || ''}
                          onChange={(e) => setRejectionReason(prev => ({
                            ...prev,
                            [payment.id]: e.target.value
                          }))}
                          placeholder="Please specify the reason for rejection..."
                          className="text-sm"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRejectPayment(payment.id)}
                            disabled={rejecting === payment.id}
                          >
                            {rejecting === payment.id ? (
                              <div className="flex items-center gap-2">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                Rejecting...
                              </div>
                            ) : (
                              'Confirm Rejection'
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowRejectForm(null);
                              setRejectionReason(prev => {
                                const newReasons = { ...prev };
                                delete newReasons[payment.id];
                                return newReasons;
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Verification Checklist:</strong>
                    {payment.payment_method === 'paypal' && (
                      <ul className="mt-1 text-sm list-disc list-inside">
                        <li>Verify PayPal transaction ID and amount</li>
                        <li>Check that sender matches customer details</li>
                        <li>Confirm payment was sent to payments@autotradehub.com</li>
                      </ul>
                    )}
                    {payment.payment_method === 'crypto' && (
                      <ul className="mt-1 text-sm list-disc list-inside">
                        <li>Verify transaction on blockchain explorer</li>
                        <li>Check transaction amount matches order total</li>
                        <li>Confirm transaction is confirmed (not pending)</li>
                        <li>Verify destination address matches our address</li>
                      </ul>
                    )}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={fetchPendingPayments}
          disabled={loading}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default PaymentVerification;
