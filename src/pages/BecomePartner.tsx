import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Store, Users, TrendingUp, Shield, Star, CheckCircle, AlertCircle, LayoutDashboard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import PartnerRegistrationForm from '../components/Partner/PartnerRegistrationForm';
import { useAuth } from '../contexts/AuthContext';

const BecomePartner: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, loading } = useAuth();

  // Check if user is already a partner or has applied
  const isPartner = userProfile?.user_type === 'partner';
  const isPendingPartner = userProfile?.user_type === 'partner' && userProfile?.partner_status === 'pending';
  const isApprovedPartner = userProfile?.user_type === 'partner' && userProfile?.partner_status === 'approved';

  const benefits = [
    {
      icon: Store,
      title: 'Your Own Store',
      description: 'Create a branded storefront with your logo and custom pricing',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: TrendingUp,
      title: 'Competitive Margins',
      description: 'Set your own prices and earn generous commissions on every sale',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Users,
      title: 'Growing Network',
      description: 'Join 500+ successful partners across 80+ countries',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Shield,
      title: 'Full Support',
      description: 'We handle shipping, logistics, and customer support for you',
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const stats = [
    { number: '500+', label: 'Active Partners' },
    { number: '80+', label: 'Countries' },
    { number: '$2M+', label: 'Annual Revenue' },
    { number: '24/7', label: 'Support' }
  ];

  const features = [
    'No inventory required',
    'Dropshipping model',
    'Commission-based earnings',
    'Marketing support',
    'Analytics dashboard',
    'Mobile app access'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container-wide py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Become a Partner</h1>
          </div>
        </div>
      </div>

      {/* Partner Status Check */}
      {!loading && isPartner && (
        <div className="container-wide py-12">
          <Card className="max-w-2xl mx-auto border-0 shadow-xl dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="text-center pb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                isApprovedPartner 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                  : 'bg-gradient-to-r from-amber-600 to-orange-600'
              }`}>
                {isApprovedPartner ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-white" />
                )}
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {isApprovedPartner ? 'You are already a Partner!' : 'Partner Application Pending'}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
                {isApprovedPartner 
                  ? 'Your partner account is active and ready to use.'
                  : 'Your partner application is currently under review.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center px-6 pb-8">
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {isApprovedPartner 
                    ? 'Access your partner dashboard to manage your store, view analytics, and track your earnings.'
                    : 'Our team is reviewing your application. You will receive an email once your application is approved.'
                  }
                </p>
                {isPendingPartner && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4 mb-4">
                    <p className="text-amber-800 dark:text-amber-200 text-sm">
                      <strong>Status:</strong> Application under review<br />
                      <strong>Next Steps:</strong> You will be notified via email once approved
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="btn-primary"
                  onClick={() => navigate('/partner/dashboard')}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Go to Partner Dashboard
                </Button>
                {!isApprovedPartner && (
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => navigate('/partner/info')}
                  >
                    Learn More About Partnership
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Show loading state */}
      {loading && (
        <div className="container-wide py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Checking your partner status...</p>
          </div>
        </div>
      )}

      {/* Show full page for non-partners */}
      {!loading && !isPartner && (
        <>
        {/* Hero Section */}
        <div className="container-wide py-12 lg:py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 mb-6">
              <Store className="w-4 h-4" />
              <span className="text-sm font-medium">Partner Program</span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Start Your Own
              <span className="block text-gradient-blue">
                Auto Business
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Become a drop-shipping partner and sell cars, parts, and accessories from our catalog. 
              No inventory needed — we handle shipping and logistics.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        {/* Benefits Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Partner with AutoTradeHub?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of successful partners who are already growing their automotive businesses
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="card-hover border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 mx-auto`}>
                    <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                  </div>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Registration Form Section */}
        <div className="mb-16" id="partner-form">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Start Your Partner Journey
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Complete our comprehensive partner application form to get started
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Partner Application Form
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Fill out the multi-step form below to apply for our partner program
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-8">
                <PartnerRegistrationForm />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We provide all the tools and support you need to build a successful auto parts business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-card border border-border rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Join hundreds of successful partners already earning with AutoTradeHub
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-primary"
                onClick={() => document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Apply Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/partner/info')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="text-center">
          <div className="inline-flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Secure Application</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>No Setup Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Quick Approval</span>
            </div>
          </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BecomePartner;
