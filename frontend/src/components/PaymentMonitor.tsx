// // src/components/PaymentMonitor.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { CryptoPayment, checkPaymentStatus, formatCryptoAmount } from '@/services/crypto'

// interface PaymentMonitorProps {
//   payment: CryptoPayment;
//   onSuccess: () => void;
//   onFailure: () => void;
// }

// export default function PaymentMonitor({ payment, onSuccess, onFailure }: PaymentMonitorProps) {
//   const [timeLeft, setTimeLeft] = useState<number>(
//     Math.max(0, payment.timeoutAt - Date.now())
//   );

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const newTimeLeft = Math.max(0, payment.timeoutAt - Date.now());
//       setTimeLeft(newTimeLeft);
      
//       if (newTimeLeft === 0) {
//         onFailure();
//         clearInterval(timer);
//       }
//     }, 1000);

//     const statusChecker = setInterval(async () => {
//       try {
//         const status = await checkPaymentStatus(payment.orderId);
//         if (status === 'completed') {
//           onSuccess();
//           clearInterval(statusChecker);
//           clearInterval(timer);
//         } else if (status === 'failed') {
//           onFailure();
//           clearInterval(statusChecker);
//           clearInterval(timer);
//         }
//       } catch (error) {
//         console.error('Error checking payment status:', error);
//       }
//     }, 5000);

//     return () => {
//       clearInterval(timer);
//       clearInterval(statusChecker);
//     };
//   }, [payment, onSuccess, onFailure]);

//   const minutes = Math.floor(timeLeft / 60000);
//   const seconds = Math.floor((timeLeft % 60000) / 1000);

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-lg">
//       <h3 className="text-xl font-bold mb-4">Payment Details</h3>
      
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm text-gray-600">Send exactly:</label>
//           <p className="text-2xl font-bold">{payment.amount} {payment.currency}</p>
//         </div>

//         <div>
//           <label className="block text-sm text-gray-600">To address:</label>
//           <div className="flex items-center gap-2">
//             <input
//               type="text"
//               value={payment.address}
//               readOnly
//               className="w-full p-2 bg-gray-50 rounded border"
//             />
//             <button
//               onClick={() => navigator.clipboard.writeText(payment.address)}
//               className="p-2 text-blue-600 hover:text-blue-700"
//             >
//               Copy
//             </button>
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm text-gray-600">Time remaining:</label>
//           <p className="text-xl">
//             {minutes}:{seconds.toString().padStart(2, '0')}
//           </p>
//         </div>

//         <div className="mt-4 pt-4 border-t">
//           <div className="flex items-center gap-2">
//             <div className={`w-3 h-3 rounded-full ${
//               payment.status === 'pending' ? 'bg-yellow-500' :
//               payment.status === 'completed' ? 'bg-green-500' :
//               'bg-red-500'
//             }`} />
//             <span className="capitalize">{payment.status}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { CryptoPayment, checkPaymentStatus } from '@/services/crypto';

interface PaymentMonitorProps {
  payment: CryptoPayment;
  onSuccess: () => void;
  onFailure: () => void;
}

export default function PaymentMonitor({ payment, onSuccess, onFailure }: PaymentMonitorProps) {
  const [timeLeft, setTimeLeft] = useState<number>(
    Math.max(0, payment.timeoutAt - Date.now())
  );
  const [status, setStatus] = useState<'pending' | 'confirming' | 'completed'>('pending');
  const [confirmations, setConfirmations] = useState(0);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      const newTimeLeft = Math.max(0, payment.timeoutAt - Date.now());
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft === 0) {
        onFailure();
        clearInterval(timer);
      }
    }, 1000);

    // Payment status checker
    const statusChecker = setInterval(async () => {
      try {
        const paymentStatus = await checkPaymentStatus(payment.orderId);
        console.log("🚀 ~ statusChecker ~ paymentStatus:", paymentStatus)
        
        if (paymentStatus === 'completed') {
          setStatus('completed');
          clearInterval(statusChecker);
          clearInterval(timer);
          onSuccess();
        } else if (paymentStatus === 'confirming') {
          setStatus('confirming');
          setConfirmations(prev => prev + 1);
        }
      } catch (error) {
        console.error('Payment check failed:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => {
      clearInterval(timer);
      clearInterval(statusChecker);
    };
  }, [payment.orderId, payment.timeoutAt, onSuccess, onFailure]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Time Remaining:</label>
        <div className="text-2xl font-mono">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          status === 'completed' ? 'bg-green-500' :
          status === 'confirming' ? 'bg-blue-500 animate-pulse' :
          'bg-yellow-500 animate-pulse'
        }`} />
        <span className="font-medium">
          {status === 'completed' ? 'Payment Confirmed!' :
           status === 'confirming' ? `Confirming (${confirmations} confirmations)` :
           'Awaiting Payment...'}
        </span>
      </div>
    </div>
  );
}