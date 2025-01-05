// src/components/PaymentFlow.tsx
import { useState, useEffect } from 'react';
import { usePayment } from '../context/PaymentContext';
import { cryptoPaymentService, CryptoCurrency, PaymentResponse } from '../services/crypto-payment';
import QRCode from 'react-qr-code';

interface PaymentFlowProps {
 bookId: string;
 email: string;
}

export function PaymentFlow({ bookId, email }: PaymentFlowProps) {
 const { paymentDetails, setPaymentDetails, paymentStatus, setPaymentStatus } = usePayment();
 const [error, setError] = useState<string | null>(null);
 const [paymentMethods, setPaymentMethods] = useState<Array<{
   id: CryptoCurrency;
   name: string;
   symbol: string;
 }>>([]);

 useEffect(() => {
   const loadPaymentMethods = async () => {
     try {
       const methods = await cryptoPaymentService.getPaymentMethods();
       setPaymentMethods(methods);
     } catch (err) {
       setError('Failed to load payment methods');
     }
   };
   loadPaymentMethods();
 }, []);

 const handlePayment = async (currency: CryptoCurrency) => {
   try {
     const response = await cryptoPaymentService.createPayment(bookId, currency, email);
     setPaymentDetails(response);
   } catch (err) {
     setError('Payment initialization failed');
   }
 };

 const checkPaymentStatus = async () => {
   if (!paymentDetails?.orderId) return;
   
   try {
     const status = await cryptoPaymentService.checkPaymentStatus(
       paymentDetails.orderId,
       'transaction_hash'
     );
     setPaymentStatus(status);
   } catch (err) {
     setError('Failed to check payment status');
   }
 };

 useEffect(() => {
   if (paymentDetails?.status === 'pending') {
     const interval = setInterval(checkPaymentStatus, 30000);
     return () => clearInterval(interval);
   }
 }, [paymentDetails]);

 return (
   <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
     {!paymentDetails ? (
       <div className="payment-methods">
         <h2 className="text-2xl font-bold mb-6">Select Payment Method</h2>
         <div className="grid grid-cols-2 gap-4">
           {paymentMethods.map(method => (
             <button
               key={method.id}
               onClick={() => handlePayment(method.id)}
               className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
             >
               <div className="font-medium">{method.name}</div>
               <div className="text-sm text-gray-500">{method.symbol}</div>
             </button>
           ))}
         </div>
       </div>
     ) : (
       <div className="payment-details space-y-6">
         <h2 className="text-2xl font-bold">Payment Details</h2>
         <div className="space-y-2">
           <p className="text-lg">
             Amount: <span className="font-medium">
               {cryptoPaymentService.formatCryptoAmount(paymentDetails.amount, paymentDetails.currency as CryptoCurrency)}
             </span>
           </p>
           <p className="text-lg break-all">
             Address: <span className="font-mono">{paymentDetails.paymentAddress}</span>
           </p>
         </div>
         <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
           <QRCode value={paymentDetails.paymentAddress} size={256} />
         </div>
         <p className="text-center text-gray-600">Scan QR code to pay</p>
       </div>
     )}
     
     {paymentStatus?.downloadToken && (
       <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
         <h3 className="text-green-800 font-bold">Payment Successful!</h3>
         <p>Check your email for the download link.</p>
       </div>
     )}

     {error && (
       <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
         {error}
       </div>
     )}
   </div>
 );
}