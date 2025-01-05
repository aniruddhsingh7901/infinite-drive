// src/types/payment.ts
export interface PaymentMethod {
  id: string;
  name: string;
  symbol: string;
}

export interface PaymentDetails {
  orderId: string;
  paymentAddress: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface PaymentStatus {
  status: string;
  downloadToken?: string;
  message: string;
  confirmations?: number;
}