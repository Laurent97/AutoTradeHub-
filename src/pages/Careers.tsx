import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Car, DollarSign, Users, TrendingUp, Shield, Clock, Award, Target, Zap, CheckCircle, Star, ArrowRight, Wrench, Package } from 'lucide-react';

export default function Careers() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-2">AutoTradeHub Partner Program 🚗💰</h1>
            <p className="text-white/90 text-lg">Build Your Automotive Empire - Risk Free!</p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="container-wide max-w-6xl mx-auto py-12 px-4">
          <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">The Revolutionary Business Model That's Changing Automotive Sales</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Start your own automotive business with ZERO inventory investment, ZERO storage costs, and ZERO upfront fees!
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Car className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold">Complete Vehicles</h3>
                <p className="text-sm text-muted-foreground">20-30% margin</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Wrench className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold">Car Parts</h3>
                <p className="text-sm text-muted-foreground">30-50% margin</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Package className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold">Accessories</h3>
                <p className="text-sm text-muted-foreground">40-60% margin</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold">Maintenance</h3>
                <p className="text-sm text-muted-foreground">25-35% margin</p>
              </div>
            </div>

            <div className="text-center">
              <Link 
                to="/partner/apply" 
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Apply Now - Start Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="container-wide max-w-6xl mx-auto py-12 px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">🎯 How It Works in 3 Simple Steps</h2>
            <p className="text-xl text-muted-foreground">Start earning profit in days, not months</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Select Products (FREE!)</h3>
              <p className="text-muted-foreground mb-4">
                Browse our catalog of 100,000+ automotive products from 200+ manufacturers. Simply click "Add to My Store" - no cost to list!
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Minimum: 10 products to launch</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Recommended: 30+ products for visibility</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Successful: 100+ products consistently</span>
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Set Your Prices</h3>
              <p className="text-muted-foreground mb-4">
                Add your profit margin (we recommend 20-30%):
              </p>
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <div className="font-mono text-sm">
                  <p>Example: Brake Pad Set</p>
                  <p>Wholesale Cost: $80</p>
                  <p>Your Markup (30%): +$24</p>
                  <p className="font-bold text-primary">Your Selling Price: $104</p>
                  <p className="font-bold text-green-600">Your Profit: $24</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete pricing freedom - set any margin above wholesale cost!
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Sell & Earn</h3>
              <p className="text-muted-foreground mb-4">
                Customer buys → You pay wholesale → Manufacturer ships → Customer receives → You get profit!
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span><strong>Order Day:</strong> Customer purchases, you pay wholesale</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span><strong>Day 1-2:</strong> Manufacturer processes and ships</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span><strong>Day 3-7:</strong> Product delivered to customer</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span><strong>Day 8:</strong> Your profit deposited (24hrs after delivery)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Earning Potential */}
        <div className="container-wide max-w-6xl mx-auto py-12 px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">💰 Earning Potential Breakdown</h2>
            <p className="text-xl text-muted-foreground">Real income scenarios from successful partners</p>
          </div>

          <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4">Store Size</th>
                    <th className="text-left p-4">Products Listed</th>
                    <th className="text-left p-4">Avg. Monthly Sales</th>
                    <th className="text-left p-4">Avg. Monthly Profit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-4 font-semibold">Starter Store</td>
                    <td className="p-4">30 products</td>
                    <td className="p-4">15 sales</td>
                    <td className="p-4 font-bold text-green-600">$1,500 - $3,000</td>
                  </tr>
                  <tr className="border-t border-border bg-muted/30">
                    <td className="p-4 font-semibold">Growing Store</td>
                    <td className="p-4">100 products</td>
                    <td className="p-4">40 sales</td>
                    <td className="p-4 font-bold text-green-600">$4,000 - $8,000</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4 font-semibold">Established Store</td>
                    <td className="p-4">300 products</td>
                    <td className="p-4">100 sales</td>
                    <td className="p-4 font-bold text-green-600">$10,000 - $20,000</td>
                  </tr>
                  <tr className="border-t border-border bg-muted/30">
                    <td className="p-4 font-semibold">Top Performer</td>
                    <td className="p-4">500+ products</td>
                    <td className="p-4">200+ sales</td>
                    <td className="p-4 font-bold text-green-600">$25,000 - $50,000+</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Real Partner Examples */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold">Sarah's Part-Time Success</h4>
                  <p className="text-sm text-muted-foreground">Former Mechanic</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Products: 50 auto accessories</li>
                <li>• Time: 10 hours/week</li>
                <li>• Monthly Sales: 25 units</li>
                <li>• Monthly Profit: <strong>$3,750</strong></li>
                <li>• Yearly: <strong>$45,000</strong> (side income!)</li>
              </ul>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-bold">Mike's Full-Time Business</h4>
                  <p className="text-sm text-muted-foreground">Career Changer</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Products: 200 items (parts + accessories)</li>
                <li>• Time: 30 hours/week</li>
                <li>• Monthly Sales: 80 units</li>
                <li>• Monthly Profit: <strong>$12,000</strong></li>
                <li>• Yearly: <strong>$144,000</strong> (replaced corporate job!)</li>
              </ul>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-bold">Lisa's Niche Empire</h4>
                  <p className="text-sm text-muted-foreground">EV Specialist</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Focus: Electric vehicle accessories</li>
                <li>• Products: 150 specialty items</li>
                <li>• Monthly Profit: <strong>$18,000</strong></li>
                <li>• Key: Became go-to expert in EV niche</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Store Requirements */}
        <div className="container-wide max-w-6xl mx-auto py-12 px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">🏪 Store Requirements & Setup</h2>
            <p className="text-xl text-muted-foreground">Everything you need to start your automotive business</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                What You Need to Start
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>At least 10 products in your store (across any categories)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Store name and basic branding</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Payment method for wholesale payments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Bank account for profit deposits</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Time commitment: 5+ hours/week recommended</span>
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                What We Provide FREE
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <span>Professional store template</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <span>Hosting and security</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <span>Payment processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <span>Customer service system</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <span>Marketing tools and analytics</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Product Categories */}
          <div className="mt-8 bg-card rounded-lg p-6 border border-border">
            <h3 className="text-xl font-bold mb-4">Available Product Categories</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Car className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-medium">Complete Vehicles</p>
                <p className="text-xs text-muted-foreground">New, Used, Certified</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Wrench className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-medium">Engine Components</p>
                <p className="text-xs text-muted-foreground">30%+ profit margins</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-medium">Interior Accessories</p>
                <p className="text-xs text-muted-foreground">40-60% margins</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-medium">Safety Equipment</p>
                <p className="text-xs text-muted-foreground">High-demand</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Partners Succeed */}
        <div className="container-wide max-w-6xl mx-auto py-12 px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">🚀 Why AutoTradeHub Partners Succeed</h2>
            <p className="text-xl text-muted-foreground">Competitive advantages that set you up for success</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card rounded-lg p-6 text-center border border-border">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold mb-2">No Inventory Risk</h3>
              <p className="text-sm text-muted-foreground">Only pay when items sell</p>
            </div>

            <div className="bg-card rounded-lg p-6 text-center border border-border">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold mb-2">Massive Selection</h3>
              <p className="text-sm text-muted-foreground">100,000+ products available</p>
            </div>

            <div className="bg-card rounded-lg p-6 text-center border border-border">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold mb-2">Manufacturer Direct</h3>
              <p className="text-sm text-muted-foreground">Best wholesale pricing</p>
            </div>

            <div className="bg-card rounded-lg p-6 text-center border border-border">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-bold mb-2">Built-in Audience</h3>
              <p className="text-sm text-muted-foreground">500,000+ monthly buyers</p>
            </div>
          </div>
        </div>

        {/* Partner Tiers */}
        <div className="container-wide max-w-6xl mx-auto py-12 px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">💼 Partner Tiers</h2>
            <p className="text-xl text-muted-foreground">Choose the plan that fits your goals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-xl font-bold mb-2">Starter Tier</h3>
              <p className="text-2xl font-bold text-green-600 mb-4">100% FREE</p>
              <p className="text-muted-foreground mb-4">Perfect for testing the model</p>
              <ul className="space-y-2 text-sm mb-6">
                <li>• Up to 50 product listings</li>
                <li>• Basic store template</li>
                <li>• Standard support</li>
                <li>• Community access</li>
              </ul>
              <p className="font-semibold text-green-600">Monthly Potential: $1,000 - $5,000</p>
            </div>

            <div className="bg-card rounded-lg p-6 border-2 border-primary">
              <div className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full inline-block mb-2">
                RECOMMENDED
              </div>
              <h3 className="text-xl font-bold mb-2">Growth Tier</h3>
              <p className="text-2xl font-bold text-primary mb-4">$49/month</p>
              <p className="text-muted-foreground mb-4">For serious part-time income</p>
              <ul className="space-y-2 text-sm mb-6">
                <li>• Up to 500 product listings</li>
                <li>• Custom store design</li>
                <li>• Priority support</li>
                <li>• Marketing automation</li>
                <li>• Advanced analytics</li>
              </ul>
              <p className="font-semibold text-primary">Monthly Potential: $5,000 - $20,000</p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-xl font-bold mb-2">Professional Tier</h3>
              <p className="text-2xl font-bold text-primary mb-4">$99/month</p>
              <p className="text-muted-foreground mb-4">Full-time business builders</p>
              <ul className="space-y-2 text-sm mb-6">
                <li>• Unlimited listings</li>
                <li>• Premium features</li>
                <li>• Dedicated account manager</li>
                <li>• Team member accounts</li>
                <li>• API access</li>
              </ul>
              <p className="font-semibold text-primary">Monthly Potential: $20,000 - $75,000</p>
            </div>
          </div>
        </div>

        {/* Launch Bonus */}
        <div className="container-wide max-w-6xl mx-auto py-12 px-4">
          <div className="bg-gradient-accent rounded-lg text-white p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">🌟 Launch Bonus Package</h2>
              <p className="text-xl">Apply This Week & Receive:</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold">3</span>
                </div>
                <p className="font-semibold">Months FREE</p>
                <p className="text-sm">on Growth Tier ($147 value)</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold">2X</span>
                </div>
                <p className="font-semibold">Commissions</p>
                <p className="text-sm">on first 10 sales</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 mx-auto" />
                </div>
                <p className="font-semibold">Success Coach</p>
                <p className="text-sm">for 90 days</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-6 h-6 mx-auto" />
                </div>
                <p className="font-semibold">$500 Ad Credit</p>
                <p className="text-sm">Google/Facebook ads</p>
              </div>
            </div>

            <div className="text-center">
              <Link 
                to="/partner/apply" 
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors text-lg"
              >
                Apply Now & Claim Your Bonus
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="container-wide max-w-6xl mx-auto py-12 px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">💬 Real Partner Testimonials</h2>
            <p className="text-xl text-muted-foreground">Success stories from our partners</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <blockquote className="text-muted-foreground mb-3">
                    "I was skeptical about 'no inventory' businesses, but AutoTradeHub proved me wrong. I made $4,200 in my first month working part-time from my phone."
                  </blockquote>
                  <cite className="font-semibold">- Marcus T., Former Mechanic</cite>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <blockquote className="text-muted-foreground mb-3">
                    "The training program is worth its weight in gold. I went from zero automotive knowledge to running a $12,000/month business in 6 months."
                  </blockquote>
                  <cite className="font-semibold">- Jennifer L., Stay-at-Home Mom</cite>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container-wide max-w-6xl mx-auto py-12 px-4">
          <div className="bg-card rounded-lg shadow-lg p-8 border border-border text-center">
            <h2 className="text-3xl font-bold mb-4">🎯 Your Automotive Success Starts Here</h2>
            <p className="text-xl text-muted-foreground mb-6">
              This isn't a get-rich-quick scheme. It's a proven business model with real products, genuine customers, and real partners earning real money.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-6 mb-6">
              <p className="text-lg font-semibold mb-4">Limited Time Opportunity</p>
              <p className="text-muted-foreground mb-2">Only 50 Spots Available This Month</p>
              <p className="text-primary font-bold">27 spots remaining</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/partner/apply" 
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Apply Now & Start Your Automotive Empire
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/faqs" 
                className="inline-flex items-center gap-2 bg-transparent border-2 border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/10 transition-colors"
              >
                Read FAQs
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
