// src/services/crypto-payment.ts
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export interface PaymentResponse {
  orderId: string;
  paymentAddress: string;
  amount: number;
  currency: string;
  status: string;
}

export const cryptoPaymentService = {
  async createPayment(bookId: string, currency: string, email: string) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post<PaymentResponse>(
        `${API_URL}/payments/create`,
        { bookId, currency, email },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Payment creation failed');
    }
  },

  async checkPaymentStatus(orderId: string, txHash: string) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/payments/check/${orderId}`,
        { txHash },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Payment status check failed');
    }
  },

  async getPaymentMethods() {
    try {
      const response = await axios.get(`${API_URL}/payments/methods`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch payment methods');
    }
  }
};