// // src/app/payments/process/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import QRCode from 'qr-code-styling';
// import Button from '@/components/Button';

// export default function PaymentProcessPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [error, setError] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(900);

//   useEffect(() => {
//     try {
//       const orderId = searchParams.get('orderId');
//       const address = searchParams.get('address');
//       const amount = searchParams.get('amount');
//       const currency = searchParams.get('currency');

//       if (!orderId || !address || !amount || !currency) {
//         setError(true);
//         return;
//       }

//       // Create QR code
//       const qr = new QRCode({
//         width: 300,
//         height: 300,
//         data: `${currency}:${address}?amount=${amount}`,
//         dotsOptions: { type: 'dots', color: '#000000' },
//         backgroundOptions: { color: '#FFFFFF' },
//       });

//       const container = document.getElementById('qrcode');
//       if (container) {
//         container.innerHTML = '';
//         qr.append(container);
//       }

//       // Start countdown
//       const timer = setInterval(() => {
//         setTimeLeft((prev) => {
//           if (prev <= 0) {
//             clearInterval(timer);
//             setError(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       return () => clearInterval(timer);
//     } catch (err) {
//       console.error('Payment setup error:', err);
//       setError(true);
//     }
//   }, [searchParams]);

//   if (error) {
//     return (
//       <div className="max-w-md mx-auto p-8 text-center">
//         <div className="mb-8">
//           <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
//             <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h1>
//           <p className="text-gray-600 mb-8">We couldn't process your payment. Please try again.</p>
          
//           <div className="space-y-4">
//             <h2 className="font-semibold">Possible Reasons:</h2>
//             <ul className="text-gray-600">
//               <li>Payment timeout</li>
//               <li>Insufficient funds</li>
//               <li>Network issues</li>
//             </ul>
//           </div>
//         </div>

//         <div className="space-x-4">
//           <Button onClick={() => router.back()}>Try Again</Button>
//           <button className="text-gray-600 hover:text-gray-800" onClick={() => router.push('/')}>
//             Return Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Complete Your Payment</h1>
      
//       <div className="bg-white rounded-lg shadow-lg p-6">
//         <div id="qrcode" className="mb-6 flex justify-center" />
        
//         <div className="space-y-4">
//           <div>
//             <p className="text-sm text-gray-600">Time Remaining</p>
//             <p className="text-xl font-bold">
//               {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-600">Amount</p>
//             <p className="text-xl font-bold">
//               {searchParams.get('amount')} {searchParams.get('currency')}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-600">Address</p>
//             <div className="bg-gray-50 p-3 rounded border">
//               <code className="block text-sm break-all">
//                 {searchParams.get('address')}
//               </code>
//               <button
//                 onClick={() => navigator.clipboard.writeText(searchParams.get('address') || '')}
//                 className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
//               >
//                 Copy Address
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import QRCode from 'qr-code-styling';

export default function PaymentProcessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  useEffect(() => {
    try {
      const orderId = searchParams.get('orderId');
      const address = searchParams.get('address');
      const amount = searchParams.get('amount');
      const currency = searchParams.get('currency');

      if (!orderId || !address || !amount || !currency) {
        setError(true);
        return;
      }

      // Create QR code with enhanced styling
      const qr = new QRCode({
        width: 320,
        height: 320,
        data: `${currency}:${address}?amount=${amount}`,
        dotsOptions: {
          color: '#2563eb', // Blue
          type: 'rounded'
        },
        backgroundOptions: {
          color: '#ffffff',
        },
        cornersSquareOptions: {
          color: '#1e40af', // Darker blue
          type: 'extra-rounded'
        },
        cornersDotOptions: {
          color: '#1e40af',
          type: 'dot'
        },
      });

      const container = document.getElementById('qrcode');
      if (container) {
        container.innerHTML = '';
        qr.append(container);
      }

      const timer = setInterval(() => {
        setTimeLeft((prev) => prev > 0 ? prev - 1 : 0);
      }, 1000);

      return () => clearInterval(timer);
    } catch (err) {
      console.error('Payment setup error:', err);
      setError(true);
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-8">
              <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Payment Failed</h2>
            <p className="text-gray-600 mb-8">We couldn't process your payment. Please try again.</p>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Possible Reasons:</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Payment timeout
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Insufficient funds
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Network issues
                </li>
              </ul>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <h2 className="text-2xl font-bold text-white text-center">Complete Your Payment</h2>
          </div>

          {/* QR Code */}
          <div className="p-8">
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div id="qrcode" className="flex justify-center" />
            </div>

            {/* Timer */}
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-gray-900">
                <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Send</label>
                <div className="text-2xl font-bold text-gray-900">
                  {searchParams.get('amount')} {searchParams.get('currency')}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Address</label>
                <div className="bg-gray-50 rounded-lg p-4 break-all font-mono text-sm">
                  {searchParams.get('address')}
                  <button
                    onClick={() => navigator.clipboard.writeText(searchParams.get('address') || '')}
                    className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                  >
                    <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>Payment will be confirmed automatically once received</p>
        </div>
      </div>
    </div>
  );
}