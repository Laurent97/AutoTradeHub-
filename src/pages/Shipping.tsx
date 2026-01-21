import { Link, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Truck, Clock, MapPin, Package, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Shipping() {
  const location = useLocation();
  const orderNumber = new URLSearchParams(location.search).get('order');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Header */}
        <div className="bg-gradient-accent rounded-b-2xl text-white pt-12 pb-8 px-4">
          <div className="container-wide max-w-4xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Shipping Information</h1>
            <p className="text-white/90">Track your order and learn about our shipping process</p>
          </div>
        </div>

        <div className="container-wide max-w-4xl mx-auto py-12 px-4">
          {/* Search Order */}
          {!orderNumber && (
            <div className="bg-card rounded-lg shadow-md p-8 mb-12 border border-border">
              <h2 className="text-2xl font-bold mb-4">Track Your Order</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter your order number..."
                  className="flex-1 px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
                <Button className="bg-primary hover:bg-primary/90">
                  Track Order
                </Button>
              </div>
            </div>
          )}

          {/* Shipping Methods */}
          <div className="bg-card rounded-lg shadow-md p-8 mb-8 border border-border">
            <h2 className="text-2xl font-bold mb-6">Shipping Methods & Rates</h2>
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
                  <div key={idx} className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{method.name}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{method.description}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-sm text-muted-foreground">{method.time}</span>
                          <span className="font-bold text-primary">{method.cost}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Partners */}
          <div className="bg-card rounded-lg shadow-md p-8 mb-8 border border-border">
            <h2 className="text-2xl font-bold mb-6">Trusted Shipping Partners</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['DHL', 'FedEx', 'UPS', 'USPS', 'TNT', 'EMS', 'DPD', 'Courier'].map((carrier, idx) => (
                <div key={idx} className="border border-border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                  <div className="font-semibold text-foreground">{carrier}</div>
                  <p className="text-xs text-muted-foreground mt-1">International Shipping</p>
                </div>
              ))}
            </div>
          </div>

          {/* Policies & Info */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Shipping Policies */}
            <div className="bg-card rounded-lg shadow-md p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Shipping Policies</h3>
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
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{policy}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety & Security */}
            <div className="bg-card rounded-lg shadow-md p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Safety & Security</h3>
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
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-card rounded-lg shadow-md p-8 mt-8 border border-border">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
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
                <div key={idx} className="border-b border-border pb-4 last:border-0">
                  <h4 className="font-semibold text-foreground mb-2">{faq.q}</h4>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-accent rounded-lg text-white p-8 mt-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Need Help With Your Shipment?</h3>
            <p className="mb-6 max-w-2xl mx-auto">
              Our customer support team is available 24/7 to assist with any shipping questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="text-white border-white hover:bg-white/10">
                Contact Support
              </Button>
              <Link to="/">
                <Button className="bg-white text-primary hover:bg-white/90 w-full">
                  Back to Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
