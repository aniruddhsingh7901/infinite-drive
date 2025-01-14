'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import CryptoPayment from '@/components/CryptoPayment';

export default function PaymentProcessPage() {
  const searchParams = useSearchParams();
  // const router = useRouter();
  
  const orderId = searchParams.get('orderId') || '';
  const currency = searchParams.get('currency') || '';
  const address = searchParams.get('address') || '';
  const qrData = searchParams.get('qrData') || '';
  console.log("🚀 ~ PaymentProcessPage ~ qrData:", qrData)
  const amount = parseFloat(searchParams.get('amount') || '0');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <CryptoPayment
        orderId={orderId}
        currency={currency}
        address={address}
        amount={amount}
        qrData= {qrData}
        expiresIn={3600} // 30 minutes
      
      />
    </div>
  );
}