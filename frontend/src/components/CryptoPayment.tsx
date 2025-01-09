'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';

interface CryptoPaymentProps {
  orderId: string;
  currency: string;
  address: string;
  amount: number;
  expiresIn: number;
  onPaymentProcess: (data: any) => void;
}

export default function CryptoPayment({
  orderId,
  currency,
  address,
  amount,
  expiresIn,
  onPaymentProcess
}: CryptoPaymentProps) {
  const [timeRemaining, setTimeRemaining] = useState(expiresIn);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    generateQRCode();
    startCountdown();
    startPaymentCheck();
  }, [orderId]);

  const generateQRCode = async () => {
    try {
      // Format BTC payment URI
      const btcUri = `bitcoin:${address}?amount=${amount.toFixed(8)}`;
      // Generate QR code as data URL
      const qrUrl = await QRCode.toDataURL(btcUri, {
        width: 250,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('QR code generation failed:', error);
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          router.push('/payments/status?status=failed&reason=timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return timer;
  };

  const startPaymentCheck = () => {
    const statusCheck = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:5000/payment/check/${orderId}`, {
          credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
          if (data.status === 'completed') {
            setPaymentStatus('completed');
            router.push(`/payments/status?status=success&orderId=${orderId}`);
          } else if (data.status === 'failed') {
            setPaymentStatus('failed');
            router.push('/payments/status?status=failed');
          }
        }
      } catch (error) {
        console.error('Payment status check failed:', error);
      }
    }, 10000);
    return statusCheck;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a tooltip or notification here to show successful copy
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Complete Payment</h2>

      <div className="text-center mb-8">
        <p className="text-gray-600">Send exactly</p>
        <p className="text-3xl font-bold my-2">
          {amount.toFixed(8)} {currency}
        </p>
        <p className="text-gray-600">Time remaining: {formatTime(timeRemaining)}</p>
      </div>

      <div className="flex justify-center mb-8">
        {qrCodeUrl && (
          <img
            src={qrCodeUrl}
            alt="Payment QR Code"
            className="rounded-lg shadow-md"
            width={250}
            height={250}
          />
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Send To Address:
          </label>
          <div className="flex items-center">
            <input
              type="text"
              value={address}
              readOnly
              className="flex-1 p-3 bg-gray-50 rounded-l border"
            />
            <button
              onClick={() => copyToClipboard(address)}
              className="px-4 py-3 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                paymentStatus === 'pending' ? 'bg-yellow-500' :
                paymentStatus === 'completed' ? 'bg-green-500' :
                'bg-red-500'
              }`}
            />
            <span className="text-sm font-medium">
              {paymentStatus === 'pending' ? 'Waiting for payment...' :
               paymentStatus === 'completed' ? 'Payment completed!' :
               'Payment failed'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}