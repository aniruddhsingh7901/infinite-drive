'use client';

import { useState } from 'react';
import PaymentProcessor from '@/components/PaymentProcessor';
import { useCart } from '@/context/CartContext';

export default function Checkout() {
  const [email, setEmail] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const { total, items } = useCart();

  const cryptoOptions = [
    { id: 'BTC', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'LTC', name: 'Litecoin', symbol: 'LTC' },
    { id: 'TRX', name: 'Tron', symbol: 'TRX' },
    { id: 'XMR', name: 'Monero', symbol: 'XMR' },
    { id: 'SOL', name: 'Solana', symbol: 'SOL' },
    { id: 'DOGE', name: 'Dogecoin', symbol: 'DOGE' },
    { id: 'USDT', name: 'Tether', symbol: 'USDT' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    // Handle successful payment
  };

  const handlePaymentFailure = (error: string) => {
    console.error(error);
    setShowPayment(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {!showPayment ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email for delivery
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {cryptoOptions.map((crypto) => (
                <button
                  key={crypto.id}
                  type="button"
                  onClick={() => setSelectedCrypto(crypto.id)}
                  className={`p-4 border rounded-md ${
                    selectedCrypto === crypto.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                >
                  {crypto.name} ({crypto.symbol})
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!email || !selectedCrypto}
            className="w-full bg-blue-600 text-white p-3 rounded-md"
          >
            Complete Purchase
          </button>
        </form>
      ) : (
        <PaymentProcessor
          email={email}
          cryptocurrency={selectedCrypto}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
        />
      )}

      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between py-2">
            <span>{item.title}</span>
            <span>${item.price}</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4 font-bold">
          <span>Total: ${total}</span>
        </div>
      </div>
    </div>
  );
}