
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import QRCode from 'qr-code-styling';
// import PaymentMonitor from './PaymentMonitor';

// interface CryptoPaymentProps {
//   orderId: string;
//   currency: string;
//   address: string;
//   amount: number;
//   expiresIn: number;
// }

// export default function CryptoPayment({ 
//   orderId, 
//   currency, 
//   address, 
//   amount, 
//   expiresIn 
// }: CryptoPaymentProps) {
//   const router = useRouter();
//   const [copied, setCopied] = useState(false);
//   const qrRef = useRef<QRCode | null>(null);
  
//   useEffect(() => {
//     // Clear any existing QR code
//     const qrContainer = document.getElementById('qrcode');
//     if (qrContainer) {
//       qrContainer.innerHTML = '';
//     }

//     // Ensure address and amount are properly formatted
//     const formattedAddress = address.replace(/\s+/g, '');
//     const formattedAmount = amount.toFixed(8);

//     // Create new QR code
//     qrRef.current = new QRCode({
//       width: 300,
//       height: 300,
//       data: `bitcoin:${formattedAddress}?amount=${formattedAmount}`,
//       dotsOptions: { color: '#2563eb', type: 'rounded' },
//       backgroundOptions: { color: '#ffffff' },
//     });
    
//     qrRef.current.append(qrContainer!);

//     // Cleanup on unmount
//     return () => {
//       if (qrContainer) {
//         qrContainer.innerHTML = '';
//       }
//     };
//   }, [address, amount, currency]);

//   const payment = {
//     orderId,
//     currency,
//     address,
//     amount,
//     status: 'pending' as 'pending' | 'completed' | 'failed',
//     timeoutAt: Date.now() + (expiresIn * 1000)
//   };

//   const handleSuccess = () => {
//     router.push('/download');
//   };

//   const handleFailure = () => {
//     router.push('/payments/status?error=failed');
//   };

//   const copyToClipboard = async () => {
//     await navigator.clipboard.writeText(address);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="max-w-xl mx-auto">
//       <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
//           <h1 className="text-2xl font-bold text-center">Complete Your Payment</h1>
//           <p className="text-center opacity-90 mt-1">
//             Send exactly {amount} {currency}
//           </p>
//         </div>

//         {/* QR Code */}
//         <div className="p-8">
//           <div className="bg-gray-50 p-6 rounded-xl flex justify-center mb-6">
//             <div id="qrcode" />
//           </div>

//           {/* Payment Details */}
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm text-gray-600 mb-2">
//                 Send Payment To:
//               </label>
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   value={address}
//                   readOnly
//                   className="w-full p-3 bg-gray-50 rounded-lg border font-mono text-sm"
//                 />
//                 <button
//                   onClick={copyToClipboard}
//                   className="p-2.5 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50"
//                 >
//                   {copied ? (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                   ) : (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             <PaymentMonitor
//               payment={payment}
//               onSuccess={handleSuccess}
//               onFailure={handleFailure}
//             />
//           </div>
//         </div>

//         {/* Instructions */}
//         <div className="border-t bg-gray-50 p-6">
//           <h3 className="font-medium mb-3">Payment Instructions:</h3>
//           <ol className="space-y-2 text-sm text-gray-600">
//             <li>1. Copy the address or scan the QR code</li>
//             <li>2. Send exactly {amount} {currency}</li>
//             <li>3. Wait for confirmation (~10-30 mins)</li>
//             <li>4. You'll be redirected automatically</li>
//           </ol>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import QRCode from 'qr-code-styling';
// import PaymentMonitor from './PaymentMonitor';

// interface CryptoPaymentProps {
//   orderId: string;
//   currency: string;
//   address: string;
//   amount: number;
//   expiresIn: number;
// }

// export default function CryptoPayment({ 
//   orderId, 
//   currency, 
//   address, 
//   amount, 
//   expiresIn 
// }: CryptoPaymentProps) {
//   const router = useRouter();
//   const [copied, setCopied] = useState(false);
//   const qrRef = useRef<QRCode | null>(null);
  
//   useEffect(() => {
//     // Clear any existing QR code
//     const qrContainer = document.getElementById('qrcode');
//     if (qrContainer) {
//       qrContainer.innerHTML = '';
//     }

//     // Ensure address and amount are properly formatted
//     const formattedAddress = address.replace(/\s+/g, '');
//     const formattedAmount = amount.toFixed(8);

//     // Create new QR code
//     qrRef.current = new QRCode({
//       width: 300,
//       height: 300,
//       data: `${currency.toLowerCase()}:${formattedAddress}?amount=${formattedAmount}`,
//       dotsOptions: { color: '#2563eb', type: 'rounded' },
//       backgroundOptions: { color: '#ffffff' },
//     });
    
//     qrRef.current.append(qrContainer!);

//     // Cleanup on unmount
//     return () => {
//       if (qrContainer) {
//         qrContainer.innerHTML = '';
//       }
//     };
//   }, [address, amount, currency]);

//   const payment = {
//     orderId,
//     currency,
//     address,
//     amount,
//     status: 'pending' as const,
//     timeoutAt: Date.now() + (expiresIn * 1000)
//   };

//   const handleSuccess = (txHash: string, downloadLink: string) => {
//     router.push(`/download?txHash=${txHash}&link=${downloadLink}`);
//   };

//   const handleFailure = () => {
//     router.push('/payments/status?error=failed');
//   };

//   const copyToClipboard = async () => {
//     await navigator.clipboard.writeText(address);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="max-w-xl mx-auto">
//       <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
//           <h1 className="text-2xl font-bold text-center">Complete Your Payment</h1>
//           <p className="text-center opacity-90 mt-1">
//             Send exactly {amount} {currency} 
//           </p>
//         </div>

//         {/* QR Code */}
//         <div className="p-8">
//           <div className="bg-gray-50 p-6 rounded-xl flex justify-center mb-6">
//             <div id="qrcode" />
//           </div>

//           {/* Payment Details */}
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm text-gray-600 mb-2">
//                 Send Payment To:
//               </label>
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   value={address}
//                   readOnly
//                   className="w-full p-3 bg-gray-50 rounded-lg border font-mono text-sm"
//                 />
//                 <button
//                   onClick={copyToClipboard}
//                   className="p-2.5 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50"
//                 >
//                   {copied ? (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                   ) : (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             <PaymentMonitor
//               payment={payment}
//               onSuccess={handleSuccess}
//               onFailure={handleFailure}
//             />
//           </div>
//         </div>

//         {/* Instructions */}
//         <div className="border-t bg-gray-50 p-6">
//           <h3 className="font-medium mb-3">Payment Instructions:</h3>
//           <ol className="space-y-2 text-sm text-gray-600">
//             <li>1. Copy the address or scan the QR code</li>
//             <li>2. Send exactly {amount} {currency}</li>
//             <li>3. Wait for confirmation (~10-30 mins)</li>
//             <li>4. You'll be redirected automatically</li>
//           </ol>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import QRCode from 'qr-code-styling';
// import PaymentMonitor from './PaymentMonitor';

// interface CryptoPaymentProps {
//   orderId: string;
//   currency: string;
//   address: string;
//   amount: number;
//   expiresIn: number;
//   qrData: string; // Add qrData prop
// }

// export default function CryptoPayment({ 
//   orderId, 
//   currency, 
//   address, 
//   amount, 
//   qrData,
//   expiresIn,
//  // Add qrData prop
// }: CryptoPaymentProps) {
//   console.log("🚀 ~ qrData:", qrData)
//   const router = useRouter();
//   const [copied, setCopied] = useState(false);
//   const qrRef = useRef<QRCode | null>(null);
  
//   useEffect(() => {
//     // Clear any existing QR code
//     const qrContainer = document.getElementById('qrcode');
//     if (qrContainer) {
//       qrContainer.innerHTML = '';
//     }

//     // Create new QR code using qrData
//     qrRef.current = new QRCode({
//       width: 300,
//       height: 300,
//       data: qrData, // Use qrData from props
//       dotsOptions: { color: '#2563eb', type: 'rounded' },
//       backgroundOptions: { color: '#ffffff' },
//     });
    
//     qrRef.current.append(qrContainer!);

//     // Cleanup on unmount
//     return () => {
//       if (qrContainer) {
//         qrContainer.innerHTML = '';
//       }
//     };
//   }, [qrData]);

//   const payment = {
//     orderId,
//     currency,
//     address,
//     amount,
//     qrData,
//     status: 'pending' as const,
//     timeoutAt: Date.now() + (expiresIn * 1000)
//   };

//   const handleSuccess = (txHash: string, downloadLink: string) => {
//     router.push(`/download?txHash=${txHash}&link=${downloadLink}`);
//   };

//   const handleFailure = () => {
//     router.push('/payments/status?error=failed');
//   };

//   const copyToClipboard = async () => {
//     await navigator.clipboard.writeText(address);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="max-w-xl mx-auto">
//       <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
//           <h1 className="text-2xl font-bold text-center">Complete Your Payment</h1>
//           <p className="text-center opacity-90 mt-1">
//             Send exactly {amount} {currency} 
//           </p>
//         </div>

//         {/* QR Code */}
//         <div className="p-8">
//           <div className="bg-gray-50 p-6 rounded-xl flex justify-center mb-6">
//             <div id="qrcode" />
//           </div>

//           {/* Payment Details */}
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm text-gray-600 mb-2">
//                 Send Payment To:
//               </label>
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   value={address}
//                   readOnly
//                   className="w-full p-3 bg-gray-50 rounded-lg border font-mono text-sm"
//                 />
//                 <button
//                   onClick={copyToClipboard}
//                   className="p-2.5 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50"
//                 >
//                   {copied ? (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                   ) : (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             <PaymentMonitor
//               payment={payment}
//               onSuccess={handleSuccess}
//               onFailure={handleFailure}
//             />
//           </div>
//         </div>

//         {/* Instructions */}
//         <div className="border-t bg-gray-50 p-6">
//           <h3 className="font-medium mb-3">Payment Instructions:</h3>
//           <ol className="space-y-2 text-sm text-gray-600">
//             <li>1. Copy the address or scan the QR code</li>
//             <li>2. Send exactly {amount} {currency}</li>
//             <li>3. Wait for confirmation (~10-30 mins)</li>
//             <li>4. You'll be redirected automatically</li>
//           </ol>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qr-code-styling';
import PaymentMonitor from './PaymentMonitor';

interface CryptoPaymentProps {
  orderId: string;
  currency: string;
  address: string;
  amount: number;
  expiresIn: number;
  qrData: string;
}

export default function CryptoPayment({ 
  orderId, 
  currency, 
  address, 
  amount, 
  expiresIn,
  qrData 
}: CryptoPaymentProps) {
  const router = useRouter();
  const qrRef = useRef<QRCode | null>(null);
  
  useEffect(() => {
    // Clear any existing QR code
    const qrContainer = document.getElementById('qrcode');
    if (qrContainer) {
      qrContainer.innerHTML = '';
    }

    // Create new QR code using qrData
    qrRef.current = new QRCode({
      width: 300,
      height: 300,
      data: qrData, // Use qrData from props
      dotsOptions: { color: '#2563eb', type: 'rounded' },
      backgroundOptions: { color: '#ffffff' },
    });
    
    qrRef.current.append(qrContainer!);

    // Cleanup on unmount
    return () => {
      if (qrContainer) {
        qrContainer.innerHTML = '';
      }
    };
  }, [qrData]); // Only depend on qrData

  const payment = {
    orderId,
    currency,
    address,
    amount,
    status: 'pending' as const,
    timeoutAt: Date.now() + (expiresIn * 1000)
  };

  const handleSuccess = (txHash: string, downloadLink: string) => {
    router.push(`/download?txHash=${txHash}&link=${downloadLink}`);
  };

  const handleFailure = () => {
    router.push('/payments/status?error=failed');
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <h1 className="text-2xl font-bold text-center">Complete Your Payment</h1>
          <p className="text-center opacity-90 mt-1">
            Send exactly {amount} {currency} 
          </p>
        </div>

        {/* QR Code */}
        <div className="p-8">
          <div className="bg-gray-50 p-6 rounded-xl flex justify-center mb-6">
            <div id="qrcode" />
          </div>

          {/* Payment Details */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Send Payment To:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={address}
                  readOnly
                  className="w-full p-3 bg-gray-50 rounded-lg border font-mono text-sm"
                />
              </div>
            </div>

            <PaymentMonitor
              payment={payment}
              onSuccess={handleSuccess}
              onFailure={handleFailure}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="border-t bg-gray-50 p-6">
          <h3 className="font-medium mb-3">Payment Instructions:</h3>
          <ol className="space-y-2 text-sm text-gray-600">
            <li>1. Scan the QR code</li>
            <li>2. Send exactly {amount} {currency}</li>
            <li>3. Wait for confirmation (~10-30 mins)</li>
            <li>4. You'll be redirected automatically</li>
          </ol>
        </div>
      </div>
    </div>
  );
}