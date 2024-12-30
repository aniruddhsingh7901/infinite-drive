'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart/CartContext';
import Button from '@/components/Button';
import { CRYPTO_PAYMENTS } from '@/utils/constants';

type CheckoutForm = {
  email: string;
  selectedCrypto: string;
};

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [formData, setFormData] = useState<CheckoutForm>({
    email: '',
    selectedCrypto: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Will implement payment processing later
    console.log('Processing payment:', { ...formData, total });
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email for delivery
              </label>
              <input
                type="email"
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>

            {/* Crypto Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(CRYPTO_PAYMENTS).map(([key, crypto]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormData({ ...formData, selectedCrypto: key })}
                    className={`p-4 border rounded-lg text-left transition-all ${
                      formData.selectedCrypto === key 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-gray-300'
                    }`}
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
              disabled={!formData.email || !formData.selectedCrypto}
            >
              Complete Purchase
            </Button>
          </form>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.format}</div>
                  </div>
                  <div className="font-medium">${item.price}</div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold">${total}</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
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