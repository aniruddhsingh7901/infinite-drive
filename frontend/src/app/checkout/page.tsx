'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart/CartContext';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { Bitcoin, ArrowRight, DollarSign, Circle } from 'lucide-react';

const CRYPTO_PAYMENTS = {
  bitcoin: {
    name: 'Bitcoin',
    symbol: 'BTC',
    apiValue: 'BTC',
    icon: () => <Bitcoin className="w-6 h-6 text-[#F7931A] transition-transform group-hover:scale-110" />
  },
  litecoin: {
    name: 'Litecoin',
    symbol: 'LTC',
    apiValue: 'LTC',
    icon: () => (
      <svg className="w-6 h-6 text-[#345D9D] transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0zm-.262 3.678h2.584a.343.343 0 0 1 .343.343v12.32l1.706-1.706a.343.343 0 0 1 .484 0l1.815 1.815a.343.343 0 0 1 0 .484l-4.526 4.526a.343.343 0 0 1-.484 0L9.13 16.934a.343.343 0 0 1 0-.484l1.815-1.815a.343.343 0 0 1 .484 0l1.706 1.706V4.021a.343.343 0 0 1-.343-.343H9.177a.343.343 0 0 1-.343-.343V3.678z"/>
      </svg>
    )
  },
  tron: {
    name: 'Tron',
    symbol: 'TRX',
    apiValue: 'TRX',
    icon: () => (
      <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none">
        <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" fill="#EF0027"/>
        <path d="M17.5 8.5L9.25 6l-4.75 9 13-6.5z" fill="white"/>
      </svg>
    )
  },
  monero: {
    name: 'Monero',
    symbol: 'XMR',
    apiValue: 'XMR',
    icon: () => (
      <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#FF6600"/>
        <path d="M12 4v12M7 8v8M17 8v8M5 16h14" stroke="white" strokeWidth="2"/>
      </svg>
    )
  },
  solana: {
    name: 'Solana',
    symbol: 'SOL',
    apiValue: 'SOL',
    icon: () => (
      <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#14F195"/>
        <path d="M7 14.5l10-5M7 9.5l10-5M7 19.5l10-5" stroke="white" strokeWidth="2"/>
      </svg>
    )
  },
  dogecoin: {
    name: 'Dogecoin',
    symbol: 'DOGE',
    apiValue: 'DOGE',
    icon: () => (
      <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#C2A633"/>
        <path d="M8 8h4.5c2.5 0 4.5 2 4.5 4s-2 4-4.5 4H8" stroke="white" strokeWidth="2"/>
      </svg>
    )
  },
  tether: {
    name: 'Tether',
    symbol: 'USDT',
    apiValue: 'USDT',
    icon: () => (
      <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#26A17B"/>
        <path d="M12 5v14M8 8h8" stroke="white" strokeWidth="2"/>
      </svg>
    )
  }
};

type CheckoutForm = {
  email: string;
  selectedCrypto: string;
};

type PaymentError = {
  message: string;
  field?: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total } = useCart();
  const [formData, setFormData] = useState<CheckoutForm>({
    email: '',
    selectedCrypto: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<PaymentError | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push('/')}>Continue Shopping</Button>
      </div>
    );
  }

  const validateForm = (): boolean => {
    if (!formData.email) {
      setError({ message: 'Email is required', field: 'email' });
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError({ message: 'Please enter a valid email address', field: 'email' });
      return false;
    }
    if (!formData.selectedCrypto) {
      setError({ message: 'Please select a payment method', field: 'crypto' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    if (!validateForm()) {
      return;
    }
  
    setIsProcessing(true);
    
    try {
      const book = items[0];
      console.log("🚀 ~ handleSubmit ~ book:", book)
      const selectedCrypto = CRYPTO_PAYMENTS[formData.selectedCrypto as keyof typeof CRYPTO_PAYMENTS];
      
      console.log('Payment Request Data:', {
        email: formData.email,
        selectedCrypto: formData.selectedCrypto,
        cryptoDetails: selectedCrypto,
        bookId: book.id,
        format:book.format,
        amount: total
      });
      
      const response = await fetch('http://localhost:5000/payment/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          cryptocurrency: selectedCrypto.apiValue,
          bookId: book.id,
          format:book.format,
          amount: total
        })
      });
  
      const responseText = await response.text();
       console.log('Raw API Response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed API Response:', data);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Invalid server response');
      }
  
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Payment initialization failed');
      }
  
      router.push(`/payments/process?orderId=${data.orderId}&address=${data.paymentAddress}&qrData=${data.qrCodeData}&amount=${data.amount}&currency=${data.currency}`);
  
    } catch (err) {
      console.error('Payment Error:', err);
      setError({ 
        message: err instanceof Error ? err.message : 'Payment failed. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error.message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email for delivery
              </label>
              <input
                type="email" 
                required
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  error?.field === 'email' ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setError(null);
                }}
                placeholder="your@email.com"
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(CRYPTO_PAYMENTS).map(([key, crypto]) => {
                  const Icon = crypto.icon;
                  const isSelected = formData.selectedCrypto === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, selectedCrypto: key });
                        setError(null);
                      }}
                      className={`group p-4 border rounded-lg text-left transition-all duration-200 
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105' 
                          : error?.field === 'crypto'
                          ? 'border-red-300'
                          : 'hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm hover:scale-102'
                        }`}
                      disabled={isProcessing}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="transition-transform duration-200">
                          <Icon />
                        </div>
                        <div className="transition-transform duration-200">
                          <div className={`font-medium ${isSelected ? 'text-blue-600' : ''}`}>
                            {crypto.name}
                          </div>
                          <div className={`text-sm ${isSelected ? 'text-blue-500' : 'text-gray-500'}`}>
                            {crypto.symbol}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 transition-all duration-200 hover:shadow-lg"
              disabled={!formData.email || !formData.selectedCrypto || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Circle className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  <span>Pay {total.toFixed(2)} USD</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </div>

        <div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.format}</div>
                  </div>
                  <div className="font-medium">${item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-9a1 1 0 011 1v3a1 1 0 11-2 0V8a1 1 0 011-1z"/>
              </svg>
              Secure Payment
            </div>
            <p>Your payment is processed securely using blockchain technology.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
