import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, Clock, Package, User, FileText } from 'lucide-react';

interface CustomerInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export default function CustomerInfoModal({ isOpen, onClose, order }: CustomerInfoModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Customer Information
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Customer Details */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {order.user?.full_name || 'Unknown Customer'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.user?.email || 'No email available'}
              </p>
              {order.user?.phone && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  {order.user.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shipping_address && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              Shipping Address
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Recipient:</span> {order.shipping_address.recipient_name}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Address:</span> {order.shipping_address.street_address}
                </p>
                {order.shipping_address.city && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">City:</span> {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                  </p>
                )}
                {order.shipping_address.country && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Country:</span> {order.shipping_address.country}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Billing Address */}
        {order.billing_address && order.billing_address.street_address && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Package className="w-5 h-5 text-gray-500" />
              Billing Address
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Recipient:</span> {order.billing_address.recipient_name}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Address:</span> {order.billing_address.street_address}
                </p>
                {order.billing_address.city && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">City:</span> {order.billing_address.city}, {order.billing_address.state} {order.billing_address.postal_code}
                  </p>
                )}
                {order.billing_address.country && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Country:</span> {order.billing_address.country}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Order History */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-500" />
            Order History
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Showing recent orders from this customer with your store</p>
          </div>
          <div className="mt-4 space-y-3">
            {/* Sample order history items */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Order #ORD-20240122-1234
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    January 15, 2024
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                    Completed
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Order #ORD-20240110-5678
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    January 10, 2024
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                    Shipped
                  </span>
                </div>
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
