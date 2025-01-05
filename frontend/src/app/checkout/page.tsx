'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart/CartContext';
import Button from '@/components/Button';
import { CRYPTO_PAYMENTS } from '@/utils/constants';
import { useRouter } from 'next/navigation';

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
      
      // Log request data
      console.log('Sending payment request:', {
        email: formData.email,
        cryptocurrency: formData.selectedCrypto,
        bookId: book.id,
        amount: total
      });
  
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          cryptocurrency: formData.selectedCrypto,
          bookId: book.id,
          amount: total
        })
      });
  
      // Log raw response
      const responseText = await response.text();
      console.log('Raw response:', responseText);
  
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid server response');
      }
  
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Payment initialization failed');
      }
  
      router.push(`/payments/process?orderId=${data.orderId}&address=${data.paymentAddress}&amount=${data.amount}&currency=${data.currency}`);
  
    } catch (err) {
      console.error('Payment error:', err);
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
                {Object.entries(CRYPTO_PAYMENTS).map(([key, crypto]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, selectedCrypto: key });
                      setError(null);
                    }}
                    className={`p-4 border rounded-lg text-left transition-all ${
                      formData.selectedCrypto === key 
                        ? 'border-blue-500 bg-blue-50' 
                        : error?.field === 'crypto'
                        ? 'border-red-300'
                        : 'hover:border-gray-300'
                    }`}
                    disabled={isProcessing}
                  >
                    <div className="font-medium">{crypto.name}</div>
                    <div className="text-sm text-gray-500">{crypto.symbol}</div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!formData.email || !formData.selectedCrypto || isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay ${total.toFixed(2)} USD`}
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