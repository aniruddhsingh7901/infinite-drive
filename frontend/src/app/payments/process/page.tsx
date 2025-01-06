// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import QRCode from 'qr-code-styling';

// interface PaymentStatus {
//   success: boolean;
//   status: 'pending' | 'completed' | 'failed';
//   explorerUrl?: string;
//   txHash?: string;
//   downloadToken?: string;
// }

// export default function PaymentProcessPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [error, setError] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
//   const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

//   const orderId = searchParams.get('orderId');
//   const address = searchParams.get('address');
//   const amount = searchParams.get('amount');
//   const currency = searchParams.get('currency');

//   useEffect(() => {
//     let statusInterval: NodeJS.Timeout;
//     let timerInterval: NodeJS.Timeout;

//     const checkPaymentStatus = async () => {
//       try {
//         const response = await fetch(`/api/payments/status/${orderId}`);
//         const data = await response.json();

//         if (data.success) {
//           setPaymentStatus(data);
          
//           if (data.status === 'completed') {
//             clearInterval(statusInterval);
//             clearInterval(timerInterval);
//             setTimeout(() => {
//               if (data.downloadToken) {
//                 router.push(`/download?token=${data.downloadToken}`);
//               }
//             }, 3000);
//           }
//         }
//       } catch (error) {
//         console.error('Status check failed:', error);
//       }
//     };

//     try {
//       if (!orderId || !address || !amount || !currency) {
//         setError(true);
//         return;
//       }

//       // Create QR code
//       const qr = new QRCode({
//         width: 320,
//         height: 320,
//         data: `${currency}:${address}?amount=${amount}`,
//         dotsOptions: {
//           color: '#2563eb',
//           type: 'rounded'
//         },
//         backgroundOptions: {
//           color: '#ffffff',
//         },
//         cornersSquareOptions: {
//           color: '#1e40af',
//           type: 'extra-rounded'
//         },
//         cornersDotOptions: {
//           color: '#1e40af',
//           type: 'dot'
//         },
//       });

//       const container = document.getElementById('qrcode');
//       if (container) {
//         container.innerHTML = '';
//         qr.append(container);
//       }

//       // Start timer countdown
//       timerInterval = setInterval(() => {
//         setTimeLeft((prev) => {
//           if (prev <= 0) {
//             clearInterval(timerInterval);
//             setError(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       // Start status checking
//       statusInterval = setInterval(checkPaymentStatus, 10000);
//       checkPaymentStatus(); // Initial check

//     } catch (err) {
//       console.error('Payment setup error:', err);
//       setError(true);
//     }

//     return () => {
//       if (statusInterval) clearInterval(statusInterval);
//       if (timerInterval) clearInterval(timerInterval);
//     };
//   }, [orderId, address, amount, currency, router]);

//   if (paymentStatus?.status === 'completed') {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//         <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl text-center">
//           <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8">
//             <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Payment Successful!</h2>
//           <p className="text-gray-600 mb-8">Your payment has been confirmed.</p>
          
//           {paymentStatus.explorerUrl && (
//             <a
//               href={paymentStatus.explorerUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 hover:text-blue-800 underline block mb-6"
//             >
//               View Transaction on Explorer
//             </a>
//           )}
          
//           <p className="text-sm text-gray-500">Redirecting to download page...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || timeLeft === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//         <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
//           <div className="text-center">
//             <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-8">
//               <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </div>
//             <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Payment Failed</h2>
//             <p className="text-gray-600 mb-8">We couldn't process your payment. Please try again.</p>
            
//             <div className="bg-gray-50 rounded-xl p-6 mb-8">
//               <h3 className="font-semibold text-gray-900 mb-4">Possible Reasons:</h3>
//               <ul className="space-y-3 text-gray-600">
//                 <li className="flex items-center">
//                   <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                   Payment timeout
//                 </li>
//                 <li className="flex items-center">
//                   <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                   Insufficient funds
//                 </li>
//                 <li className="flex items-center">
//                   <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                   Network issues
//                 </li>
//               </ul>
//             </div>
            
//             <div className="flex justify-center space-x-4">
//               <button
//                 onClick={() => router.back()}
//                 className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
//               >
//                 Try Again
//               </button>
//               <button
//                 onClick={() => router.push('/')}
//                 className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
//               >
//                 Return Home
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full mx-auto space-y-8">
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700">
//             <h2 className="text-2xl font-bold text-white text-center">Complete Your Payment</h2>
//           </div>

//           <div className="p-8">
//             <div className="bg-gray-50 rounded-xl p-6 mb-6">
//               <div id="qrcode" className="flex justify-center" />
//             </div>

//             <div className="mb-6">
//               <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-gray-900">
//                 <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
//               </div>
//             </div>

//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Send</label>
//                 <div className="text-2xl font-bold text-gray-900">
//                   {amount} {currency}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">To Address</label>
//                 <div className="bg-gray-50 rounded-lg p-4 break-all font-mono text-sm">
//                   {address}
//                   <button
//                     onClick={() => navigator.clipboard.writeText(address || '')}
//                     className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
//                   >
//                     <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
//                     </svg>
//                     Copy Address
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Status indicator */}
//         <div className="bg-white rounded-lg shadow px-4 py-3">
//           <div className="flex items-center">
//             <div className={`rounded-full h-3 w-3 ${
//               paymentStatus?.status === 'pending' ? 'bg-yellow-400' : 'bg-gray-300'
//             } mr-2`} />
//             <span className="text-sm text-gray-600">
//               {paymentStatus?.status === 'pending' 
//                 ? 'Waiting for payment...' 
//                 : 'Checking payment status...'}
//             </span>
//           </div>
//         </div>

//         <div className="text-center text-sm text-gray-600">
//           <p>Payment will be confirmed automatically once received</p>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import QRCode from 'qr-code-styling';

interface PaymentStatus {
  success: boolean;
  status: 'pending' | 'completed' | 'failed';
  explorerUrl?: string;
  txHash?: string;
  downloadToken?: string;
}

interface CryptoConfig {
  name: string;
  confirmations: number;
  networkFee: string;
  waitTime: string;
  instructions: string;
  explorerUrl: string;
  qrPrefix: string;
}

const CRYPTO_CONFIG: Record<string, CryptoConfig> = {
  BTC: {
    name: 'Bitcoin',
    confirmations: 3,
    networkFee: '~0.0001 BTC',
    waitTime: '10-60 minutes',
    instructions: 'Send exactly the specified amount to the Bitcoin address below',
    explorerUrl: 'https://www.blockchain.com/btc/tx/',
    qrPrefix: 'bitcoin'
  },
  LTC: {
    name: 'Litecoin',
    confirmations: 6,
    networkFee: '~0.001 LTC',
    waitTime: '2-30 minutes',
    instructions: 'Send the exact LTC amount to the following address',
    explorerUrl: 'https://blockchair.com/litecoin/transaction/',
    qrPrefix: 'litecoin'
  },
  TRX: {
    name: 'Tron',
    confirmations: 1,
    networkFee: '~1 TRX',
    waitTime: '1-5 minutes',
    instructions: 'Send TRX to the following address',
    explorerUrl: 'https://tronscan.org/#/transaction/',
    qrPrefix: 'tron'
  },
  SOL: {
    name: 'Solana',
    confirmations: 1,
    networkFee: '~0.000005 SOL',
    waitTime: '1-2 minutes',
    instructions: 'Send SOL to the following Solana address',
    explorerUrl: 'https://solscan.io/tx/',
    qrPrefix: 'solana'
  },
  XMR: {
    name: 'Monero',
    confirmations: 10,
    networkFee: '~0.0001 XMR',
    waitTime: '5-20 minutes',
    instructions: 'Send XMR to the following Monero address',
    explorerUrl: 'https://www.exploremonero.com/transaction/',
    qrPrefix: 'monero'
  },
  DOGE: {
    name: 'Dogecoin',
    confirmations: 6,
    networkFee: '~1 DOGE',
    waitTime: '1-10 minutes',
    instructions: 'Send DOGE to the following address',
    explorerUrl: 'https://dogechain.info/tx/',
    qrPrefix: 'dogecoin'
  },
  USDT: {
    name: 'Tether (TRC20)',
    confirmations: 1,
    networkFee: '~1 TRX',
    waitTime: '1-5 minutes',
    instructions: 'Send USDT (TRC20) to the following Tron address',
    explorerUrl: 'https://tronscan.org/#/transaction/',
    qrPrefix: 'tether'
  }
};

export default function PaymentProcessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  const orderId = searchParams.get('orderId');
  const address = searchParams.get('address');
  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency') || '';
  const cryptoInfo = CRYPTO_CONFIG[currency];

  useEffect(() => {
    let statusInterval: NodeJS.Timeout;
    let timerInterval: NodeJS.Timeout;

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/payments/status/${orderId}`);
        const data = await response.json();

        if (data.success) {
          setPaymentStatus(data);
          
          if (data.status === 'completed') {
            clearInterval(statusInterval);
            clearInterval(timerInterval);
            setTimeout(() => {
              if (data.downloadToken) {
                router.push(`/download?token=${data.downloadToken}`);
              }
            }, 3000);
          }
        }
      } catch (error) {
        console.error('Status check failed:', error);
      }
    };

    try {
      if (!orderId || !address || !amount || !currency || !cryptoInfo) {
        setError(true);
        return;
      }

      // Create QR code with cryptocurrency-specific URI
      const qr = new QRCode({
        width: 320,
        height: 320,
        data: `${cryptoInfo.qrPrefix}:${address}?amount=${amount}`,
        dotsOptions: {
          color: '#2563eb',
          type: 'rounded'
        },
        backgroundOptions: {
          color: '#ffffff',
        },
        cornersSquareOptions: {
          color: '#1e40af',
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

      // Timer countdown
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timerInterval);
            setError(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Status checking
      statusInterval = setInterval(checkPaymentStatus, 10000);
      checkPaymentStatus();

    } catch (err) {
      console.error('Payment setup error:', err);
      setError(true);
    }

    return () => {
      if (statusInterval) clearInterval(statusInterval);
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [orderId, address, amount, currency, cryptoInfo, router]);

  if (paymentStatus?.status === 'completed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8">
            <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-8">Your payment has been confirmed.</p>
          
          {paymentStatus.explorerUrl && (
            <a
              href={paymentStatus.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline block mb-6"
            >
              View Transaction on Explorer
            </a>
          )}
          
          <p className="text-sm text-gray-500">Redirecting to download page...</p>
        </div>
      </div>
    );
  }

  if (error || timeLeft === 0) {
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
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <h2 className="text-2xl font-bold text-white text-center">
              Complete Your {cryptoInfo?.name} Payment
            </h2>
          </div>

          <div className="p-8">
            {/* Network Info */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-blue-900 mb-2">Payment Information</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Required confirmations: {cryptoInfo?.confirmations}</li>
                <li>• Estimated wait time: {cryptoInfo?.waitTime}</li>
                <li>• Network fee: {cryptoInfo?.networkFee}</li>
              </ul>
            </div>

            {/* QR Code */}
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

                        {/* Instructions */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                          <p className="text-gray-700">{cryptoInfo?.instructions}</p>
                        </div>
            
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Send</label>
                            <div className="text-2xl font-bold text-gray-900">
                              {amount} {currency}
                            </div>
                          </div>
            
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">To Address</label>
                            <div className="bg-gray-50 rounded-lg p-4 break-all font-mono text-sm">
                              {address}
                              <button
                                onClick={() => navigator.clipboard.writeText(address || '')}
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
            
                    {/* Status indicator */}
                    <div className="bg-white rounded-lg shadow px-4 py-3">
                      <div className="flex items-center">
                        <div className={`rounded-full h-3 w-3 ${
                          paymentStatus?.status === 'pending' ? 'bg-yellow-400' : 'bg-gray-300'
                        } mr-2`} />
                        <span className="text-sm text-gray-600">
                          {paymentStatus?.status === 'pending' 
                            ? 'Waiting for payment...' 
                            : 'Checking payment status...'}
                        </span>
                      </div>
                    </div>
            
                    <div className="text-center text-sm text-gray-600">
                      <p>Payment will be confirmed automatically once received</p>
                    </div>
                  </div>
                </div>
              );
            }