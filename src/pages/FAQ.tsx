import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, ChevronDown, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: 'General',
      items: [
        {
          q: 'What is AutoVault?',
          a: 'AutoVault is a global automotive marketplace connecting buyers and sellers. We offer vehicles, parts, and accessories from trusted sellers worldwide.'
        },
        {
          q: 'Is AutoVault safe to use?',
          a: 'Yes, we use advanced security measures including SSL encryption, secure payment processing, and buyer/seller protection policies.'
        },
        {
          q: 'Do I need an account to browse?',
          a: 'No, you can browse products without an account. However, creating an account is required to make purchases.'
        }
      ]
    },
    {
      category: 'Buying',
      items: [
        {
          q: 'How do I make a purchase?',
          a: 'Browse products, add to cart, and proceed to checkout. Enter shipping and payment information to complete your order.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept credit/debit cards, PayPal, cryptocurrency (Bitcoin, Ethereum), and bank transfers.'
        },
        {
          q: 'Can I make an offer on items?',
          a: 'Yes, many sellers accept offers. Click the "Make Offer" button on product pages to submit your offer.'
        },
        {
          q: 'What if I receive a damaged item?',
          a: 'Contact us immediately with photos. We\'ll either send a replacement or process a full refund.'
        }
      ]
    },
    {
      category: 'Shipping & Delivery',
      items: [
        {
          q: 'How much does shipping cost?',
          a: 'Shipping costs vary by item and location. Most orders qualify for free shipping over $100. See the product page for exact costs.'
        },
        {
          q: 'How long does delivery take?',
          a: 'Standard shipping takes 5-10 business days. Express (2-3 days) and overnight options are available.'
        },
        {
          q: 'Do you ship internationally?',
          a: 'Yes, we ship to over 150 countries. International shipping costs and times vary by destination.'
        },
        {
          q: 'Can I track my order?',
          a: 'Yes, all orders include tracking. You\'ll receive a tracking number in your confirmation email.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      items: [
        {
          q: 'What is your return policy?',
          a: 'Most items can be returned within 30 days of purchase if unused and in original packaging. Custom orders are non-returnable.'
        },
        {
          q: 'How long does a refund take?',
          a: 'After receiving your return, we inspect it and process refunds within 5-7 business days.'
        },
        {
          q: 'Do I pay for return shipping?',
          a: 'No, we provide a prepaid return shipping label for all eligible returns.'
        }
      ]
    },
    {
      category: 'Selling',
      items: [
        {
          q: 'How can I become a seller?',
          a: 'Click "Become a Partner" and complete our seller registration. We verify your information before activation.'
        },
        {
          q: 'What fees do sellers pay?',
          a: 'Sellers pay a 5-10% commission on successful sales, depending on category and listing type.'
        },
        {
          q: 'How do I list a product?',
          a: 'Log in to your seller account, click "Add Product", fill in details (name, price, photos, etc.), and publish.'
        },
        {
          q: 'How do I handle customer orders?',
          a: 'Orders appear in your dashboard. Pack, ship, and provide tracking information. Communicate with buyers through our messaging system.'
        }
      ]
    },
    {
      category: 'Account & Security',
      items: [
        {
          q: 'How do I reset my password?',
          a: 'Click "Forgot Password" on the login page, enter your email, and follow the reset instructions.'
        },
        {
          q: 'How is my data protected?',
          a: 'We use 256-bit SSL encryption and comply with international data protection regulations (GDPR, CCPA).'
        },
        {
          q: 'Can I delete my account?',
          a: 'Yes, go to Account Settings and click "Delete Account". This action is permanent.'
        },
        {
          q: 'How do I enable two-factor authentication?',
          a: 'Go to Security Settings and enable 2FA. You\'ll receive codes via email or SMS for login.'
        }
      ]
    }
  ];

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
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Frequently Asked Questions</h1>
            <p className="text-white/90">Find answers to common questions</p>
          </div>
        </div>

        <div className="container-wide max-w-4xl mx-auto py-12 px-4">
          {faqs.map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{section.category}</h2>
              <div className="space-y-3">
                {section.items.map((faq, itemIdx) => {
                  const globalIdx = `${sectionIdx}-${itemIdx}`;
                  const isOpen = openIndex === globalIdx;
                  
                  return (
                    <div
                      key={globalIdx}
                      className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                      >
                        <span className="font-semibold text-foreground">{faq.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-primary transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 py-4 bg-muted/50 border-t border-border text-muted-foreground">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Still Have Questions */}
          <div className="bg-card rounded-lg shadow-md p-8 border border-border">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
                <p className="text-muted-foreground mb-4">
                  Can't find the answer you're looking for? Please contact our support team.
                </p>
                <Link to="/contact" className="text-primary font-semibold hover:underline">
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
