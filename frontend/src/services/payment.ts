// type PaymentDetails = {
//   email: string;
//   amount: number;
//   cryptocurrency: string;
// };

// type PaymentResponse = {
//   success: boolean;
//   walletAddress?: string;
//   error?: string;
// };

// export async function initiatePayment(details: PaymentDetails): Promise<PaymentResponse> {
//   // This is where you'll integrate with your crypto payment processor
//   // For now, returning mock data
//   return {
//     success: true,
//     walletAddress: '0x1234...5678' // Example wallet address
//   };
// }

// export async function verifyPayment(transactionId: string): Promise<boolean> {
//   // This will verify the payment on the blockchain
//   return true;
// }

import axios from 'axios';

export interface PaymentDetails {
  email: string;
  amount: number;
  cryptocurrency: string;
  bookId: string;
}

export interface PaymentResponse {
  success: boolean;
  orderId?: string;
  paymentAddress?: string;
  amount?: string;
  currency?: string;
  qrCodeData?: string;
  networkFee?: string;
  waitTime?: string;
  minConfirmations?: number;
  explorerUrl?: string;
  instructions?: string;
  error?: string;
}

export async function createPayment(details: PaymentDetails): Promise<PaymentResponse> {
  try {
    const response = await axios.post<PaymentResponse>(
      'http://localhost:5000/payment/create',
      details,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    console.error('Payment creation error:', error);
    throw error;
  }
}

export async function checkPaymentStatus(orderId: string): Promise<PaymentResponse> {
  try {
    const response = await axios.get<PaymentResponse>(
      `http://localhost:5000/payment/check/${orderId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Payment status check error:', error);
    throw error;
  }
}