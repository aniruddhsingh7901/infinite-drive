export const CRYPTO_CONFIG = {
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    address: process.env.BTC_ADDRESS,
    decimals: 8,
    minConfirmations: 2,
    networkFee: '0.0001 BTC',
    waitTime: '10-60 minutes',
    qrFormat: (address: string, amount: string) => 
      `bitcoin:${address}?amount=${parseFloat(amount).toFixed(8)}`
  },
  LTC: {
    name: 'Litecoin',
    symbol: 'LTC', 
    address: process.env.LTC_ADDRESS,
    decimals: 8,
    networkFee: '0.001 LTC',
    waitTime: '2-30 minutes',
    qrFormat: (address: string, amount: string) =>
      `litecoin:${address}?amount=${parseFloat(amount).toFixed(8)}`
  },
  XMR: {
    name: 'Monero',
    symbol: 'XMR',
    address: process.env.XMR_ADDRESS,
    decimals: 12,
    networkFee: '0.0001 XMR',
    waitTime: '20 minutes',
    qrFormat: (address: string, amount: string) =>
      `monero:${address}?tx_amount=${parseFloat(amount).toFixed(12)}`
  },
  SOL: {
    name: 'Solana',
    symbol: 'SOL',
    address: process.env.SOL_ADDRESS,
    decimals: 9,
    networkFee: '0.000005 SOL',
    waitTime: '1-2 minutes',
    qrFormat: (address: string, amount: string) =>
      `solana:${address}?amount=${parseFloat(amount).toFixed(9)}`
  },
  DOGE: {
    name: 'Dogecoin', 
    symbol: 'DOGE',
    address: process.env.DOGE_ADDRESS,
    decimals: 8,
    networkFee: '1 DOGE',
    waitTime: '10 minutes',
    qrFormat: (address: string, amount: string) =>
      `dogecoin:${address}?amount=${parseFloat(amount).toFixed(8)}`
  },
  USDT: {
    name: 'Tether TRC20',
    symbol: 'USDT',
    address: process.env.USDT_ADDRESS,
    decimals: 6,
    networkFee: '1 TRX',
    waitTime: '1-5 minutes',
    qrFormat: (address: string, amount: string) => {
      const amountInUnits = Math.floor(parseFloat(amount) * 1e6);
      return `tron://transfer?toAddress=${address}&amount=${amountInUnits}&token=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`;
    }
  }
};

export default CRYPTO_CONFIG;