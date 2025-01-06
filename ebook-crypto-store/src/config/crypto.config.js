// src/config/crypto.config.js
const CRYPTO_CONFIG = {
    BTC: {
      name: 'Bitcoin',
      networkFee: '0.0001',
      minConfirmations: 2,
      address: process.env.BTC_ADDRESS,
      explorerUrl: 'https://www.blockchain.com/btc/tx/',
      apiUrl: process.env.BTC_API_URL
    },
    USDT: {
      name: 'Tether (TRC20)',
      networkFee: '1',
      minConfirmations: 1,
      address: process.env.USDT_ADDRESS,
      contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      explorerUrl: 'https://tronscan.org/#/transaction/',
      apiUrl: process.env.TRON_API_URL
    }
  };
  
  module.exports = CRYPTO_CONFIG;