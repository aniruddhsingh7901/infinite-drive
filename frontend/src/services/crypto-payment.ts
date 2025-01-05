// Types
export type CryptoCurrency = 'BTC' | 'ETH' | 'LTC' | 'TRON' | 'MONERO' | 'SOL' | 'DOGE' | 'USDT';

export interface PaymentResponse {
  orderId: string;
  paymentAddress: string;
  amount: number;
  currency: CryptoCurrency;
  status: 'pending' | 'completed' | 'failed';
  timeoutAt?: number;
}


export interface CryptoPayment {

  orderId: string;

  amount: number;

  currency: string;

  address: string;

  status: 'pending' | 'processing' | 'completed' | 'failed';

  timeoutAt: number;

}
export async function checkPaymentStatus(orderId: string): Promise<string> {
  const response = await fetch(`/api/payments/${orderId}/status`);
  const data = await response.json();
  return data.status;
}

export function formatCryptoAmount(amount: number, currency: string): string {
  return `${amount} ${currency}`;
}


export interface PaymentStatusResponse {
  status: string;
  downloadToken?: string;
  message: string;
  confirmations?: number;
}

// Static Data
const CRYPTO_ADDRESSES: Record<CryptoCurrency, string> = {
  BTC: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
  ETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  LTC: 'LbTjMGN7gELw4KbeyQf6cTCq5oxkhtHGKz',
  TRON: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9',
  MONERO: '44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A',
  SOL: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
  DOGE: 'DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L',
  USDT: '0x1234567890123456789012345678901234567890'
};

const MINIMUM_PAYMENTS: Record<CryptoCurrency, number> = {
  BTC: 0.0001,
  ETH: 0.01,
  LTC: 0.1,
  TRON: 100,
  MONERO: 0.1,
  SOL: 0.1,
  DOGE: 10,
  USDT: 1
};

const API_URL = 'http://localhost:4000/api';

// Service Implementation
export const cryptoPaymentService = {
  async createPayment(bookId: string, currency: CryptoCurrency, email: string): Promise<PaymentResponse> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/payments/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookId, currency, email })
      });

      if (!response.ok) {
        throw new Error('Payment creation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment creation error:', error);
      throw error;
    }
  },

  async checkPaymentStatus(orderId: string, txHash: string): Promise<PaymentStatusResponse> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/payments/check/${orderId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ txHash })
      });

      if (!response.ok) {
        throw new Error('Payment status check failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment status check error:', error);
      throw error;
    }
  },

  async getPaymentMethods(): Promise<Array<{ id: CryptoCurrency; name: string; symbol: string }>> {
    try {
      const response = await fetch(`${API_URL}/payments/methods`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }
      return await response.json();
    } catch (error) {
      console.error('Get payment methods error:', error);
      throw error;
    }
  },

  validateAddress: (currency: CryptoCurrency, address: string): boolean => {
    return true;
  },

  getMinimumPayment: (currency: CryptoCurrency): number => {
    return MINIMUM_PAYMENTS[currency];
  },

  formatCryptoAmount: (amount: number, currency: CryptoCurrency): string => {
    return `${amount.toFixed(8)} ${currency}`;
  }
};