'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import CryptoPayment from '@/components/CryptoPayment';

export default function PaymentProcessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get('orderId') || '';
  const currency = searchParams.get('currency') || '';
  const address = searchParams.get('address') || '';
  const amount = parseFloat(searchParams.get('amount') || '0');

  if (!orderId || !currency || !address || !amount) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-xl text-red-600 mb-2">Invalid Payment Session</h2>
          <p className="text-gray-600 mb-4">Missing required payment information</p>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <CryptoPayment
        orderId={orderId}
        currency={currency}
        address={address}
        amount={amount}
        expiresIn={1800}
        onPaymentProcess={(data) => {
          router.push(`/payments/status?orderId=${data.orderId}&status=${data.status}`);
        }}
      />
    </div>
  );
}