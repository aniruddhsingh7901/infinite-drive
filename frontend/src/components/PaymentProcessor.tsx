// 'use client';

// import { useState, useEffect } from 'react';
// import { useCart } from '@/lib/cart/CartContext';

// interface PaymentProcessorProps {
//   email: string;
//   cryptocurrency: string;
//   onSuccess: () => void;
//   onFailure: (error: string) => void;
// }

// export default function PaymentProcessor({ 
//   email, 
//   cryptocurrency, 
//   onSuccess, 
//   onFailure 
// }: PaymentProcessorProps) {
//   const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
//   const [walletAddress, setWalletAddress] = useState<string>('');
//   const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
//   const { total } = useCart();

//   useEffect(() => {
//     // Initialize payment
//     initializePayment();

//     // Start countdown timer
//     const timer = setInterval(() => {
//       setTimeRemaining((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           onFailure('Payment timeout');
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const initializePayment = async () => {
//     try {
//       // This would be your actual payment initialization logic
//       const response = await fetch('/api/payments/initialize', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           email,
//           amount: total,
//           cryptocurrency
//         })
//       });

//       const data = await response.json();
//       if (data.walletAddress) {
//         setWalletAddress(data.walletAddress);
//         startPaymentMonitoring(data.paymentId);
//       }
//     } catch (error) {
//       onFailure('Failed to initialize payment');
//     }
//   };

//   const startPaymentMonitoring = async (paymentId: string) => {
//     // In real implementation, this would connect to a WebSocket
//     // For demo, we'll use polling
//     const checkPayment = setInterval(async () => {
//       try {
//         const status = await fetch(`/api/payments/${paymentId}/status`);
//         const data = await status.json();
        
//         if (data.status === 'completed') {
//           clearInterval(checkPayment);
//           setPaymentStatus('completed');
//           onSuccess();
//         }
//       } catch (error) {
//         console.error('Payment check failed:', error);
//       }
//     }, 5000);
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-lg">
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm text-gray-600">Send Payment To:</label>
//             <div className="flex items-center gap-2 mt-1">
//               <input
//                 type="text"
//                 value={walletAddress}
//                 readOnly
//                 className="w-full p-3 bg-gray-50 rounded border"
//               />
//               <button
//                 onClick={() => navigator.clipboard.writeText(walletAddress)}
//                 className="p-2 text-blue-600 hover:text-blue-700"
//               >
//                 Copy
//               </button>
//             </div>
//           </div>
          
//           <div>
//             <label className="block text-sm text-gray-600">Amount:</label>
//             <div className="text-2xl font-bold">{total} {cryptocurrency}</div>
//           </div>

//           <div>
//             <label className="block text-sm text-gray-600">Time Remaining:</label>
//             <div className="text-lg">
//               {Math.floor(timeRemaining / 60)}:
//               {(timeRemaining % 60).toString().padStart(2, '0')}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="border-t pt-4">
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <div className={`
//             w-2 h-2 rounded-full
//             ${paymentStatus === 'pending' ? 'bg-yellow-500' : ''}
//             ${paymentStatus === 'processing' ? 'bg-blue-500' : ''}
//             ${paymentStatus === 'completed' ? 'bg-green-500' : ''}
//             ${paymentStatus === 'failed' ? 'bg-red-500' : ''}
//           `} />
//           {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
//         </div>
//       </div>
//     </div>
//   );
// }