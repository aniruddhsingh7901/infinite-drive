
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
//   qrData: string;
// }

// export default function CryptoPayment({ 
//   orderId, 
//   currency, 
//   address, 
//   amount, 
//   expiresIn,
//   qrData 
// }: CryptoPaymentProps) {
//   const router = useRouter();
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
//   }, [qrData]); // Only depend on qrData

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
//             <li>1. Scan the QR code</li>
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

  const handleSuccess = (txHash: string, downloadLink: string, email: string) => {
    router.push(`/download?txHash=${txHash}&link=${downloadLink}&email=${email}`);
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
            <li>3. Wait for confirmation (~10-60 mins)</li>
            <li>4. You'll be redirected automatically</li>
          </ol>
        </div>
      </div>
    </div>
  );
}