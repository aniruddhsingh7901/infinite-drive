// import { Sequelize, QueryTypes } from 'sequelize';

// import sequelize from '../config/database';
// import { BlockchainService } from './blockchainService';
// import dotenv from 'dotenv';
// dotenv.config();

// interface CurrencyConfig {
//   name: string;
//   symbol: string;
//   address: string;
//   decimals: number;
//   minConfirmations: number;
//   networkFee: string;
//   waitTime: string;
//   qrFormat: (address: string, amount: string) => string;
//   explorerUrl: string;
//   contractAddress?: string;
// }

// interface SupportedCurrencies {
//   [key: string]: CurrencyConfig;
// }

// interface VerificationResult {
//   verified: boolean;
//   message?: string;
//   hash?: string;
//   amount?: number;
//   confirmations?: number;
//   explorerUrl?: string;
//   completedAt?: Date;
// }

// interface PaymentMethod {
//   id: string;
//   name: string;
//   symbol: string;
//   minConfirmations: number;
//   networkFee: string;
//   waitTime: string;
// }

// interface Order {
//   id: string;
//   payment_address: string;
//   payment_currency: string;
//   status: string;
//   tx_hash?: string;
//   paid_amount?: number;
//   updated_at: Date;
// }

// export class PaymentService {
//   private readonly supportedCurrencies: SupportedCurrencies;
//   private sequelize: Sequelize;
//   private blockchain: any; // TODO: Replace 'any' with proper blockchain service interface

//   constructor() {
//     this.sequelize = sequelize;
//     this.blockchain = new BlockchainService(); // TODO: Import and initialize proper blockchain service
//     this.supportedCurrencies = {
//       USDT: {
//         name: 'Tether',
//         symbol: 'USDT',
//         address: process.env.USDT_ADDRESS || '',
//         decimals: 6,
//         minConfirmations: 1,
//         networkFee: '1 TRX',
//         waitTime: '1-5 minutes',
//         qrFormat: (address: string, amount: string): string => {
//           const amountInUnits = Math.floor(parseFloat(amount) * 1e6);
//           return `tron://transfer?toAddress=${address}&amount=${amountInUnits}&token=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`;
//         },
//         explorerUrl: 'https://tronscan.org/#/transaction/',
//         contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
//       },
//       BTC: {
//         name: 'Bitcoin',
//         symbol: 'BTC',
//         address: process.env.BTC_ADDRESS || '',
//         decimals: 8,
//         minConfirmations: 2,
//         networkFee: '0.0001 BTC',
//         waitTime: '10-60 minutes',
//         qrFormat: (address, amount) => `bitcoin:${address}?amount=${parseFloat(amount).toFixed(8)}`,
//         explorerUrl: 'https://www.blockchain.com/btc/tx/'
//       },
//       LTC: {
//         name: 'Litecoin',
//         symbol: 'LTC',
//         address: process.env.LTC_ADDRESS || '',
//         decimals: 8,
//         minConfirmations: 2,
//         networkFee: '0.001 LTC',
//         waitTime: '5-15 minutes',
//         qrFormat: (address, amount) => `litecoin:${address}?amount=${amount}`,
//         explorerUrl: 'https://blockchair.com/litecoin/transaction/'
//       },
//       XMR: {
//         name: 'Monero',
//         symbol: 'XMR',
//         address: process.env.XMR_ADDRESS || '',
//         decimals: 12,
//         minConfirmations: 10,
//         networkFee: '0.0001 XMR',
//         waitTime: '20 minutes',
//         qrFormat: (address, amount) => `monero:${address}?tx_amount=${amount}`,
//         explorerUrl: 'https://www.exploremonero.com/transaction/'
//       },
//       SOL: {
//         name: 'Solana',
//         symbol: 'SOL',
//         address: process.env.SOL_ADDRESS || '',
//         decimals: 9,
//         minConfirmations: 1,
//         networkFee: '0.000005 SOL',
//         waitTime: '1-2 minutes',
//         qrFormat: (address, amount) => `solana:${address}?amount=${amount}`,
//         explorerUrl: 'https://explorer.solana.com/tx/'
//       },
//       DOGE: {
//         name: 'Dogecoin',
//         symbol: 'DOGE',
//         address: process.env.DOGE_ADDRESS || '',
//         decimals: 8,
//         minConfirmations: 6,
//         networkFee: '1 DOGE',
//         waitTime: '5-10 minutes',
//         qrFormat: (address, amount) => `dogecoin:${address}?amount=${amount}`,
//         explorerUrl: 'https://dogechain.info/tx/'
//       },
//       TRX: {
//         name: 'Tron',
//         symbol: 'TRX',
//         address: process.env.TRX_ADDRESS || '',
//         decimals: 6,
//         minConfirmations: 19,
//         networkFee: '1 TRX',
//         waitTime: '1-3 minutes',
//         qrFormat: (address, amount) => `tron:${address}?amount=${amount}`,
//         explorerUrl: 'https://tronscan.org/#/transaction/'
//       }
//     };
//       // Other currencies follow the same pattern
    
//   }
//   async verifyPayment(
//     paymentAddress: string,
//     expectedAmount: number,
//     currency: string
//   ): Promise<VerificationResult> {
//     try {
//       // Get transaction details from blockchain
//       const transaction = await this.blockchain.getTransaction(paymentAddress, currency);

//       if (!transaction) {
//         return {
//           verified: false,
//           message: 'No transaction found'
//         };
//       }

//       // Verify amount matches
//       const receivedAmount = parseFloat(transaction.amount);
//       if (receivedAmount < expectedAmount) {
//         return {
//           verified: false,
//           amount: receivedAmount,
//           message: 'Insufficient payment amount'
//         };
//       }

//       // Check confirmations
//       const minConfirmations = this.getMinConfirmations(currency);
//       if (transaction.confirmations < minConfirmations) {
//         return {
//           verified: false,
//           confirmations: transaction.confirmations,
//           message: `Waiting for ${minConfirmations - transaction.confirmations} more confirmations`
//         };
//       }

//       // Payment verified
//       return {
//         verified: true,
//         hash: transaction.hash,
//         amount: receivedAmount,
//         confirmations: transaction.confirmations,
//         explorerUrl: this.blockchain.getExplorerUrl(currency, transaction.hash),
//         completedAt: new Date()
//       };

//     } catch (error) {
//       console.error('Payment verification error:', error);
//       return {
//         verified: false,
//         message: error instanceof Error ? error.message : 'Payment verification failed'
//       };
//     }
//   }

//   private getMinConfirmations(currency: string): number {
//     const confirmations: { [key: string]: number } = {
//       'BTC': 3,
//       'LTC': 6,
//       'TRON': 20,
//       'MONERO': 10,
//       'ZCASH': 8,
//       'USDT': 6
//     };
//     return confirmations[currency] || 6;
//   }
//   formatAmount(amount: string | number, decimals?: number): number {
//     try {
//       const parsedAmount = parseFloat(amount.toString());
//       if (isNaN(parsedAmount) || parsedAmount <= 0) {
//         throw new Error('Invalid amount');
//       }
//       return parsedAmount;
//     } catch (error) {
//       console.error('Amount formatting error:', error);
//       throw new Error('Invalid amount format');
//     }
//   }

//   async getPaymentMethods(): Promise<PaymentMethod[]> {
//     return Object.entries(this.supportedCurrencies).map(([key, value]) => ({
//       id: key,
//       name: value.name,
//       symbol: value.symbol,
//       minConfirmations: value.minConfirmations,
//       networkFee: value.networkFee,
//       waitTime: value.waitTime
//     }));
//   }

//   async generatePaymentAddress(currency: string): Promise<string> {
//     const currencyConfig = this.supportedCurrencies[currency];
//     if (!currencyConfig?.address) {
//       throw new Error('Unsupported currency or missing address');
//     }
//     return currencyConfig.address;
//   }

//   formatQRCode(currency: string, address: string, amount: string | number): string {
//     const currencyConfig = this.supportedCurrencies[currency];
//     if (!currencyConfig) {
//       throw new Error('Unsupported currency');
//     }

//     try {
//       const formattedAmount = this.formatAmount(amount);
//       const qrData = currencyConfig.qrFormat(address, formattedAmount.toString());
//       console.log('Generated QR Data:', { currency, address, amount: formattedAmount, qrData });
//       return qrData;
//     } catch (error) {
//       console.error('QR code formatting error:', error);
//       throw new Error(`Failed to generate QR code: ${error instanceof Error ? error.message : String(error)}`);
//     }
//   }

//   // async createPayment(orderId: string, amount: number, currency: string): Promise<Order & {
//   //   qrCodeData: string;
//   //   networkFee: string;
//   //   waitTime: string;
//   //   explorerUrl: string;
//   //   minConfirmations: number;
//   // }> {
//   //   try {
//   //     const paymentAddress = await this.generatePaymentAddress(currency);
//   //     const formattedAmount = this.formatAmount(amount);

//   //     const query = `
//   //      UPDATE orders
//   //      SET payment_address = $1,
//   //          payment_currency = $2,
//   //          status = 'awaiting_payment',
//   //          updated_at = CURRENT_TIMESTAMP
//   //      WHERE id = $3
//   //      RETURNING *
//   //    `;

//   //     const [order] = await this.sequelize.query<Order>(query, {
//   //       replacements: [paymentAddress, currency, orderId],
//   //       type: QueryTypes.SELECT
//   //     });

//   //     const currencyConfig = this.supportedCurrencies[currency];
//   //     return {
//   //       ...order,
//   //       qrCodeData: this.formatQRCode(currency, paymentAddress, formattedAmount),
//   //       networkFee: currencyConfig.networkFee,
//   //       waitTime: currencyConfig.waitTime,
//   //       explorerUrl: currencyConfig.explorerUrl,
//   //       minConfirmations: currencyConfig.minConfirmations
//   //     };
//   //   } catch (error) {
//   //     console.error('Payment creation error:', error);
//   //     throw error;
//   //   }
//   // }
  
//   async createPayment(orderId: string, amount: number, currency: string): Promise<Order & {
//     qrCodeData: string;
//     networkFee: string;
//     waitTime: string;
//     explorerUrl: string;
//     minConfirmations: number;
//   }> {
//     try {
//       const paymentAddress = await this.generatePaymentAddress(currency);
//       const formattedAmount = this.formatAmount(amount);

//       // Use Sequelize's update method instead of raw query
//       const [updatedOrders] = await this.sequelize.models.Order.update(
//         {
//           payment_address: paymentAddress,
//           payment_currency: currency,
//           status: 'awaiting_payment',
//           updated_at: new Date()
//         },
//         {
//           where: { id: orderId },
//           returning: true
//         }
//       );

//       if (!updatedOrders) {
//         throw new Error('Failed to update order');
//       }

//       // Get the updated order
//       const order = await this.sequelize.models.Order.findByPk(orderId);
//       if (!order) {
//         throw new Error('Order not found after update');
//       }

//       const currencyConfig = this.supportedCurrencies[currency];

//       // Generate QR code data
//       const qrCodeData = this.formatQRCode(currency, paymentAddress, formattedAmount);

//       return {
//         ...order.toJSON(),
//         qrCodeData,
//         networkFee: currencyConfig.networkFee,
//         waitTime: currencyConfig.waitTime,
//         explorerUrl: currencyConfig.explorerUrl,
//         minConfirmations: currencyConfig.minConfirmations
//       };

//     } catch (error) {
//       console.error('Payment creation error:', error);
//       throw error;
//     }
//   }

//   getExplorerUrl(currency: string, hash: string): string | undefined {
//     return this.supportedCurrencies[currency]?.explorerUrl + hash;
//   }

//   async updatePaymentStatus(
//     orderId: string,
//     status: string,
//     hash: string | null = null,
//     paidAmount: number | null = null
//   ): Promise<Order> {
//     const query = `
//      UPDATE orders 
//      SET status = $1,
//          tx_hash = COALESCE($2, tx_hash),
//          paid_amount = COALESCE($3, paid_amount),
//          updated_at = CURRENT_TIMESTAMP
//      WHERE id = $4
//      RETURNING *
//    `;
//     const [result] = await this.sequelize.query<Order>(query, {
//       replacements: [status, hash, paidAmount, orderId],
//       type: QueryTypes.SELECT
//     });
//     return result;
//   }
// }

// export default new PaymentService();

import { Sequelize, QueryTypes } from 'sequelize';
import sequelize from '../config/database';
import { BlockchainService } from './blockchainService';
import dotenv from 'dotenv';

dotenv.config();

interface CurrencyConfig {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  minConfirmations: number;
  networkFee: string;
  waitTime: string;
  qrFormat: (address: string, amount: string) => string;
  explorerUrl: string;
  contractAddress?: string;
}

interface SupportedCurrencies {
  [key: string]: CurrencyConfig;
}

interface VerificationResult {
  verified: boolean;
  message?: string;
  hash?: string;
  amount?: number;
  confirmations?: number;
  explorerUrl?: string;
  completedAt?: Date;
}

interface PaymentMethod {
  id: string;
  name: string;
  symbol: string;
  minConfirmations: number;
  networkFee: string;
  waitTime: string;
}

interface Order {
  id: string;
  payment_address: string;
  payment_currency: string;
  status: string;
  tx_hash?: string;
  paid_amount?: number;
  updated_at: Date;
  toJSON: () => any;
}

export class PaymentService {
  private readonly supportedCurrencies: SupportedCurrencies;
  private sequelize: Sequelize;
  private blockchain: BlockchainService;

  constructor() {
    this.sequelize = sequelize;
    this.blockchain = new BlockchainService();
    
    this.supportedCurrencies = {
      BTC: {
        name: 'Bitcoin',
        symbol: 'BTC',
        address: process.env.BTC_ADDRESS || '',
        decimals: 8,
        minConfirmations: 2,
        networkFee: '0.0001 BTC',
        waitTime: '10-60 minutes',
        qrFormat: (address, amount) => `bitcoin:${address}?amount=${this.formatAmount(amount, 8)}`,
        explorerUrl: 'https://www.blockchain.com/btc/tx/'
      },
      LTC: {
        name: 'Litecoin',
        symbol: 'LTC',
        address: process.env.LTC_ADDRESS || '',
        decimals: 8,
        minConfirmations: 2,
        networkFee: '0.001 LTC',
        waitTime: '5-15 minutes',
        qrFormat: (address, amount) => `litecoin:${address}?amount=${this.formatAmount(amount, 8)}`,
        explorerUrl: 'https://blockchair.com/litecoin/transaction/'
      },
      XMR: {
        name: 'Monero',
        symbol: 'XMR',
        address: process.env.XMR_ADDRESS || '',
        decimals: 12,
        minConfirmations: 10,
        networkFee: '0.0001 XMR',
        waitTime: '20 minutes',
        qrFormat: (address, amount) => `monero:${address}?tx_amount=${this.formatAmount(amount, 12)}`,
        explorerUrl: 'https://www.exploremonero.com/transaction/'
      },
      SOL: {
        name: 'Solana',
        symbol: 'SOL',
        address: process.env.SOL_ADDRESS || '',
        decimals: 9,
        minConfirmations: 1,
        networkFee: '0.000005 SOL',
        waitTime: '1-2 minutes',
        qrFormat: (address, amount) => `solana:${address}?amount=${this.formatAmount(amount, 9)}`,
        explorerUrl: 'https://explorer.solana.com/tx/'
      },
      DOGE: {
        name: 'Dogecoin',
        symbol: 'DOGE',
        address: process.env.DOGE_ADDRESS || '',
        decimals: 8,
        minConfirmations: 6,
        networkFee: '1 DOGE',
        waitTime: '5-10 minutes',
        qrFormat: (address, amount) => `dogecoin:${address}?amount=${this.formatAmount(amount, 8)}`,
        explorerUrl: 'https://dogechain.info/tx/'
      },
      TRX: {
        name: 'TRON',
        symbol: 'TRX',
        address: process.env.TRX_ADDRESS || '',
        decimals: 6,
        minConfirmations: 19,
        networkFee: '1 TRX',
        waitTime: '1-3 minutes',
        qrFormat: (address, amount) => `tron:${address}?amount=${this.formatAmount(amount, 6)}`,
        explorerUrl: 'https://tronscan.org/#/transaction/'
      },
      USDT: {
        name: 'Tether',
        symbol: 'USDT',
        address: process.env.USDT_ADDRESS || '',
        decimals: 6,
        minConfirmations: 1,
        networkFee: '1 TRX',
        waitTime: '1-5 minutes',
        qrFormat: (address, amount) => {
          const amountInUnits = Math.floor(parseFloat(amount) * 1e6);
          return `tron://transfer?toAddress=${address}&amount=${amountInUnits}&token=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`;
        },
        explorerUrl: 'https://tronscan.org/#/transaction/',
        contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
      }
    };
  }

  formatAmount(amount: string | number, decimals: number = 8): string {
    try {
      const parsedAmount = parseFloat(amount.toString());
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Invalid amount');
      }
      return parsedAmount.toFixed(decimals);
    } catch (error) {
      console.error('Amount formatting error:', error);
      throw new Error('Invalid amount format');
    }
  }

  async generatePaymentAddress(currency: string): Promise<string> {
    const currencyConfig = this.supportedCurrencies[currency.toUpperCase()];
    if (!currencyConfig?.address) {
      throw new Error(`Unsupported currency ${currency} or missing address`);
    }
    return currencyConfig.address;
  }

  formatQRCode(currency: string, address: string, amount: string | number): string {
    const currencyConfig = this.supportedCurrencies[currency.toUpperCase()];
    if (!currencyConfig) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    try {
      const formattedAmount = this.formatAmount(amount, currencyConfig.decimals);
      const qrData = currencyConfig.qrFormat(address, formattedAmount);
      console.log('Generated QR Data:', { currency, address, amount: formattedAmount, qrData });
      return qrData;
    } catch (error) {
      console.error('QR code formatting error:', error);
      throw new Error(`Failed to generate QR code: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async verifyPayment(
    paymentAddress: string,
    expectedAmount: number,
    currency: string
  ): Promise<VerificationResult> {
    try {
      const transactions = await this.blockchain.getTransactions(paymentAddress, currency);

      if (!transactions || transactions.length === 0) {
        return {
          verified: false,
          message: 'No transaction found'
        };
      }

      const transaction = transactions[0]; // Get the most recent transaction
      const receivedAmount = parseFloat(transaction.amount.toString());
      if (receivedAmount < expectedAmount) {
        return {
          verified: false,
          amount: receivedAmount,
          message: 'Insufficient payment amount'
        };
      }

      const minConfirmations = this.getMinConfirmations(currency);
      if (transaction.confirmations < minConfirmations) {
        return {
          verified: false,
          confirmations: transaction.confirmations,
          message: `Waiting for ${minConfirmations - transaction.confirmations} more confirmations`
        };
      }

      return {
        verified: true,
        hash: transaction.hash,
        amount: receivedAmount,
        confirmations: transaction.confirmations,
        explorerUrl: this.getExplorerUrl(currency, transaction.hash),
        completedAt: new Date()
      };

    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        verified: false,
        message: error instanceof Error ? error.message : 'Payment verification failed'
      };
    }
  }

  private getMinConfirmations(currency: string): number {
    return this.supportedCurrencies[currency.toUpperCase()]?.minConfirmations || 6;
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return Object.entries(this.supportedCurrencies).map(([key, value]) => ({
      id: key,
      name: value.name,
      symbol: value.symbol,
      minConfirmations: value.minConfirmations,
      networkFee: value.networkFee,
      waitTime: value.waitTime
    }));
  }

  async createPayment(orderId: string, amount: number, currency: string): Promise<Order & {
    qrCodeData: string;
    networkFee: string;
    waitTime: string;
    explorerUrl: string;
    minConfirmations: number;
  }> {
    try {
      const upperCurrency = currency.toUpperCase();
      if (!this.supportedCurrencies[upperCurrency]) {
        throw new Error(`Unsupported cryptocurrency: ${currency}`);
      }

      const paymentAddress = await this.generatePaymentAddress(upperCurrency);
      const formattedAmount = this.formatAmount(amount, this.supportedCurrencies[upperCurrency].decimals);

      const [updatedOrders] = await this.sequelize.models.Order.update(
        {
          payment_address: paymentAddress,
          payment_currency: upperCurrency,
          status: 'awaiting_payment',
          updated_at: new Date()
        },
        {
          where: { id: orderId },
          returning: true
        }
      );

      if (!updatedOrders) {
        throw new Error('Failed to update order');
      }

      const order = await this.sequelize.models.Order.findByPk(orderId);
      if (!order) {
        throw new Error('Order not found after update');
      }

      const currencyConfig = this.supportedCurrencies[upperCurrency];
      const qrCodeData = this.formatQRCode(upperCurrency, paymentAddress, formattedAmount);

      return {
        ...order.toJSON(),
        qrCodeData,
        networkFee: currencyConfig.networkFee,
        waitTime: currencyConfig.waitTime,
        explorerUrl: currencyConfig.explorerUrl,
        minConfirmations: currencyConfig.minConfirmations
      };

    } catch (error) {
      console.error('Payment creation error:', error);
      throw error;
    }
  }

  getExplorerUrl(currency: string, hash: string): string | undefined {
    return this.supportedCurrencies[currency.toUpperCase()]?.explorerUrl + hash;
  }

  async updatePaymentStatus(
    orderId: string,
    status: string,
    hash: string | null = null,
    paidAmount: number | null = null
  ): Promise<Order> {
    const query = `
     UPDATE orders 
     SET status = $1,
         tx_hash = COALESCE($2, tx_hash),
         paid_amount = COALESCE($3, paid_amount),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING *
   `;
    const [result] = await this.sequelize.query<Order>(query, {
      replacements: [status, hash, paidAmount, orderId],
      type: QueryTypes.SELECT
    });
    return result;
  }
}

export default new PaymentService();