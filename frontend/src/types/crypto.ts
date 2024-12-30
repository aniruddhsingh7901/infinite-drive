export type CryptoCurrency = 'BTC' | 'ETH' | 'LTC' | 'TRON' | 'MONERO';

export interface CryptoPayment {
  address: string;
  amount: number;
  currency: CryptoCurrency;
  orderId: string;
  status: 'pending' | 'completed' | 'failed';
  timeoutAt: number;
}