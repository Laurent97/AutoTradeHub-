import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, ChevronDown, AlertCircle, Car, Wrench, Package, DollarSign, Shield, Users, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function PartnerFAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const faqs = [
    {
      category: 'Getting Started',
      icon: Car,
      items: [
        {
          q: 'What can I sell as an AutoTradeHub Partner?',
          a: 'You can sell:\n- 🚗 Complete Vehicles (new, used, certified pre-owned)\n- 🔩 Car Parts (OEM, aftermarket, performance)\n- 🎀 Accessories (interior, exterior, tech, safety)\n- 🔧 Maintenance Items (fluids, filters, brakes, batteries)'
        },
        {
          q: 'How do I add products to my store?',
          a: 'It\'s completely FREE to add products! Simply:\n1. Browse our wholesale catalog (100,000+ items)\n2. Select products you want to sell\n3. Set your retail price (we recommend 20-30% markup)\n4. Click "Add to My Store" - instantly listed!'
        },
        {
          q: 'What are the minimum requirements to open a store?',
          a: 'New stores must have:\n- ✅ At least 10 products (minimum requirement)\n- ✅ Recommended: 30+ products for better visibility\n- ✅ Mix of categories (vehicles, parts, accessories)\n- ✅ Professional store setup (we help you!)'
        },
        {
          q: 'Is there any cost to start?',
          a: 'Absolutely FREE to start! No upfront fees, no subscription charges for the basic plan. You only pay wholesale costs when items sell.'
        }
      ]
    },
    {
      category: 'Pricing & Payments',
      icon: DollarSign,
      items: [
        {
          q: 'How does pricing work?',
          a: 'Three-tier pricing:\n```\nWholesale Price (You pay to manufacturer): $100\nYour Markup (You add): 30%\nYour Selling Price: $130\nYour Profit: $30 (paid after delivery)\n```'
        },
        {
          q: 'When do I get paid my profit?',
          a: 'Payment timeline:\n1. Customer places order → You pay wholesale to manufacturer\n2. Item ships → 3-7 business days delivery\n3. Customer receives & confirms → 24-hour inspection period\n4. Profit released to you → Within 24 hours of confirmation'
        },
        {
          q: 'What if a customer returns an item?',
          a: 'Risk-free returns:\n- 30-day return policy (manufacturer-backed)\n- Return shipping covered by manufacturer\n- Your wholesale cost refunded in full\n- No profit loss for you'
        },
        {
          q: 'Are there any platform fees?',
          a: 'Simple fee structure:\n- Product listing: FREE (unlimited products)\n- Transaction fee: 5% of your profit only\n- Payment processing: 2.9% + $0.30 (standard Stripe)\n- No hidden fees, no monthly subscriptions for Starter tier'
        }
      ]
    },
    {
      category: 'Inventory & Products',
      icon: Package,
      items: [
        {
          q: 'How many products should I list?',
          a: 'For best results:\n- Minimum: 10 products (required)\n- Good Start: 30-50 products\n- Growing Store: 100-200 products\n- Successful Store: 500+ products'
        },
        {
          q: 'Where do products come from?',
          a: 'Direct from manufacturers and distributors:\n- Vehicle manufacturers (50+ brands)\n- Parts suppliers (OEM and aftermarket)\n- Accessory makers (premium brands)\n- All inventory dropshipped directly to customers'
        },
        {
          q: 'Do I need to store inventory?',
          a: 'NO inventory needed! All items are:\n- Manufacturer-direct shipping\n- No storage costs for you\n- No handling or packaging\n- Quality controlled by suppliers'
        },
        {
          q: 'Can I sell my own products too?',
          a: 'Yes! Mix and match:\n- Manufacturer products (no upfront cost)\n- Your own inventory (if you have storage)\n- Special order items (custom requests)\n- Local pickup items (for your area)'
        }
      ]
    },
    {
      category: 'Shipping & Delivery',
      icon: Wrench,
      items: [
        {
          q: 'How long does shipping take?',
          a: 'Standard delivery times:\n- Vehicles: 5-10 business days (professional transport)\n- Parts/Accessories: 3-7 business days\n- Express options: Available at checkout\n- Tracking provided for all shipments'
        },
        {
          q: 'Who handles shipping?',
          a: 'Manufacturers handle everything:\n- Professional packaging\n- Carrier coordination (FedEx, UPS, specialized auto transport)\n- Insurance included\n- Tracking updates sent to customer'
        },
        {
          q: 'What about international shipping?',
          a: 'Available for:\n- USA & Canada: Standard 3-7 days\n- Europe: 7-14 business days\n- Restrictions: Some items can\'t ship internationally\n- Costs: Calculated at checkout'
        },
        {
          q: 'What if there\'s shipping damage?',
          a: 'Manufacturer guarantees:\n- Insurance coverage on all shipments\n- Replacement shipped immediately\n- No cost to you or customer\n- Claim handled by manufacturer'
        }
      ]
    },
    {
      category: 'Sales & Customer Service',
      icon: Users,
      items: [
        {
          q: 'How do customers find my store?',
          a: 'Multi-channel visibility:\n- AutoTradeHub Marketplace (main traffic source)\n- Your unique store URL (yourshop.autotradehub.com)\n- SEO optimized for Google search\n- Social media integration\n- Email marketing tools (included)'
        },
        {
          q: 'What support do I provide to customers?',
          a: 'You handle customer communication:\n- Product questions\n- Order status updates\n- Basic support queries\n- Manufacturer handles: technical issues, returns, warranties'
        },
        {
          q: 'Can I set my own prices?',
          a: 'Complete pricing freedom:\n- Minimum price: Wholesale cost\n- Recommended: 20-30% markup\n- Maximum: No limit (market determines)\n- Sale pricing: Run promotions anytime'
        },
        {
          q: 'What tools help me sell more?',
          a: 'Included free tools:\n- Sales analytics dashboard\n- Customer relationship manager\n- Email marketing automation\n- Social media scheduler\n- Inventory performance reports'
        }
      ]
    },
    {
      category: 'Risk & Protection',
      icon: Shield,
      items: [
        {
          q: 'What\'s my financial risk?',
          a: 'Almost zero risk:\n- No inventory investment\n- No monthly fees (Starter tier)\n- Pay wholesale only after sale\n- Returns covered by manufacturer\n- Fraud protection on all transactions'
        },
        {
          q: 'What if I don\'t make sales?',
          a: 'No-pressure environment:\n- No sales quotas\n- No minimum requirements\n- First 3 months free on Growth tier\n- Free coaching to improve sales'
        },
        {
          q: 'How are payments protected?',
          a: 'Secure payment system:\n- Stripe-powered payments\n- Escrow protection until delivery\n- Buyer/seller verification\n- Fraud monitoring 24/7'
        }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: TrendingUp },
    ...faqs.map(section => ({ id: section.category, name: section.category, icon: section.icon }))
  ];

  const filteredFAQs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(section => section.category === activeCategory);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Header */}
        <div className="bg-gradient-accent rounded-b-2xl text-white pt-12 pb-8 px-4">
          <div className="container-wide max-w-6xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">AutoTradeHub Partner FAQ 🤔</h1>
            <p className="text-white/90 text-lg">Frequently Asked Questions About Our Partner Program</p>
          </div>
        </div>

        <div className="container-wide max-w-6xl mx-auto py-12 px-4">
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                      activeCategory === category.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-muted-foreground hover:bg-muted border border-border'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ Items */}
          {filteredFAQs.map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <section.icon className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{section.category}</h2>
              </div>
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
                        <div className="px-6 py-4 bg-muted/50 border-t border-border">
                          <div className="text-muted-foreground whitespace-pre-line">
                            {faq.a}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Answers Section */}
          <div className="bg-card rounded-lg shadow-md p-8 border border-border mb-8">
            <h3 className="text-2xl font-bold mb-6">❓ Quick Answers</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Do I need a business license?</p>
                    <p className="text-sm text-muted-foreground">Not required to start, recommended as you grow.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Can I sell internationally?</p>
                    <p className="text-sm text-muted-foreground">Yes, to supported countries.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">What\'s the best product mix?</p>
                    <p className="text-sm text-muted-foreground">50% parts, 30% accessories, 20% vehicles.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">How do I handle customer returns?</p>
                    <p className="text-sm text-muted-foreground">Direct to manufacturer, we provide RMA process.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Can I use my own domain?</p>
                    <p className="text-sm text-muted-foreground">Yes, with Growth+ tiers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Are there sales quotas?</p>
                    <p className="text-sm text-muted-foreground">No, sell at your own pace.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-accent rounded-lg text-white p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">📞 Need Immediate Help?</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-semibold mb-1">Partner Support Email</p>
                <p className="text-white/90">partner-support@autodrive-global.com</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Technical Issues</p>
                <p className="text-white/90">support@autotradehub.com</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Live Chat</p>
                <p className="text-white/90">Available in your dashboard</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Community</p>
                <p className="text-white/90">community.autotradehub.com</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/partner/apply" 
                className="inline-block bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                Apply Today
              </Link>
              <Link 
                to="/contact" 
                className="inline-block bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
