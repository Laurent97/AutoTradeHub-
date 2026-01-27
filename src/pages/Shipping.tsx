import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Truck, Clock, MapPin, Package, Shield, AlertCircle } from 'lucide-react';

export default function Shipping() {
  const location = useLocation();
  const orderNumber = new URLSearchParams(location.search).get('order');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white rounded-b-2xl pt-12 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Shipping Information</h1>
          <p className="text-blue-100 dark:text-blue-200">Track your order and learn about our shipping process</p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl py-12 px-4">
          {/* Search Order */}
          {!orderNumber && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-12 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Track Your Order</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter your order number..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Track Order
                </button>
              </div>
            </div>
          )}

          {/* Shipping Methods */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Shipping Methods & Rates</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  name: 'Standard Shipping',
                  time: '5-10 business days',
                  cost: 'FREE',
                  description: 'Reliable and economical',
                  icon: Truck,
                },
                {
                  name: 'Express Shipping',
                  time: '2-3 business days',
                  cost: '$29.99',
                  description: 'Fast delivery to your door',
                  icon: Clock,
                },
                {
                  name: 'Overnight Shipping',
                  time: '1 business day',
                  cost: '$59.99',
                  description: 'Fastest available option',
                  icon: AlertCircle,
                },
                {
                  name: 'Local Pickup',
                  time: '1-2 business days',
                  cost: 'FREE',
                  description: 'Pick up at nearest location',
                  icon: MapPin,
                },
              ].map((method, idx) => {
                const Icon = method.icon;
                return (
                  <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">{method.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{method.description}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{method.time}</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">{method.cost}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Partners */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Trusted Shipping Partners</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['DHL', 'FedEx', 'UPS', 'USPS', 'TNT', 'EMS', 'DPD', 'Courier'].map((carrier, idx) => (
                <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                  <div className="font-semibold text-gray-900 dark:text-white">{carrier}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">International Shipping</p>
                </div>
              ))}
            </div>
          </div>

          {/* Policies & Info */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Shipping Policies */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Shipping Policies</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Free shipping on orders over $100',
                  'All packages are fully insured',
                  'Real-time tracking provided',
                  'Estimated delivery times are accurate',
                  'Signature required for high-value items',
                  'Special handling for fragile items',
                ].map((policy, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{policy}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety & Security */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Safety & Security</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'All shipments tracked 24/7',
                  'Professional packaging standards',
                  'Weather-protected delivery',
                  'Damage protection guarantee',
                  'Lost package replacement',
                  'Secure delivery confirmation',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mt-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'How long does shipping take?',
                  a: 'Standard shipping takes 5-10 business days. Express and overnight options are available for faster delivery.',
                },
                {
                  q: 'Can I track my order?',
                  a: 'Yes! You will receive a tracking number via email and can track your package in real-time.',
                },
                {
                  q: 'Is my package insured?',
                  a: 'All packages are fully insured against damage and loss. Your order is protected throughout the entire journey.',
                },
                {
                  q: 'What if my package is delayed?',
                  a: 'We guarantee on-time delivery. If delayed, you may receive a full refund of shipping costs.',
                },
                {
                  q: 'Do you ship internationally?',
                  a: 'Yes, we ship to over 150 countries worldwide with various shipping methods available.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.q}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white p-8 mt-8 text-center rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Need Help With Your Shipment?</h3>
            <p className="mb-6 max-w-2xl mx-auto text-blue-100 dark:text-blue-200">
              Our customer support team is available 24/7 to assist with any shipping questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Contact Support
              </button>
              <Link to="/">
                <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors w-full">
                  Back to Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
    </div>
  );
}
