

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { CryptoPayment, checkPaymentStatus } from '@/services/crypto';

// interface PaymentMonitorProps {
//   payment: CryptoPayment;
//   onSuccess: (txHash: string, downloadLink: string) => void;
//   onFailure: () => void;
// }

// export default function PaymentMonitor({ payment, onSuccess, onFailure }: PaymentMonitorProps) {
//   const [timeLeft, setTimeLeft] = useState<number>(
//     Math.max(0, payment.timeoutAt - Date.now())
//   );
//   const [status, setStatus] = useState<'pending' | 'confirming' | 'completed'>('pending');
//   const [confirmations, setConfirmations] = useState(0);

//   useEffect(() => {
//     // Countdown timer
//     const timer = setInterval(() => {
//       const newTimeLeft = Math.max(0, payment.timeoutAt - Date.now());
//       setTimeLeft(newTimeLeft);
      
//       if (newTimeLeft === 0) {
//         onFailure();
//         clearInterval(timer);
//       }
//     }, 1000);

//     // Payment status checker
//     const statusChecker = setInterval(async () => {
//       try {
//         const response = await checkPaymentStatus(payment.orderId);
//         const { status, txHash, downloadLink } = response;

//         if (status === 'completed') {
//           setStatus('completed');
//           clearInterval(statusChecker);
//           clearInterval(timer);
//           onSuccess(txHash, downloadLink);
//         } else if (status === 'confirming') {
//           setStatus('confirming');
//           setConfirmations(prev => prev + 1);
//         }
//       } catch (error) {
//         console.error('Payment check failed:', error);
//       }
//     }, 5000); // Check every 5 seconds

//     return () => {
//       clearInterval(timer);
//       clearInterval(statusChecker);
//     };
//   }, [payment.orderId, payment.timeoutAt, onSuccess, onFailure]);

//   const minutes = Math.floor(timeLeft / 60000);
//   const seconds = Math.floor((timeLeft % 60000) / 1000);

//   return (
//     <div className="space-y-4">
//       <div>
//         <label className="block text-sm text-gray-600 mb-1">Time Remaining:</label>
//         <div className="text-2xl font-mono">
//           {minutes}:{seconds.toString().padStart(2, '0')}
//         </div>
//       </div>

//       <div className="flex items-center gap-2">
//         <div className={`w-3 h-3 rounded-full ${
//           status === 'completed' ? 'bg-green-500' :
//           status === 'confirming' ? 'bg-blue-500 animate-pulse' :
//           'bg-yellow-500 animate-pulse'
//         }`} />
//         <span className="font-medium">
//           {status === 'completed' ? 'Payment Confirmed!' :
//            status === 'confirming' ? `Confirming (${confirmations} confirmations)` :
//            'Awaiting Payment...'}
//         </span>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { CryptoPayment } from '@/services/crypto';

// interface PaymentMonitorProps {
//   payment: CryptoPayment;
//   onSuccess: (txHash: string, downloadLink: string) => void;
//   onFailure: () => void;
// }

// export default function PaymentMonitor({ payment, onSuccess, onFailure }: PaymentMonitorProps) {
//   const [timeLeft, setTimeLeft] = useState<number>(
//     Math.max(0, payment.timeoutAt - Date.now())
//   );
//   const [status, setStatus] = useState<'pending' | 'confirming' | 'completed'>('pending');
//   const [confirmations, setConfirmations] = useState(0);

//   useEffect(() => {
//     // Countdown timer
//     const timer = setInterval(() => {
//       const newTimeLeft = Math.max(0, payment.timeoutAt - Date.now());
//       setTimeLeft(newTimeLeft);
      
//       if (newTimeLeft === 0) {
//         onFailure();
//         clearInterval(timer);
//       }
//     }, 1000);

//     // WebSocket to listen for payment status updates
//     const ws = new WebSocket('wss://d840-2409-40c4-302a-1c2c-44d8-3dd2-ff2b-e830.ngrok-free.app'); // Adjust the URL as needed
//     console.log("🚀 ~ useEffect ~ ws:", ws)

//     ws.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       console.log("🚀 ~ useEffect ~ message:", message)
//       if (message.event === 'paymentStatus' && message.data.orderId === payment.orderId) {
//         const { status, txHash, downloadLink } = message.data;
//         if (status === 'completed') {
//           setStatus('completed');
//           clearInterval(timer);
//           onSuccess(txHash, downloadLink);
//         } else if (status === 'confirming') {
//           setStatus('confirming');
//           setConfirmations(prev => prev + 1);
//         }
//       }
//     };

//     return () => {
//       clearInterval(timer);
//       ws.close();
//     };
//   }, [payment.orderId, payment.timeoutAt, onSuccess, onFailure]);

//   const minutes = Math.floor(timeLeft / 60000);
//   const seconds = Math.floor((timeLeft % 60000) / 1000);

//   return (
//     <div className="space-y-4">
//       <div>
//         <label className="block text-sm text-gray-600 mb-1">Time Remaining:</label>
//         <div className="text-2xl font-mono">
//           {minutes}:{seconds.toString().padStart(2, '0')}
//         </div>
//       </div>

//       <div className="flex items-center gap-2">
//         <div className={`w-3 h-3 rounded-full ${
//           status === 'completed' ? 'bg-green-500' :
//           status === 'confirming' ? 'bg-blue-500 animate-pulse' :
//           'bg-yellow-500 animate-pulse'
//         }`} />
//         <span className="font-medium">
//           {status === 'completed' ? 'Payment Confirmed!' :
//            status === 'confirming' ? `Confirming (${confirmations} confirmations)` :
//            'Awaiting Payment...'}
//         </span>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { CryptoPayment } from '@/services/crypto';

// interface PaymentMonitorProps {
//   payment: CryptoPayment;
//   onSuccess: (txHash: string, downloadLink: string) => void;
//   onFailure: () => void;
// }

// export default function PaymentMonitor({ payment, onSuccess, onFailure }: PaymentMonitorProps) {
//   const [timeLeft, setTimeLeft] = useState<number>(
//     Math.max(0, payment.timeoutAt - Date.now())
//   );
//   const [status, setStatus] = useState<'pending' | 'confirming' | 'completed'>('pending');
//   const [confirmations, setConfirmations] = useState(0);
//   const router = useRouter();

//   useEffect(() => {
//     // Countdown timer
//     const timer = setInterval(() => {
//       const newTimeLeft = Math.max(0, payment.timeoutAt - Date.now());
//       setTimeLeft(newTimeLeft);
      
//       if (newTimeLeft === 0) {
//         onFailure();
//         clearInterval(timer);
//       }
//     }, 1000);

//     // WebSocket to listen for payment status updates
//     const ws = new WebSocket('wss://d840-2409-40c4-302a-1c2c-44d8-3dd2-ff2b-e830.ngrok-free.app'); // Replace with your ngrok URL

//     ws.onopen = () => {
//       console.log('WebSocket connection established');
//     };

//     ws.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     ws.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       console.log("🚀 ~ useEffect ~ message:", message);
//       if (message.event === 'paymentStatus' && message.data.orderId === payment.orderId) {
//         const { status, txHash, downloadLink } = message.data;
//         if (status === 'completed') {
//           setStatus('completed');
//           clearInterval(timer);
//           onSuccess(txHash, downloadLink);
//         } else if (status === 'confirming') {
//           setStatus('confirming');
//           setConfirmations(prev => prev + 1);
//         }
//       }
//     };

//     // Cleanup on component unmount
//     return () => {
//       clearInterval(timer);
//       ws.close();
//     };
//   }, [payment.orderId, payment.timeoutAt, onSuccess, onFailure]);

//   const minutes = Math.floor(timeLeft / 60000);
//   const seconds = Math.floor((timeLeft % 60000) / 1000);

//   return (
//     <div className="space-y-4">
//       <div>
//         <label className="block text-sm text-gray-600 mb-1">Time Remaining:</label>
//         <div className="text-2xl font-mono">
//           {minutes}:{seconds.toString().padStart(2, '0')}
//         </div>
//       </div>

//       <div className="flex items-center gap-2">
//         <div className={`w-3 h-3 rounded-full ${
//           status === 'completed' ? 'bg-green-500' :
//           status === 'confirming' ? 'bg-blue-500 animate-pulse' :
//           'bg-yellow-500 animate-pulse'
//         }`} />
//         <span className="font-medium">
//           {status === 'completed' ? 'Payment Confirmed!' :
//            status === 'confirming' ? `Confirming (${confirmations} confirmations)` :
//            'Awaiting Payment...'}
//         </span>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CryptoPayment } from '@/services/crypto';

interface PaymentMonitorProps {
  payment: CryptoPayment;
  onSuccess: (txHash: string, downloadLink: string) => void;
  onFailure: () => void;
}

export default function PaymentMonitor({ payment, onSuccess, onFailure }: PaymentMonitorProps) {
  const [timeLeft, setTimeLeft] = useState<number>(
    Math.max(0, payment.timeoutAt - Date.now())
  );
  const [status, setStatus] = useState<'pending' | 'confirming' | 'completed'>('pending');
  const [confirmations, setConfirmations] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Countdown timer
    timerRef.current = setInterval(() => {
      const newTimeLeft = Math.max(0, payment.timeoutAt - Date.now());
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft === 0) {
        onFailure();
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 1000);

    // WebSocket to listen for payment status updates
    if (!wsRef.current) {
      const ws = new WebSocket('wss://d840-2409-40c4-302a-1c2c-44d8-3dd2-ff2b-e830.ngrok-free.app'); // Replace with your ngrok URL
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      // ws.onerror = (error) => {
      //   console.error('WebSocket error:', error);
      // };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("🚀 ~ useEffect ~ message:", message);
        if (message.event === 'paymentStatus' && message.data.orderId === payment.orderId) {
          const { status, txHash, downloadLink } = message.data;
          if (status === 'completed') {
            setStatus('completed');
            if (timerRef.current) clearInterval(timerRef.current);
            onSuccess(txHash, downloadLink);
          } else if (status === 'confirming') {
            setStatus('confirming');
            setConfirmations(prev => prev + 1);
          }
        }
      };
    }

    // Cleanup on component unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
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