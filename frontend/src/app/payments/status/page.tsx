'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function PaymentStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const orderId = searchParams.get('orderId');

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">Your payment has been processed successfully.</p>

          <Button onClick={() => router.push('/download')}>
            Download Your Book
          </Button>
        </div>
      </div>
    );
  }

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
          <Button onClick={() => router.back()}>Try Again</Button>
          <button 
            onClick={() => router.push('/')}
            className="block w-full text-gray-600 hover:text-gray-800 mt-2"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}