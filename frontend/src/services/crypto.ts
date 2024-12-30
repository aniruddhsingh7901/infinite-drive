// First, let's define our types at the top
type CryptoCurrency = 'BTC' | 'ETH' | 'LTC' | 'TRON' | 'MONERO';

export interface CryptoPayment {
  address: string;
  amount: number;
  currency: CryptoCurrency;
  orderId: string;
  status: 'pending' | 'completed' | 'failed';
  timeoutAt: number;
}

interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

// Define our static data with proper typing
const CRYPTO_ADDRESSES: Record<CryptoCurrency, string> = {
  BTC: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
  ETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  LTC: 'LbTjMGN7gELw4KbeyQf6cTCq5oxkhtHGKz',
  TRON: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9',
  MONERO: '44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A'
};

const MINIMUM_PAYMENTS: Record<CryptoCurrency, number> = {
  BTC: 0.0001,
  ETH: 0.01,
  LTC: 0.1,
  TRON: 100,
  MONERO: 0.1
};

// In-memory storage
const payments = new Map<string, CryptoPayment>();

function generateWalletAddress(currency: CryptoCurrency): string {
  return CRYPTO_ADDRESSES[currency];
}

export async function createCryptoPayment(currency: CryptoCurrency, amount: number): Promise<CryptoPayment> {
  const payment: CryptoPayment = {
    address: generateWalletAddress(currency),
    amount,
    currency,
    orderId: `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    status: 'pending',
    timeoutAt: Date.now() + 30 * 60 * 1000
  };

  payments.set(payment.orderId, payment);
  startPaymentMonitoring(payment);

  return payment;
}

export async function checkPaymentStatus(orderId: string): Promise<'pending' | 'completed' | 'failed'> {
  const payment = payments.get(orderId);
  
  if (!payment) {
    throw new Error('Payment not found');
  }

  if (Date.now() > payment.timeoutAt && payment.status === 'pending') {
    payment.status = 'failed';
    payments.set(orderId, payment);
  }

  return payment.status;
}

async function startPaymentMonitoring(payment: CryptoPayment): Promise<void> {
  const checkInterval = setInterval(async () => {
    try {
      const result = await checkBlockchain(payment);
      
      if (result.success) {
        payment.status = 'completed';
        payments.set(payment.orderId, payment);
        clearInterval(checkInterval);
      }

      if (Date.now() > payment.timeoutAt) {
        payment.status = 'failed';
        payments.set(payment.orderId, payment);
        clearInterval(checkInterval);
      }
    } catch (error) {
      console.error('Payment monitoring error:', error);
    }
  }, 10000);
}

async function checkBlockchain(payment: CryptoPayment): Promise<TransactionResult> {
  if (Math.random() < 0.1) {
    return {
      success: true,
      transactionHash: `0x${Math.random().toString(36).substring(7)}`
    };
  }
  return { success: false };
}

export async function validateAddress(currency: CryptoCurrency, address: string): Promise<boolean> {
  return true;
}

export function getMinimumPayment(currency: CryptoCurrency): number {
  return MINIMUM_PAYMENTS[currency];
}

export function formatCryptoAmount(amount: number, currency: CryptoCurrency): string {
  return `${amount.toFixed(8)} ${currency}`;
}

// Export types for use in other files
export type { CryptoCurrency };