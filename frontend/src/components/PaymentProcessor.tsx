'use client';

import { useState, useEffect } from 'react';
import { checkPaymentStatus } from '@/services/payment';

interface PaymentProcessorProps {
  orderId: string;
  paymentAddress: string;
  amount: string;
  currency: string;
  qrCodeData: string;
  waitTime: string;
  networkFee: string;
}

export default function PaymentProcessor({
  orderId,
  paymentAddress,
  amount,
  currency,
  qrCodeData,
  waitTime,
  networkFee
}: PaymentProcessorProps) {
  const [timeRemaining, setTimeRemaining] = useState(3600); // 30 minutes
  const [status, setStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await checkPaymentStatus(orderId);
        if (response.success) {
          setStatus('completed');
        }
      } catch (err) {
        console.error('Payment check error:', err);
        setError('Failed to check payment status');
      }
    };

    const interval = setInterval(checkStatus, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Complete Payment</h2>
      
      <div className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <img
            src={`https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(qrCodeData)}&chs=250x250`}
            alt="Payment QR Code"
            className="mx-auto mb-4"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Send To Address:</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={paymentAddress}
              readOnly
              className="flex-1 p-2 border rounded bg-gray-50"
            />
            <button
              onClick={() => navigator.clipboard.writeText(paymentAddress)}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount:</label>
          <p className="text-2xl font-bold">{amount} {currency}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Network Fee:</label>
          <p>{networkFee}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Expected Wait Time:</label>
          <p>{waitTime}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Time Remaining:</label>
          <p>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</p>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div className="flex items-center gap-2 mt-4">
          <div className={`w-3 h-3 rounded-full ${
            status === 'pending' ? 'bg-yellow-500' :
            status === 'completed' ? 'bg-green-500' :
            'bg-red-500'
          }`} />
          <span className="text-sm font-medium">
            {status === 'pending' ? 'Waiting for payment...' :
             status === 'completed' ? 'Payment completed!' :
             'Payment failed'}
          </span>
        </div>
      </div>
    </div>
  );
}