// import axios from 'axios';
// // import { CRYPTO_CONFIG } from '../config/cryptoConfig';

// interface CoinGeckoResponse {
//   bitcoin?: { [key: string]: number };
//   litecoin?: { [key: string]: number };
//   monero?: { [key: string]: number };
//   solana?: { [key: string]: number };
//   dogecoin?: { [key: string]: number };
//   tether?: { [key: string]: number };
// }

// export class CryptoService {
//   private readonly COINGECKO_API = 'https://api.coingecko.com/api/v3';

//   async getPrices(fiatAmount: number, currency: string = 'usd'): Promise<{[key: string]: number}> {
//     try {
//       const response = await axios.get(
//         `${this.COINGECKO_API}/simple/price?ids=bitcoin,litecoin,monero,solana,dogecoin,tether&vs_currencies=${currency}`
//       );

//       const prices = response.data as CoinGeckoResponse;
//       const cryptoAmounts: {[key: string]: number} = {};

//       if (prices.bitcoin) cryptoAmounts.BTC = fiatAmount / prices.bitcoin[currency];
//       if (prices.litecoin) cryptoAmounts.LTC = fiatAmount / prices.litecoin[currency];
//       if (prices.monero) cryptoAmounts.XMR = fiatAmount / prices.monero[currency];
//       if (prices.solana) cryptoAmounts.SOL = fiatAmount / prices.solana[currency];
//       if (prices.dogecoin) cryptoAmounts.DOGE = fiatAmount / prices.dogecoin[currency];
//       if (prices.tether) cryptoAmounts.USDT = fiatAmount;

//       return cryptoAmounts;
//     } catch (error) {
//       console.error('Error fetching crypto prices:', error);
//       throw new Error('Failed to fetch crypto prices');
//     }
//   }

// //   getNetworkFee(currency: string): string {
// //     return CRYPTO_CONFIG[currency]?.networkFee || '0';
// //   }

// //   formatQRCode(currency: string, address: string, amount: string): string {
// //     const config = CRYPTO_CONFIG[currency];
// //     if (!config) throw new Error('Unsupported currency');
// //     return config.qrFormat(address, amount);
// //   }
// }

import axios from 'axios';

interface CoinGeckoResponse {
  bitcoin?: { [key: string]: number };
  litecoin?: { [key: string]: number };
  monero?: { [key: string]: number };
  solana?: { [key: string]: number };
  dogecoin?: { [key: string]: number };
  tether?: { [key: string]: number };
}

export class CryptoService {
  private readonly COINGECKO_API = 'https://api.coingecko.com/api/v3';

  async getPrices(fiatAmount: number, currency: string = 'usd'): Promise<{[key: string]: number}> {
    try {
      const response = await axios.get(
        `${this.COINGECKO_API}/simple/price?ids=bitcoin,litecoin,monero,solana,dogecoin,tether&vs_currencies=${currency}`
      );

      const prices = response.data as CoinGeckoResponse;
      const cryptoAmounts: {[key: string]: number} = {};

      if (prices.bitcoin) cryptoAmounts.BTC = fiatAmount / prices.bitcoin[currency];
      if (prices.litecoin) cryptoAmounts.LTC = fiatAmount / prices.litecoin[currency];
      if (prices.monero) cryptoAmounts.XMR = fiatAmount / prices.monero[currency];
      if (prices.solana) cryptoAmounts.SOL = fiatAmount / prices.solana[currency];
      if (prices.dogecoin) cryptoAmounts.DOGE = fiatAmount / prices.dogecoin[currency];
      if (prices.tether) cryptoAmounts.USDT = fiatAmount;

      return cryptoAmounts;
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      throw new Error('Failed to fetch crypto prices');
    }
  }

  generateQRCode(currency: string, address: string, amount: number): string {
    switch (currency.toUpperCase()) {
      case 'BTC':
        return `bitcoin:${address}?amount=${amount.toFixed(8)}`;
      case 'LTC':
        return `litecoin:${address}?amount=${amount.toFixed(8)}`;
      default:
        return address;
    }
  }
}