import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentOptions from '../components/Payment/PaymentOptions';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  
  const [orderId, setOrderId] = useState<string>();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setAmount(total);

    // Get order ID from location state or generate
    const stateOrderId = location.state?.orderId || `ORD-${Date.now()}`;
    setOrderId(stateOrderId);
  }, [items, location.state, navigate]);

  const handlePaymentSuccess = (paymentData: any) => {
    alert(`Payment successful! Transaction ID: ${paymentData.paymentIntentId || paymentData.orderId}`);
    
    // Clear cart
    clearCart();
    
    // Redirect to success page
    navigate('/order-success', {
      state: {
        orderId: orderId,
        paymentData: paymentData
      }
    });
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between max-w-md mx-auto">
                {['Cart', 'Checkout', 'Payment', 'Complete'].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${index < 2 ? 'bg-green-600 text-white' : 
                        index === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}
                    `}>
                      {index < 2 ? '✓' : index + 1}
                    </div>
                    <span className={`
                      ml-2 text-sm ${index === 2 ? 'font-semibold text-blue-600' : 'text-gray-600'}
                    `}>
                      {step}
                    </span>
                    {index < 3 && (
                      <div className={`
                        w-16 h-0.5 mx-4 ${index < 2 ? 'bg-green-600' : 'bg-gray-300'}
                      `} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Payment Options */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold mb-6">Payment</h1>
                
                {!user ? (
                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-6">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                      Login Required
                    </h3>
                    <p className="text-yellow-700 mb-4">
                      Please login or create an account to continue with payment.
                    </p>
                    <button
                      onClick={() => navigate('/auth', { state: { from: location.pathname } })}
                      className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700"
                    >
                      Sign In to Continue
                    </button>
                  </div>
                ) : (
                  <PaymentOptions
                    amount={amount}
                    orderId={orderId}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                )}
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center border-b pb-4">
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${(amount * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${(amount * 1.1).toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Including ${(amount * 0.1).toFixed(2)} VAT</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/cart')}
                      className="w-full text-center text-blue-600 hover:text-blue-800 py-2"
                    >
                      ← Back to Cart
                    </button>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="mt-6 bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold mb-3">Secure Payment</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-green-600">✓</span>
                      </div>
                      <span className="text-sm">SSL Secure</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-blue-600">🔒</span>
                      </div>
                      <span className="text-sm">256-bit Encrypted</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-purple-600">✓</span>
                      </div>
                      <span className="text-sm">PCI DSS Compliant</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-yellow-600">🛡️</span>
                      </div>
                      <span className="text-sm">Fraud Protected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
