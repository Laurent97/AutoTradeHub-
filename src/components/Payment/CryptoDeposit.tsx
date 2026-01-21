import { useState, useEffect } from 'react';
import { paymentService } from '@/lib/supabase/payment-service';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Shield, Copy, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CryptoAddress {
  crypto_type: string;
  address: string;
  tag: string | null;
}

export default function CryptoDeposit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [addresses, setAddresses] = useState<CryptoAddress[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [usdAmount, setUsdAmount] = useState(500);
  const [cryptoAmount, setCryptoAmount] = useState(0);
  const [prices, setPrices] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Get orderId and amount from URL params
  const orderId = searchParams.get('orderId');
  const amountParam = searchParams.get('amount');

  useEffect(() => {
    // Check for dark mode
    const htmlElement = document.documentElement;
    setIsDarkMode(htmlElement.classList.contains('dark'));

    // Set amount from URL if provided
    if (amountParam) {
      const amount = parseFloat(amountParam);
      if (!isNaN(amount) && amount > 0) {
        setUsdAmount(amount);
      }
    }

    loadData();
  }, [amountParam]);

  useEffect(() => {
    calculateCryptoAmount();
  }, [usdAmount, selectedCrypto, prices]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [addressesRes, pricesRes] = await Promise.all([
        paymentService.getPlatformCryptoAddresses(),
        paymentService.getCryptoPrices(),
      ]);

      if (addressesRes.data) setAddresses(addressesRes.data);
      if (pricesRes) setPrices(pricesRes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCryptoAmount = () => {
    const price = prices[selectedCrypto === 'USDT_TRX' ? 'USDT' : selectedCrypto] || 1;
    const amount = usdAmount / price;
    setCryptoAmount(parseFloat(amount.toFixed(8)));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Address copied to clipboard',
    });
  };

  const selectedAddress = addresses.find((a) => a.crypto_type === selectedCrypto);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading deposit information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-[380px_520px_1fr] gap-8">

          {/* LEFT COLUMN — PAYMENT ACTION */}
          <section className="space-y-6">

            {/* Deposit Method */}
            <Card title="Deposit Method">
              <div className="grid grid-cols-2 gap-4">
                <CryptoOption 
                  active={selectedCrypto === 'BTC'} 
                  name="BTC" 
                  price={`$${prices.BTC?.toLocaleString() || '45,000'}`}
                  onClick={() => setSelectedCrypto('BTC')}
                />
                <CryptoOption 
                  active={selectedCrypto === 'ETH'} 
                  name="ETH" 
                  price={`$${prices.ETH?.toLocaleString() || '3,000'}`}
                  onClick={() => setSelectedCrypto('ETH')}
                />
                <CryptoOption 
                  active={selectedCrypto === 'USDT_TRX'} 
                  name="USDT_TRX" 
                  price={`$${prices.USDT?.toLocaleString() || '1'}`}
                  onClick={() => setSelectedCrypto('USDT_TRX')}
                />
                <CryptoOption 
                  active={selectedCrypto === 'XRP'} 
                  name="XRP" 
                  price={`$${prices.XRP?.toLocaleString() || '0.5'}`}
                  onClick={() => setSelectedCrypto('XRP')}
                />
              </div>
            </Card>

            {/* Amount */}
            <Card title="Amount">
              <input
                type="number"
                value={usdAmount}
                onChange={(e) => setUsdAmount(parseFloat(e.target.value) || 0)}
                className={`w-full rounded-lg px-4 py-3 text-lg font-semibold outline-none ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                }`}
                min="10"
                step="10"
              />
              <p className="mt-2 text-sm text-green-500">
                Minimum deposit: $10
              </p>
              <div className={`mt-3 rounded-lg px-4 py-3 text-sm ${
                isDarkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'
              }`}>
                You will send: <strong>{cryptoAmount.toFixed(8)} {selectedCrypto}</strong>
              </div>
            </Card>

            {/* Deposit Address */}
            <Card title="Deposit Address">
              <div className={`relative rounded-lg px-4 py-3 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <span className="block pr-14 break-all text-sm font-mono">
                  {selectedAddress?.address || 'Loading...'}
                </span>
                <button 
                  onClick={() => copyToClipboard(selectedAddress?.address || '')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}
                >
                  <Copy size={16} />
                </button>
              </div>
              
              {/* XRP Tag */}
              {selectedCrypto === 'XRP' && selectedAddress?.tag && (
                <div className="mt-4">
                  <div className={`relative rounded-lg px-4 py-3 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <span className="block pr-14 text-sm font-mono">
                      Tag: {selectedAddress.tag}
                    </span>
                    <button 
                      onClick={() => copyToClipboard(selectedAddress.tag || '')}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <div className={`mt-2 p-3 rounded-lg border ${
                    isDarkMode ? 'bg-red-900/20 border-red-800/50' : 'bg-red-50 border-red-200'
                  }`}>
                    <p className={`text-xs font-medium flex items-center ${
                      isDarkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Include this tag or funds will be lost!
                    </p>
                  </div>
                </div>
              )}
            </Card>

          </section>

          {/* MIDDLE COLUMN — ORDER & STATUS */}
          <section className="space-y-6">

            {/* Order Info */}
            <Card title="Order Information">
              <div className="flex justify-between text-sm">
                <span className={`text-muted-foreground ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Order ID
                </span>
                <span className="font-mono">
                  {orderId || 'WALLET-DEPOSIT-1768991642350'}
                </span>
              </div>
              <div className="flex justify-between mt-3">
                <span className={`text-muted-foreground ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Amount Due
                </span>
                <span className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  ${usdAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mt-3">
                <span className={`text-muted-foreground ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  You will send
                </span>
                <span className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {cryptoAmount.toFixed(8)} {selectedCrypto}
                </span>
              </div>
            </Card>

            {/* Payment Status */}
            <Card title="Payment Status">
              <StatusItem step={1} title="Initiate Transfer" active />
              <StatusItem step={2} title="Confirmations" />
              <StatusItem step={3} title="Complete" />
            </Card>

          </section>

          {/* RIGHT COLUMN — TRUST & SUPPORT */}
          <section className="space-y-6">

            {/* Security */}
            <Card>
              <div className="flex flex-col items-center text-center space-y-3">
                <Shield className={`h-10 w-10 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Secure & Protected
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Transactions secured with 256-bit SSL encryption
                </p>
              </div>
            </Card>

            {/* Support */}
            <Card title="Need Help?">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Having trouble with your payment?
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => window.open('https://wa.me/1234567890', '_blank')}
                  className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white"
                >
                  WhatsApp Support
                </button>
                <button 
                  onClick={() => window.open('mailto:support@example.com', '_blank')}
                  className={`w-full rounded-lg py-3 font-semibold ${
                    isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  Email Support
                </button>
              </div>
            </Card>

          </section>

        </div>
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const htmlElement = document.documentElement;
    setIsDarkMode(htmlElement.classList.contains('dark'));
  }, []);

  return (
    <div className={`rounded-2xl border p-6 shadow-lg ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {title && <h2 className={`mb-4 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h2>}
      {children}
    </div>
  );
}

function CryptoOption({ name, price, active, onClick }: { 
  name: string; 
  price: string; 
  active: boolean; 
  onClick: () => void;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const htmlElement = document.documentElement;
    setIsDarkMode(htmlElement.classList.contains('dark'));
  }, []);

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-4 text-center cursor-pointer transition ${
        active 
          ? isDarkMode 
            ? "border-blue-500 bg-blue-900/30" 
            : "border-blue-500 bg-blue-50"
          : isDarkMode
            ? "border-gray-600 hover:bg-gray-700"
            : "border-gray-200 hover:bg-gray-50"
      }`}
    >
      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{name}</div>
      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{price}</div>
    </div>
  );
}

function StatusItem({ step, title, active }: { 
  step: number; 
  title: string; 
  active?: boolean;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const htmlElement = document.documentElement;
    setIsDarkMode(htmlElement.classList.contains('dark'));
  }, []);

  return (
    <div className="flex items-center gap-4 py-2">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
          active 
            ? "bg-blue-500 text-white" 
            : isDarkMode
              ? "bg-gray-700 text-gray-400"
              : "bg-gray-200 text-gray-500"
        }`}
      >
        {active ? <CheckCircle size={16} /> : step}
      </div>
      <span className={
        active 
          ? `font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`
          : `${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`
      }>
        {title}
      </span>
    </div>
  );
}