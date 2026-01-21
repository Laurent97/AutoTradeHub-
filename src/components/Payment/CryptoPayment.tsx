import { useState, useEffect } from 'react';
import { paymentService } from '../../lib/supabase/payment-service';

interface CryptoPaymentProps {
  amount: number;
  onContinue: () => void;
}

export default function CryptoPayment({ amount, onContinue }: CryptoPaymentProps) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState('USDT_TRX');
  const [loading, setLoading] = useState(true);
  
  // Check for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const htmlElement = document.documentElement;
    setIsDarkMode(htmlElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    const { data } = await paymentService.getPlatformCryptoAddresses();
    if (data) setAddresses(data);
    setLoading(false);
  };

  const selectedAddress = addresses.find(a => a.crypto_type === selectedCrypto);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-lg ${
        isDarkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50'
      }`}>
        <h3 className={`font-semibold mb-2 ${
          isDarkMode ? 'text-blue-300' : 'text-blue-800'
        }`}>
          Pay with Cryptocurrency
        </h3>
        <p className={`${
          isDarkMode ? 'text-blue-200' : 'text-blue-700'
        }`}>
          Send exact amount in {selectedCrypto} to our address. Payment will be confirmed after network confirmations.
        </p>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Select Cryptocurrency
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {addresses.map((crypto) => (
            <button
              key={crypto.crypto_type}
              onClick={() => setSelectedCrypto(crypto.crypto_type)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedCrypto === crypto.crypto_type
                  ? 'border-blue-500 bg-blue-50'
                  : isDarkMode
                    ? 'border-gray-600 hover:border-gray-500 bg-gray-800 hover:bg-gray-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <div className={`font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {crypto.crypto_type}
              </div>
              <div className={`text-xs truncate ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} title={crypto.address}>
                {crypto.address.substring(0, 12)}...
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedAddress && (
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="space-y-3">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Send {selectedCrypto} to:
              </label>
              <div className="flex items-center">
                <code className={`flex-grow p-2 rounded border text-sm font-mono ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'
                }`}>
                  {selectedAddress.address}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedAddress.address);
                    alert('Address copied!');
                  }}
                  className={`ml-2 px-3 py-1 rounded text-sm transition-colors ${
                    isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Copy
                </button>
              </div>
            </div>

            {selectedCrypto === 'XRP' && selectedAddress.tag && (
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  XRP Destination Tag:
                </label>
                <div className="flex items-center">
                  <code className={`flex-grow p-2 rounded border text-sm font-mono ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'
                  }`}>
                    {selectedAddress.tag}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedAddress.tag);
                      alert('Tag copied!');
                    }}
                    className={`ml-2 px-3 py-1 rounded text-sm transition-colors ${
                      isDarkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Copy
                  </button>
                </div>
                <p className={`text-red-500 text-xs mt-1 ${
                  isDarkMode ? 'text-red-400' : 'text-red-600'
                }`}>
                  ⚠️ MUST include this tag or funds will be lost!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={`p-4 rounded-lg border ${
        isDarkMode 
          ? 'bg-yellow-900/20 border-yellow-800/50'
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <h4 className={`font-semibold mb-2 ${
          isDarkMode ? 'text-yellow-300' : 'text-yellow-800'
        }`}>
          Important Instructions:
        </h4>
        <ol className={`text-sm list-decimal pl-4 space-y-1 ${
          isDarkMode ? 'text-yellow-200/80' : 'text-yellow-700'
        }`}>
          <li>Copy the {selectedCrypto} address above</li>
          <li>Send exact amount from your wallet</li>
          {selectedCrypto === 'XRP' && <li>Include the destination tag</li>}
          <li>Wait for network confirmations (3-6 for BTC, 12+ for others)</li>
          <li>Payment will be automatically confirmed</li>
          <li>Contact support if payment not confirmed within 30 minutes</li>
        </ol>
      </div>

      <button
        onClick={onContinue}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
          isDarkMode 
            ? 'bg-purple-700 hover:bg-purple-600 text-white' 
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        Continue to Crypto Deposit
      </button>
    </div>
  );
}
