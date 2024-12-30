'use client';

import { useState } from 'react';
import Button from '@/components/Button';

export default function DownloadPage() {
  const [downloading, setDownloading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'EPUB'>('PDF');

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // This will be connected to backend later
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Simulate download
      window.location.href = `/api/download?format=${selectedFormat}`;
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Download Your Ebook</h1>
          <p className="text-gray-600">
            Select your preferred format and download your ebook
          </p>
        </div>

        <div className="space-y-8">
          {/* Format Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Choose Format
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['PDF', 'EPUB'].map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format as 'PDF' | 'EPUB')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedFormat === format
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="font-medium">{format}</div>
                  <div className="text-sm text-gray-500">Click to select</div>
                </button>
              ))}
            </div>
          </div>

          {/* Download Instructions */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Important Information:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Link expires in 24 hours
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Maximum 3 download attempts
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Available in both formats
              </li>
            </ul>
          </div>

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-4"
          >
            {downloading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Preparing Download...
              </div>
            ) : (
              `Download ${selectedFormat}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}