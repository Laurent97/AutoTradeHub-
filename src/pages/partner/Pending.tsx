import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';

export default function PartnerPending() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { from: '/partner/pending' } });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container-wide max-w-3xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    Application Under Review
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Status Icon */}
                  <div className="flex justify-center">
                    <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock className="w-12 h-12 text-yellow-600" />
                    </div>
                  </div>

                  {/* Main Message */}
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">
                      Application Submitted Successfully
                    </h2>
                    <p className="text-muted-foreground">
                      Your partner application is now under review by our team.
                    </p>
                  </div>

                  {/* Timeline */}
                  <div className="bg-secondary/50 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-foreground mb-4">What Happens Next</h3>

                    <div className="space-y-4">
                      {/* Step 1 */}
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-semibold text-sm">
                            1
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">Application Review</h4>
                          <p className="text-sm text-muted-foreground">
                            Our team will review your store information and verify your details.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ⏱️ Usually 24-48 hours
                          </p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-semibold text-sm">
                            2
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">Email Notification</h4>
                          <p className="text-sm text-muted-foreground">
                            Once reviewed, you'll receive an email notification with the result.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ✉️ Check your email regularly
                          </p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-semibold text-sm">
                            3
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">Dashboard Access</h4>
                          <p className="text-sm text-muted-foreground">
                            After approval, you can access your partner dashboard to start selling.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            🎉 Start earning commissions
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Important Notes */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">📝 Important Notes</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Check your email (including spam folder) for updates</li>
                      <li>• We may contact you for additional information</li>
                      <li>• Application review is typically completed within 48 hours</li>
                      <li>• Once approved, you can start adding products to your store</li>
                    </ul>
                  </div>

                  {/* CTA Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/')}
                      className="w-full"
                    >
                      ← Return Home
                    </Button>
                    <Button
                      onClick={() => navigate('/products')}
                      className="w-full"
                    >
                      View Products <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  {/* Support */}
                  <div className="text-center pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">
                      Have questions? We're here to help.
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.location.href = 'mailto:partners@autodrivedepot.com'}
                    >
                      Contact Support Team
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Application Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <p className="font-semibold text-foreground">Pending Review</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground mb-1">Your Email</p>
                    <p className="font-medium text-foreground truncate">{user?.email}</p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground mb-1">Typical Review Time</p>
                    <p className="font-medium text-foreground">24-48 Hours</p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground mb-2">Partner Benefits</p>
                    <ul className="text-xs space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>No inventory required</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Set your own prices</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>10-30% commission</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Weekly payouts</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
