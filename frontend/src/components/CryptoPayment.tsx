import { useState, useEffect } from 'react';
import QRCode from 'qr-code-styling';
import { useRouter } from 'next/navigation';

interface CryptoPaymentProps {
  orderId: string;
  currency: string;
  address: string;
  amount: number;
  expiresIn: number; // in seconds
}

export default function CryptoPayment({ orderId, currency, address, amount, expiresIn }: CryptoPaymentProps) {
  const [timeLeft, setTimeLeft] = useState(expiresIn);
  const [status, setStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const router = useRouter();

  useEffect(() => {
    // Generate QR Code
    const qr = new QRCode({
      width: 300,
      height: 300,
      data: `${currency.toLowerCase()}:${address}?amount=${amount}`,
      dotsOptions: { color: '#2563eb', type: 'rounded' },
      backgroundOptions: { color: '#ffffff' },
      imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 0 }
    });

    const container = document.getElementById('qrcode');
    if (container) {
      container.innerHTML = '';
      qr.append(container);
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Check payment status
    const checkStatus = setInterval(async () => {
      try {
        const response = await fetch(`/api/payments/status/${orderId}`);
        const data = await response.json();

        if (data.status === 'completed') {
          setStatus('completed');
          clearInterval(checkStatus);
          setTimeout(() => {
            router.push(`/download?token=${data.downloadToken}`);
          }, 3000);
        }
      } catch (error) {
        console.error('Failed to check payment status:', error);
      }
    }, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(checkStatus);
    };
  }, [orderId, currency, address, amount]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
        <p className="text-gray-600">Send exactly {amount} {currency}</p>
      </div>

      {/* QR Code */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div id="qrcode" className="flex justify-center" />
      </div>

      {/* Payment Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600">Send To Address:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={address}
              readOnly
              className="w-full p-2 bg-gray-50 rounded border font-mono text-sm"
            />
            <button
              onClick={() => navigator.clipboard.writeText(address)}
              className="p-2 text-blue-600 hover:text-blue-700"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Time Remaining:</span>
          <span className="font-mono text-lg">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mt-4">
          <div className={`w-2 h-2 rounded-full ${
            status === 'pending' ? 'bg-yellow-400' :
            status === 'completed' ? 'bg-green-400' : 'bg-red-400'
          }`} />
          <span className="text-sm text-gray-600">
            {status === 'pending' ? 'Waiting for payment...' :
             status === 'completed' ? 'Payment confirmed!' : 'Payment failed'}
          </span>
        </div>
      </div>
    </div>
  );
}