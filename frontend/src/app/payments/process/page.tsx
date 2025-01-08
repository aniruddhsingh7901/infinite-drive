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

  const handlePaymentProcess = (data) => {
    router.push(`/payments/process?orderId=${data.orderId}&currency=${data.currency}&address=${data.address}&amount=${data.amount}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <CryptoPayment
        orderId={orderId}
        currency={currency}
        address={address}
        amount={amount}
        expiresIn={1800} // 30 minutes
        onPaymentProcess={handlePaymentProcess}
      />
    </div>
  );
}