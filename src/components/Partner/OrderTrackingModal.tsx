import React, { useState } from 'react';
import { X, Truck, MapPin, Calendar, Clock, CheckCircle, AlertCircle, Package, DollarSign } from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

interface TrackingCheckpoint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  date?: string;
  icon: React.ReactNode;
}

export default function OrderTrackingModal({ isOpen, onClose, order }: OrderModalProps) {
  if (!isOpen || !order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const trackingCheckpoints: TrackingCheckpoint[] = [
    {
      id: '1',
      title: 'Order Placed',
      description: 'Customer has placed the order successfully',
      status: 'completed',
      date: order.created_at,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />
    },
    {
      id: '2',
      title: 'Order Confirmed',
      description: 'Order has been confirmed and is being prepared',
      status: order.processing_date ? 'completed' : 'pending',
      date: order.processing_date,
      icon: <CheckCircle className="w-5 h-5 text-blue-600" />
    },
    {
      id: '3',
      title: 'Processing Started',
      description: 'Your order is being processed and prepared',
      status: order.waiting_shipment_date ? 'completed' : 'in_progress',
      date: order.processing_date,
      icon: <Clock className="w-5 h-5 text-purple-600" />
    },
    {
      id: '4',
      title: 'Ready for Shipment',
      description: 'Order is packaged and ready to be shipped',
      status: order.waiting_shipment_date ? 'completed' : 'pending',
      date: order.waiting_shipment_date,
      icon: <Package className="w-5 h-5 text-indigo-600" />
    },
    {
      id: '5',
      title: 'Order Shipped',
      description: 'Order has been shipped and is on its way to you',
      status: order.shipped_at ? 'completed' : 'pending',
      date: order.shipped_at,
      icon: <Truck className="w-5 h-5 text-teal-600" />
    },
    {
      order_id: '6',
      title: 'Out for Delivery',
      description: 'Order is out for delivery',
      status: order.delivered_at ? 'completed' : 'pending',
      date: order.delivered_at,
      icon: <Truck className="w-5 h-5 text-orange-600" />
    },
    {
      id: '7',
      title: 'Delivered',
      description: 'Order has been successfully delivered',
      status: order.delivered_at ? 'completed' : 'pending',
      date: order.delivered_at,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
      case 'in_progress': return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Track Order
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Order Info */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Order #{order.order_number || order.id?.slice(0, 8)}
            </h3>
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

        {/* Tracking Timeline */}
        <div className="p-6">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
            
            {/* Timeline Points */}
            <div className="space-y-6">
              {trackingCheckpoints.map((checkpoint, index) => (
                <div key={checkpoint.id} className="flex items-start space-x-4">
                  {/* Timeline Point */}
                  <div className={`relative flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    checkpoint.status === 'completed' ? 'bg-green-500' :
                    checkpoint.status === 'in_progress' ? 'bg-blue-500' :
                    'bg-gray-400'
                  }`}>
                    {checkpoint.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {checkpoint.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {checkpoint.description}
                      </p>
                      {checkpoint.date && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateTime(checkpoint.date)}
                        </p>
                      )}
                      {checkpoint.status === 'in_progress' && (
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="h-full bg-blue-500 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        {order.shipped_at && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Truck className="w-5 h-5 text-gray-500" />
              Shipping Information
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Carrier:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {order.carrier || 'Standard Shipping'}
                  </span>
                </div>
                {order.tracking_number && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tracking Number:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {order.tracking_number}
                  </span>
                </div>
                )}
                {order.estimated_delivery && (
                  <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Estimated Delivery:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(order.estimated_delivery)}
                  </span>
                </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipped Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(order.shipped_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

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
