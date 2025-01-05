'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function PaymentStatusPage() {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-8">We couldn't process your payment. Please try again.</p>

        <div className="space-y-4">
          <h2 className="font-semibold">Possible Reasons:</h2>
          <ul className="text-gray-600">
            <li>Payment timeout</li>
            <li>Insufficient funds</li>
            <li>Network issues</li>
          </ul>
        </div>
      </div>

      <div className="space-x-4">
        <Button onClick={() => router.back()}>Try Again</Button>
        <button 
          onClick={() => router.push('/')}
          className="text-gray-600 hover:text-gray-800"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}