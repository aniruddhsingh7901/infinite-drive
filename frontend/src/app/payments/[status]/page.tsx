'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/cart/CartContext';
import Link from 'next/link';
import Button from '@/components/Button';

// Define SuccessContent component for better organization
const SuccessContent = () => (
  <div className="text-center space-y-6">
    {/* Success Icon */}
    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto transform scale-100 hover:scale-105 transition-transform">
      <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>

    {/* Success Message */}
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
        Payment Successful!
      </h1>
      <div className="text-gray-600 space-y-2 mt-4">
        <p>Your payment has been processed successfully.</p>
        <p>Check your email for download instructions.</p>
      </div>
    </div>

    {/* Next Steps */}
    <div className="bg-gray-50 p-6 rounded-lg mt-8 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-semibold mb-4 text-lg">What's Next?</h3>
      <ul className="text-left space-y-4 text-gray-600">
        <li className="flex items-center">
          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-100 rounded-full text-green-500 mr-3">
            1
          </span>
          Check your email for download link
        </li>
        <li className="flex items-center">
          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-100 rounded-full text-green-500 mr-3">
            2
          </span>
          Download your ebook in your preferred format
        </li>
        <li className="flex items-center">
          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-100 rounded-full text-green-500 mr-3">
            3
          </span>
          Enjoy your reading!
        </li>
      </ul>
    </div>

    {/* Download Information */}
    <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold mb-3 text-blue-900">Important Information</h3>
      <div className="space-y-2 text-blue-800">
        <p className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Download link expires in 24 hours
        </p>
        <p className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Maximum 3 download attempts
        </p>
      </div>
    </div>

    {/* Return Home Button */}
    <div className="pt-6">
      <Link href="/">
        <Button className="px-8 py-3 transform hover:scale-105 transition-transform">
          Return to Home
        </Button>
      </Link>
    </div>
  </div>
);

// Define FailureContent component for better organization
const FailureContent = () => (
  <div className="text-center space-y-6">
    {/* Failure Icon */}
    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto transform scale-100 hover:scale-105 transition-transform">
      <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>

    {/* Failure Message */}
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
        Payment Failed
      </h1>
      <p className="text-gray-600 mt-4">
        We couldn't process your payment. Please try again.
      </p>
    </div>

    {/* Error Information */}
    <div className="bg-gray-50 p-6 rounded-lg mt-8 shadow-sm">
      <h3 className="font-semibold mb-4 text-lg">Possible Reasons:</h3>
      <ul className="text-left space-y-3 text-gray-600">
        <li className="flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Payment timeout
        </li>
        <li className="flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Insufficient funds
        </li>
        <li className="flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Network issues
        </li>
      </ul>
    </div>

    {/* Action Buttons */}
    <div className="pt-6 space-x-4">
      <Link href="/checkout">
        <Button className="px-8 py-3 transform hover:scale-105 transition-transform">
          Try Again
        </Button>
      </Link>
      <Link href="/">
        <button className="text-gray-600 hover:text-gray-900 transition-colors">
          Return Home
        </button>
      </Link>
    </div>
  </div>
);

// Main Component
export default function PaymentStatus({
  params
}: {
  params: { status: 'success' | 'failure' }
}) {
  const { clearCart } = useCart();

  useEffect(() => {
    if (params.status === 'success') {
      clearCart();
    }
  }, [params.status, clearCart]);

  return (
    <div className="max-w-2xl mx-auto p-8">
      {params.status === 'success' ? <SuccessContent /> : <FailureContent />}
    </div>
  );
}