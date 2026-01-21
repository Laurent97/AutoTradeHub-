import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CryptoDepositComponent from '../components/Payment/CryptoDeposit';
import { ArrowLeft } from 'lucide-react';

export default function CryptoDeposit() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [amount, setAmount] = useState(0);
  const [orderId, setOrderId] = useState<string>();

  // Check for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const htmlElement = document.documentElement;
    setIsDarkMode(htmlElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    // Get amount from URL params
    const urlAmount = parseFloat(searchParams.get('amount') || '0');
    const urlOrderId = searchParams.get('orderId');
    
    if (urlAmount > 0) {
      setAmount(urlAmount);
    }
    
    if (urlOrderId) {
      setOrderId(urlOrderId);
    }

    // Redirect if not logged in
    if (!user) {
      navigate('/auth', { 
        state: { from: `/payment/crypto-deposit?amount=${urlAmount}` }
      });
    }
  }, [searchParams, user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-grow ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <button
                onClick={() => navigate(-1)}
                className={`flex items-center mb-4 transition-colors ${
                  isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Payment
              </button>
            </div>

            {/* Render the clean component */}
            <CryptoDepositComponent />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
