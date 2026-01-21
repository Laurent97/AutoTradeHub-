import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Search, MapPin, Zap, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [tracked, setTracked] = useState(false);

  const handleTrack = () => {
    if (orderNumber.trim()) {
      setTracked(true);
    }
  };

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
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Track Your Order</h1>
            <p className="text-white/90">Real-time delivery updates</p>
          </div>
        </div>

        <div className="container-wide max-w-4xl mx-auto py-12 px-4">
          {/* Search */}
          <div className="bg-card rounded-lg shadow-md p-8 border border-border mb-12">
            <h2 className="text-2xl font-bold mb-6">Find Your Order</h2>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter order number (e.g., ORD-123456)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-background"
                  onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                />
              </div>
              <Button 
                onClick={handleTrack}
                className="bg-primary hover:bg-primary/90"
              >
                Track
              </Button>
            </div>
          </div>

          {/* Sample Tracking */}
          {tracked && (
            <div className="bg-card rounded-lg shadow-md p-8 border border-border mb-12">
              <h2 className="text-2xl font-bold mb-8">Order #{orderNumber}</h2>
              
              {/* Timeline */}
              <div className="space-y-6">
                {[
                  { status: 'Order Confirmed', time: '2 hours ago', icon: CheckCircle, completed: true },
                  { status: 'Processing', time: '1 hour ago', icon: Zap, completed: true },
                  { status: 'Shipped', time: 'In Progress', icon: ArrowLeft, completed: true },
                  { status: 'Out for Delivery', time: 'Tomorrow', icon: MapPin, completed: false },
                  { status: 'Delivered', time: 'Expected', icon: CheckCircle, completed: false }
                ].map((update, idx) => {
                  const Icon = update.icon;
                  return (
                    <div key={idx} className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          update.completed ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        {idx < 4 && (
                          <div className={`w-0.5 h-16 ${
                            update.completed ? 'bg-success' : 'bg-border'
                          }`} />
                        )}
                      </div>
                      <div className="pb-6">
                        <h4 className={`font-bold text-lg ${
                          update.completed ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {update.status}
                        </h4>
                        <p className="text-muted-foreground text-sm">{update.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tracking Details */}
              <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-bold mb-4">Tracking Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                    <p className="font-mono text-foreground">1Z999AA10123456784</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Carrier</p>
                    <p className="font-semibold text-foreground">FedEx</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                    <p className="font-semibold text-foreground">Tomorrow, 6:00 PM</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Location</p>
                    <p className="font-semibold text-foreground">Distribution Center, CA</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="bg-card rounded-lg shadow-md p-8 border border-border">
            <h2 className="text-2xl font-bold mb-6">Tracking Help</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">Where can I find my order number?</h3>
                <p className="text-muted-foreground">
                  Your order number is in your confirmation email. It starts with "ORD-" and can also be found in your account under "My Orders".
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Why can't I find my order?</h3>
                <p className="text-muted-foreground">
                  It may take up to 24 hours for your order to appear in our tracking system. Please check your email for the order number.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">How often is tracking updated?</h3>
                <p className="text-muted-foreground">
                  Tracking information updates in real-time as your package moves through our system and with the carrier.
                </p>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-gradient-accent rounded-lg text-white p-8 mt-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Need Tracking Help?</h3>
            <p className="mb-6">Can't find your order? Our support team can help locate it.</p>
            <Link to="/contact">
              <Button className="bg-white text-primary hover:bg-white/90">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
