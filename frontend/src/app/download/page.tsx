'use client';

import { useSearchParams } from 'next/navigation';

export default function DownloadPage() {
  const searchParams = useSearchParams();
  const txHash = searchParams.get('txHash');
  const downloadLink = searchParams.get('link');
  const email = searchParams.get('email');

  if (!txHash || !downloadLink || !email) {
    return <div className="text-center text-red-500">Error loading order details.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 animate-bounce">Thank You for Your Purchase!</h1>
          <p className="text-gray-600">
            Your payment has been confirmed. Below are your transaction details and download link.
          </p>
        </div>

        <div className="space-y-4">
          <div className="animate-slide-in">
            <label className="block text-sm text-gray-600 mb-1">Email Address:</label>
            <div className="text-lg font-mono">{email}</div>
          </div>

          <div className="animate-slide-in">
            <label className="block text-sm text-gray-600 mb-1">Transaction Hash:</label>
            <div className="text-lg font-mono">{txHash}</div>
          </div>

          <div className="animate-slide-in">
            <label className="block text-sm text-gray-600 mb-1">Download Link:</label>
            <a href={downloadLink} className="text-blue-600 underline">
              {downloadLink}
            </a>
          </div>

          <div className="text-sm text-gray-600 animate-slide-in">
            Note: This link can only be used once.
          </div>
        </div>
      </div>
    </div>
  );
}