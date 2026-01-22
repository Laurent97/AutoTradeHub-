import React, { useState } from 'react';
import { MoreHorizontal, Package, Users, FileText, Phone, Mail, AlertTriangle, X, CheckCircle, Clock, Truck, CreditCard, Download } from 'lucide-react';

interface OrderActionsDropdownProps {
  order: any;
  walletBalance: number;
  onProcessOrder: (order: any) => void;
  onViewCustomerInfo: (order: any) => void;
  onTrackOrder: (order: any) => void;
  onViewOrderDetails: (order: any) => void;
  onDownloadInvoice: (order: any) => void;
  onContactCustomer: (order: any) => void;
  onCancelOrder: (order: any) => void;
}

export default function OrderActionsDropdown({ 
  order, 
  walletBalance, 
  onProcessOrder, 
  onViewCustomerInfo, 
  onTrackOrder, 
  onViewOrderDetails, 
  onDownloadInvoice, 
  onContactCustomer, 
  onCancelOrder 
}: OrderActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const canProcessOrder = order.status === 'pending' && walletBalance >= order.total_amount;
  const canCancelOrder = ['pending', 'processing'].includes(order.status);
  const canTrackOrder = ['processing', 'waiting_shipment', 'shipped'].includes(order.status);

  const handleAction = (action: string) => {
    setIsOpen(false);
    
    switch (action) {
      case 'process':
        onProcessOrder(order);
        break;
      case 'customer':
        onViewCustomerInfo(order);
        break;
      case 'track':
        if (canTrackOrder) {
          onTrackOrder(order);
        }
        break;
      case 'details':
        onViewOrderDetails(order);
        break;
      case 'invoice':
        onDownloadInvoice(order);
        break;
      case 'contact':
        onContactCustomer(order);
        break;
      case 'cancel':
        if (canCancelOrder) {
          onCancelOrder(order);
        }
        break;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Order Actions"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div 
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="py-1">
              {/* Process Order */}
              <button
                onClick={() => handleAction('process')}
                disabled={!canProcessOrder}
                className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  !canProcessOrder ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                title={canProcessOrder ? 'Process order payment' : 'Cannot process this order'}
              >
                <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className={canProcessOrder ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}>
                  Process Order
                </span>
                {!canProcessOrder && (
                  <span className="text-xs text-gray-500 ml-auto">
                    {walletBalance < order.total_amount ? 'Insufficient balance' : 'Already processed'}
                  </span>
                )}
              </button>

              {/* View Customer Info */}
              <button
                onClick={() => handleAction('customer')}
                className="w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                title="View customer information and order history"
              >
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-700 dark:text-gray-300">View Customer Info</span>
              </button>

              {/* Track Order */}
              <button
                onClick={() => handleAction('track')}
                disabled={!canTrackOrder}
                className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  !canTrackOrder ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                title={canTrackOrder ? 'Track order status' : 'Cannot track this order'}
              >
                <Truck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className={canTrackOrder ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}>
                  Track Order
                </span>
                {!canTrackOrder && (
                  <span className="text-xs text-gray-500 ml-auto">
                    Order not trackable
                  </span>
                )}
              </button>

              {/* View Order Details */}
              <button
                onClick={() => handleAction('details')}
                className="w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                title="View detailed order information"
              >
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-gray-700 dark:text-gray-300">View Order Details</span>
              </button>

              {/* Download Invoice */}
              <button
                onClick={() => handleAction('invoice')}
                className="w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                title="Download order invoice"
              >
                <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Download Invoice</span>
              </button>

              {/* Contact Customer */}
              <button
                onClick={() => handleAction('contact')}
                className="w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                title="Contact customer via email"
              >
                <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Contact Customer</span>
              </button>

              {/* Cancel Order */}
              <button
                onClick={() => handleAction('cancel')}
                disabled={!canCancelOrder}
                className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${
                  !canCancelOrder ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                title={canCancelOrder ? 'Cancel this order' : 'Cannot cancel this order'}
              >
                <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className={canCancelOrder ? 'text-red-700 dark:text-red-300' : 'text-gray-400'}>
                  Cancel Order
                </span>
                {!canCancelOrder && (
                  <span className="text-xs text-gray-500 ml-auto">
                    Order cannot be cancelled
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
}
