import React from 'react';
import { X, Package, Truck, Clock, Calendar, DollarSign, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export default function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Order Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order #{order.order_number || order.id?.slice(0, 8)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(order.created_at)}
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'completed' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' :
                order.status === 'shipped' ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300' :
                order.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' :
                order.status === 'waiting_shipment' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300' :
                order.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' :
                order.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' :
                'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {order.payment_status === 'paid' ? (
                  <span className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Paid
                  </span>
                ) : (
                  <span className="flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    Pending
                  </span>
                )}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {order.payment_method || 'Wallet'}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Order Date:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatDate(order.created_at)}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Estimated Delivery:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {order.estimated_delivery ? formatDate(order.estimated_delivery) : 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Package className="w-5 h-5 text-gray-500" />
            Order Items ({order.order_line_items?.length || 0})
          </h3>
          <div className="space-y-3">
            {order.order_line_items?.map((item: any, index: number) => (
              <div key={item.line_item_id || index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.product_snapshot?.name || 'Product'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      SKU: {item.product_snapshot?.sku || 'N/A'}
                    </p>
                    {item.product_snapshot?.make && item.product_snapshot?.model && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.product_snapshot.make} {item.product_snapshot.model}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(item.unit_price)} x {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'active' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            )) || (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No order items found
              </p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-gray-500" />
            Order Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Shipping Cost:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(order.shipping_cost || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total:</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-gray-500" />
            Payment Information
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {order.payment_status === 'paid' ? (
                  <span className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Paid
                  </span>
                ) : (
                  <span className="flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    Pending
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {order.payment_method || 'Wallet'}
              </span>
            </div>
            {order.processing_date && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Processed:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatDate(order.processing_date)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-500" />
            Order Timeline
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Order Created
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>
            {order.processing_date && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-3 h-3 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Processing Started
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatDate(order.processing_date)}
                  </p>
                </div>
              </div>
            )}
            {order.waiting_shipment_date && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-3 h-3 bg-indigo-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Waiting Shipment
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatDate(order.waiting_shipment_date)}
                  </p>
                </div>
              </div>
            )}
            {order.shipped_at && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-3 h-3 bg-teal-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Order Shipped
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatDate(order.shipped_at)}
                  </p>
                </div>
              </div>
            )}
            {order.completed_date && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Order Completed
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatDate(order.completed_date)}
                  </p>
                </div>
              </div>
            )}
            {order.cancelled_date && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Order Cancelled
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatDate(order.cancelled_date)}
                  </p>
                  {order.cancellation_reason && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Reason: {order.cancellation_reason}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
