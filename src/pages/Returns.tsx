import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, RotateCcw, Clock, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Returns() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Returns & Refunds</h1>
            <p className="text-white/90">Our hassle-free return policy</p>
          </div>
        </div>

        <div className="container-wide max-w-4xl mx-auto py-12 px-4 space-y-12">
          {/* Quick Facts */}
          <div className="bg-card rounded-lg shadow-md p-8 border border-border">
            <h2 className="text-2xl font-bold mb-6">Quick Facts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Clock, title: '30-Day Return', desc: 'Return within 30 days' },
                { icon: RotateCcw, title: 'Full Refund', desc: 'Money back guarantee' },
                { icon: CheckCircle, title: 'Easy Process', desc: 'Simple return process' }
              ].map((fact, idx) => {
                const Icon = fact.icon;
                return (
                  <div key={idx} className="text-center">
                    <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold mb-1">{fact.title}</h3>
                    <p className="text-sm text-muted-foreground">{fact.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Return Policy */}
          <div className="bg-card rounded-lg shadow-md p-8 border border-border">
            <h2 className="text-2xl font-bold mb-6">Return Policy</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Eligible Items</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Most items purchased within 30 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Must be unused, undamaged, and in original packaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>All accessories and documentation included</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">Non-Returnable Items</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Custom-ordered vehicles or parts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Items used or installed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Items without original packaging</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How to Return */}
          <div className="bg-card rounded-lg shadow-md p-8 border border-border">
            <h2 className="text-2xl font-bold mb-6">How to Return an Item</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Request Return', desc: 'Contact us or go to your orders and select "Return Item"' },
                { step: 2, title: 'Get Return Label', desc: 'We\'ll email you a prepaid return shipping label' },
                { step: 3, title: 'Ship It Back', desc: 'Pack the item securely and ship it using the provided label' },
                { step: 4, title: 'Receive Refund', desc: 'Once received and inspected, we\'ll process your refund (5-7 business days)' }
              ].map((item) => (
                <div key={item.step} className="flex gap-4 pb-4 border-b border-border last:border-0">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Refunds */}
          <div className="bg-card rounded-lg shadow-md p-8 border border-border">
            <h2 className="text-2xl font-bold mb-6">Refunds</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <span className="font-bold text-foreground">Refund Timeline:</span> Once your return is received and inspected, we'll process your refund within 5-7 business days. Refunds are issued to your original payment method.
              </p>
              <p>
                <span className="font-bold text-foreground">Return Shipping:</span> We provide free return shipping with a prepaid label for eligible returns. Original shipping fees are non-refundable unless the item was defective.
              </p>
              <p>
                <span className="font-bold text-foreground">Partial Returns:</span> For multi-item orders, you can return individual items if they're returned within 30 days and meet all requirements.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-card rounded-lg shadow-md p-8 border border-border">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What if the item arrived damaged?',
                  a: 'Contact us immediately with photos. We\'ll send a replacement or process a refund right away.'
                },
                {
                  q: 'Can I return an item after 30 days?',
                  a: 'Contact our support team. We may be able to help depending on the circumstances.'
                },
                {
                  q: 'Do I have to pay return shipping?',
                  a: 'No, we provide a prepaid shipping label for all eligible returns.'
                },
                {
                  q: 'How long does a refund take?',
                  a: 'After receiving your return, we inspect it and process refunds within 5-7 business days.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="border-b border-border pb-4 last:border-0">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary" />
                    {faq.q}
                  </h4>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Support CTA */}
          <div className="bg-gradient-accent rounded-lg text-white p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Need More Help?</h3>
            <p className="mb-6">Our support team is available 24/7 to assist with returns and refunds.</p>
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
