import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// API Rate Limits
const API_RATE_LIMITS = {
  blockcypher: { tokensPerInterval: 3, interval: 1000 },
  etherscan: { tokensPerInterval: 5, interval: 1000 },
  trongrid: { tokensPerInterval: 5, interval: 1000 },
  solscan: { tokensPerInterval: 5, interval: 1000 }
} as const;

type ApiProvider = keyof typeof API_RATE_LIMITS;

// Cache Configuration
const CACHE_TTL = 30000; // 30 seconds
const cache = new Map<string, {data: any, timestamp: number}>();

interface BlockchainConfig {
  apiUrl: string;
  apiKey: string;
  explorerUrl: string;
  decimals: number;
  minConfirmations: number;
  contractAddress?: string;
}

interface BlockchainConfigs {
  [key: string]: BlockchainConfig;
}

interface Transaction {
  hash: string;
  amount: number;
  value?: number;
  confirmations: number;
  timestamp: number;
  from?: string;
  to: string;
  contractAddress?: string;
  outputs?: Array<{ addresses?: string[], value?: number, amount?: number }>;
}

interface TransactionResponse {
  hash: string;
  amount: string;
  confirmations: number;
  timestamp: number;
}

interface VerificationResult {
  verified: boolean;
  status: 'pending' | 'completed' | 'error';
  message?: string;
  txHash?: string;
  amount?: number;
  confirmations?: number;
  timestamp?: number;
  explorerUrl?: string;
  requestId?: string;
  retryAfter?: string;
}

interface ApiError extends Error {
  response?: {
    status: number;
    headers: Record<string, string>;
    data: any;
  };
}

type SupportedCurrency = 'BTC' | 'ETH' | 'USDT' | 'TRX' | 'LTC' | 'DOGE' | 'SOL' | 'XMR';

interface RateLimit {
  tokensPerInterval: number;
  interval: number;
  lastCheck: number;
  remainingTokens: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface TransactionVerificationParams {
  currency: string;
  address: string;
  amount: number;
  minConfirmations: number;
}

interface TransactionDetails {
  hash: string;
  amount: number;
  confirmations: number;
  timestamp: number;
  from?: string;
  to: string;
  contractAddress?: string;
  status: 'pending' | 'completed' | 'error';
}

interface ApiTransactionResponse {
  hash: string;
  amount: number;
  confirmations: number;
  timestamp: number;
  from: string;
  to: string;
}
export class BlockchainService {
  private readonly config: BlockchainConfigs;
  private readonly rateLimiters: Map<string, RateLimit>;
  private readonly cache: Map<string, CacheEntry<any>>;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 2000;

  constructor() {
    this.config = {
      btc: {
        apiUrl: process.env.BTC_API_URL || 'https://api.blockcypher.com/v1/btc/main',
        apiKey: process.env.BTC_API_KEY || 'e9c8d58031654d68bfe258b84d7f113b',
        explorerUrl: 'https://www.blockchain.com/btc/tx/',
        decimals: 8,
        minConfirmations: 2
      },
      eth: {
        apiUrl: process.env.ETH_API_URL || 'https://api.etherscan.io/api',
        apiKey: process.env.ETH_API_KEY || '',
        explorerUrl: 'https://etherscan.io/tx/',
        decimals: 18,
        minConfirmations: 12
      },
      usdt: {
        apiUrl: process.env.TRON_API_URL || 'https://api.trongrid.io',
        apiKey: process.env.TRON_API_KEY || '',
        explorerUrl: 'https://tronscan.org/#/transaction/',
        decimals: 6,
        minConfirmations: 1,
        contractAddress: process.env.USDT_CONTRACT_ADDRESS
      },
      trx: {
        apiUrl: process.env.TRON_API_URL || 'https://api.trongrid.io',
        apiKey: process.env.TRON_API_KEY || '',
        explorerUrl: 'https://tronscan.org/#/transaction/',
        decimals: 6,
        minConfirmations: 19
      },
      ltc: {
        apiUrl: process.env.LTC_API_URL || 'https://api.blockcypher.com/v1/ltc/main',
        apiKey: process.env.LTC_API_KEY || '',
        explorerUrl: 'https://blockchair.com/litecoin/transaction/',
        decimals: 8,
        minConfirmations: 6
      },
      doge: {
        apiUrl: process.env.DOGE_API_URL || 'https://api.blockcypher.com/v1/doge/main',
        apiKey: process.env.DOGE_API_KEY || '',
        explorerUrl: 'https://dogechain.info/tx/',
        decimals: 8,
        minConfirmations: 6
      },
      sol: {
        apiUrl: process.env.SOL_API_URL || 'https://api.solscan.io',
        apiKey: process.env.SOL_API_KEY || '',
        explorerUrl: 'https://solscan.io/tx/',
        decimals: 9,
        minConfirmations: 1
      },
      xmr: {
        apiUrl: process.env.XMR_API_URL || 'https://api.xmrchain.net',
        apiKey: process.env.XMR_API_KEY || '',
        explorerUrl: 'https://xmrchain.net/tx/',
        decimals: 12,
        minConfirmations: 10
      }
    };

    this.rateLimiters = new Map();
    this.cache = new Map();
    this.initializeRateLimiters();
  }

  private initializeRateLimiters() {
    Object.keys(API_RATE_LIMITS).forEach((api) => {
      this.rateLimiters.set(api, {
        ...API_RATE_LIMITS[api as ApiProvider],
        lastCheck: Date.now(),
        remainingTokens: API_RATE_LIMITS[api as ApiProvider].tokensPerInterval
      });
    });
  }

  async verifyPayment(currency: string, orderAmount: number, paymentAddress: string): Promise<VerificationResult> {
    try {
      // Validate inputs
      if (!this.validateInputs(currency, orderAmount, paymentAddress)) {
        return { verified: false, status: 'error', message: 'Invalid parameters' };
      }
  
      const config = this.config[currency.toLowerCase()];
      const expectedAmount = Math.round(orderAmount * Math.pow(10, config.decimals));
  
      try {
        const txs = await this.getTransactions(currency, paymentAddress);
        
        // Handle rate limiting response
        if (txs === null) {
          return { 
            verified: false, 
            status: 'error', 
            message: 'Rate limit exceeded' 
          };
        }
  
        if (!txs?.length) {
          return { 
            verified: false, 
            status: 'pending', 
            message: 'No transactions found' 
          };
        }
  
        // Find matching transaction
        const matchingTx = txs.find(tx => {
          const outputs = tx.outputs || [];
          return outputs.some(output => 
            output.addresses?.includes(paymentAddress) &&
            (output.value || output.amount) === expectedAmount
          );
        });
  
        if (!matchingTx) {
          return { 
            verified: false, 
            status: 'pending', 
            message: 'Payment not found' 
          };
        }
  
        const status = this.getTransactionStatus(
          matchingTx.confirmations, 
          config.minConfirmations
        );
  
        return {
          verified: status === 'completed',
          status,
          message: status === 'completed' 
            ? 'Payment verified' 
            : `Waiting for confirmations (${matchingTx.confirmations}/${config.minConfirmations})`,
          txHash: matchingTx.hash,
          amount: matchingTx.value || matchingTx.amount,
          confirmations: matchingTx.confirmations
        };
  
      } catch (error: unknown) {
        if ((error as ApiError)?.response?.status === 429) {
          return { 
            verified: false, 
            status: 'error', 
            message: 'Rate limit exceeded' 
          };
        }
        throw error;
      }
  
    } catch (error) {
      console.error('Payment verification error:', error);
      return { 
        verified: false, 
        status: 'error', 
        message: 'Verification failed' 
      };
    }
  }
  
  private validateInputs(currency: string, amount: number, address: string): boolean {
    return Boolean(
      currency && 
      this.config[currency.toLowerCase()] &&
      amount > 0 && 
      address?.length > 0
    );
  }

  private isValidInput(currency: string, amount: number, address: string): boolean {
    return Boolean(
      currency &&
      amount > 0 &&
      amount <= Number.MAX_SAFE_INTEGER &&
      address?.length > 0
    );
  }

  private convertToDisplayAmount(amount: number, decimals: number): number {
    return amount / Math.pow(10, decimals);
  }

getExplorerUrl(currency: string, txHash: string): string {
  const config = this.config[currency.toLowerCase()];
  return config ? `${config.explorerUrl}${txHash}` : '';
}

async getTransactions(currency: string, address: string): Promise<Transaction[]> {
  try {
    const cacheKey = `${currency}-${address}-transactions`;
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) return cachedData;

    const config = this.config[currency.toLowerCase()];
    if (!config) throw new Error(`Unsupported currency: ${currency}`);

    const response = await this.makeApiRequest(currency, address);
    const transactions = this.parseTransactions(currency, response.data);
    
    this.cacheData(cacheKey, transactions);
    return transactions;
  } catch (error) {
    console.error(`Error fetching ${currency} transactions:`, error);
    return [];
  }
}

private async makeApiRequest(currency: string, address: string) {
  const config = this.config[currency.toLowerCase()];
  let endpoint = '';
  let headers = {};

  switch(currency.toUpperCase()) {
    case 'BTC':
      endpoint = `${config.apiUrl}/addrs/${address}/full?token=e9c8d58031654d68bfe258b84d7f113b&includeHex=false`;
      break;

    case 'ETH':
      endpoint = `${config.apiUrl}?module=account&action=txlist&address=${address}&apikey=${config.apiKey}`;
      break;

    case 'TRX':
    case 'USDT':
      endpoint = `${config.apiUrl}/accounts/${address}/transactions`;
      headers = { 'TRON-PRO-API-KEY': config.apiKey };
      break;

    case 'LTC':
      endpoint = `${config.apiUrl}/addrs/${address}/full`;
      if (config.apiKey) {
        endpoint += `?token=${config.apiKey}`;
      }
      break;

    case 'DOGE':
      endpoint = `${config.apiUrl}/address/${address}/full`;
      if (config.apiKey) {
        endpoint += `?token=${config.apiKey}`;
      }
      break;

    case 'SOL':
      endpoint = `${config.apiUrl}/account/transactions?account=${address}`;
      headers = { 'Authorization': `Bearer ${config.apiKey}` };
      break;

    case 'XMR':
      endpoint = `${config.apiUrl}/api/transactions?address=${address}`;
      break;

    default:
      throw new Error(`Unsupported currency: ${currency}`);
  }

  return await axios.get(endpoint, { headers });
}

private parseTransactions(currency: string, data: any): Transaction[] {
  try {
    switch(currency.toUpperCase()) {
      case 'BTC':
        return this.parseBitcoinTransactions(data);
      case 'ETH':
        return this.parseEthereumTransactions(data);
      case 'TRX':
      case 'USDT':
        return this.parseTronTransactions(data);
      case 'LTC':
        return this.parseBitcoinTransactions(data);
      case 'DOGE':
        return this.parseBitcoinTransactions(data);
      case 'SOL':
        return this.parseSolanaTransactions(data);
      case 'XMR':
        return this.parseMoneroTransactions(data);
      default:
        return [];
    }
  } catch (error) {
    console.error(`Error parsing ${currency} transactions:`, error);
    return [];
  }
}

// private parseBitcoinTransactions(data: any): Transaction[] {
//   return data.txs.map((tx: any) => ({
//     hash: tx.hash,
//     amount: tx.out.reduce((sum: number, output: any) => sum + output.value, 0),
//     confirmations: tx.confirmations || 0,
//     timestamp: tx.time * 1000,
//     from: tx.inputs[0]?.prev_out?.addr,
//     to: tx.out[0]?.addr

private parseBitcoinTransactions(data: any): Transaction[] {
  if (!data || !Array.isArray(data.txs)) {
    console.log('Invalid response data from BlockCypher:', data);
    return [];
  }

  return data.txs.map((tx: any) => {
    try {
      // Calculate total output amount
      const totalAmount = tx.outputs?.reduce((sum: number, output: any) => {
        return sum + (output.value || 0);
      }, 0) || 0;

      return {
        hash: tx.hash,
        amount: totalAmount,
        confirmations: tx.confirmations || 0,
        timestamp: new Date(tx.received || tx.time * 1000).getTime(),
        from: tx.inputs?.[0]?.addresses?.[0] || '',
        to: tx.outputs?.[0]?.addresses?.[0] || ''
      };
    } catch (error) {
      console.error('Error parsing BTC transaction:', error, tx);
      return null;
    }
  }).filter((tx: Transaction | null): tx is Transaction => tx !== null);

}

private parseEthereumTransactions(data: any): Transaction[] {
  return data.result.map((tx: any) => ({
    hash: tx.hash,
    amount: parseInt(tx.value),
    confirmations: tx.confirmations || 0,
    timestamp: parseInt(tx.timeStamp) * 1000,
    from: tx.from,
    to: tx.to,
    contractAddress: tx.contractAddress
  }));
}

private parseTronTransactions(data: any): Transaction[] {
  return data.data.map((tx: any) => ({
    hash: tx.txID,
    amount: tx.raw_data.contract[0].parameter.value.amount || 0,
    confirmations: tx.confirmations || 1,
    timestamp: tx.block_timestamp,
    from: tx.raw_data.contract[0].parameter.value.owner_address,
    to: tx.raw_data.contract[0].parameter.value.to_address
  }));
}

private parseMoneroTransactions(data: any): Transaction[] {
  return data.transactions.map((tx: any) => ({
    hash: tx.tx_hash,
    amount: parseInt(tx.amount),
    confirmations: tx.confirmations || 0,
    timestamp: tx.timestamp * 1000,
    from: tx.payment_id || '',
    to: tx.recipient_address
  }));
}

private parseSolanaTransactions(data: any): Transaction[] {
  return data.map((tx: any) => ({
    hash: tx.signature,
    amount: parseInt(tx.lamports || '0'),
    confirmations: tx.confirmations || 1,
    timestamp: (tx.blockTime || Math.floor(Date.now() / 1000)) * 1000,
    from: tx.source,
    to: tx.destination
  }));
}

private findMatchingTransaction(txs: Transaction[], expectedAmount: number, config: BlockchainConfig): Transaction | null {
  if (!Array.isArray(txs)) return null;
  
  return txs.find(tx => {
    // Get amount in smallest unit (satoshis for BTC)
    const txAmount = tx.value || tx.amount;
    // Compare with expected amount
    return txAmount === expectedAmount;
  }) || null;
}

private async verifyPaymentLegacy(currency: string, orderAmount: number, paymentAddress: string): Promise<VerificationResult> {
  try {
    // Input validation
    if (!currency || !orderAmount || !paymentAddress) {
      return { verified: false, status: 'error', message: 'Invalid parameters' };
    }

    const config = this.config[currency.toLowerCase()];
    if (!config) {
      return { verified: false, status: 'error', message: 'Unsupported currency' };
    }

    // Convert amount to smallest unit (e.g. satoshis)
    const expectedAmount = Math.round(orderAmount * Math.pow(10, config.decimals));

    try {
      const txs = await this.getTransactions(currency, paymentAddress);
      
      if (!txs || txs.length === 0) {
        return { verified: false, status: 'pending', message: 'No transactions found' };
      }

      const matchingTx = this.findMatchingTransaction(txs, expectedAmount, config);
      if (!matchingTx) {
        return { verified: false, status: 'pending', message: 'No matching transaction found' };
      }

      // Check confirmations
      if (matchingTx.confirmations < config.minConfirmations) {
        return {
          verified: false,
          status: 'pending',
          message: `Waiting for confirmations (${matchingTx.confirmations}/${config.minConfirmations})`,
          txHash: matchingTx.hash,
          amount: matchingTx.value || matchingTx.amount,
          confirmations: matchingTx.confirmations
        };
      }

      return {
        verified: true,
        status: 'completed',
        message: 'Payment verified',
        txHash: matchingTx.hash,
        amount: matchingTx.value || matchingTx.amount,
        confirmations: matchingTx.confirmations
      };

    } catch (error: any) {
      if (error?.response?.status === 429) {
        return { 
          verified: false, 
          status: 'error', 
          message: 'Rate limit exceeded',
          retryAfter: error.response.headers['retry-after']
        };
      }
      throw error;
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    return { verified: false, status: 'error', message: 'Verification failed' };
  }
}

private async checkRateLimit(api: string): Promise<boolean> {
  const limiter = this.rateLimiters.get(api);
  if (!limiter) return true;

  const now = Date.now();
  const timePassed = now - limiter.lastCheck;
  
  if (timePassed >= limiter.interval) {
    limiter.remainingTokens = limiter.tokensPerInterval;
    limiter.lastCheck = now;
  }

  if (limiter.remainingTokens > 0) {
    limiter.remainingTokens--;
    return true;
  }

  return false;
}
private cacheData(key: string, data: Transaction[]): void {
  this.cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

private getCachedData(key: string): Transaction[] | null {
  const cached = this.cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    this.cache.delete(key);
    return null;
  }
  
  return cached.data;
}

async getTransactionDetails(txHash: string, currency: string): Promise<TransactionDetails | null> {
  try {
    const config = this.config[currency.toLowerCase()];
    if (!config) throw new Error(`Unsupported currency: ${currency}`);

    const endpoint = `${config.explorerUrl}${txHash}`;
    const response = await axios.get<ApiTransactionResponse>(endpoint);
    
    return {
      hash: response.data.hash,
      amount: this.convertToDisplayAmount(response.data.amount, config.decimals),
      confirmations: response.data.confirmations,
      timestamp: response.data.timestamp * 1000,
      from: response.data.from,
      to: response.data.to,
      status: this.getTransactionStatus(response.data.confirmations, config.minConfirmations)
    };
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return null;
  }
}

private getTransactionStatus(confirmations: number, required: number): 'pending' | 'completed' | 'error' {
  if (confirmations >= required) return 'completed';
  if (confirmations > 0) return 'pending';
  return 'error';
}
}

export default new BlockchainService();