// const axios = require('axios');

// class BlockchainService {
//     constructor() {
//         this.config = {
//             ton: {
//                 apiUrl: 'https://toncenter.com/api/v2',
//                 apiKey: process.env.TON_API_KEY,
//                 explorerUrl: 'https://tonscan.org/tx/'
//             },
//             btc: {
//                 apiUrl: process.env.BTC_API_URL,
//                 apiKey: process.env.BTC_API_KEY,
//                 explorerUrl: 'https://www.blockchain.com/btc/tx/'
//             },
//             ltc: {
//                 apiUrl: process.env.LTC_API_URL,
//                 apiKey: process.env.LTC_API_KEY,
//                 explorerUrl: 'https://blockchair.com/litecoin/transaction/'
//             },
//             tron: {
//                 apiUrl: process.env.TRON_API_URL,
//                 apiKey: process.env.TRON_API_KEY,
//                 explorerUrl: 'https://tronscan.org/#/transaction/'
//             },
//             xmr: {
//                 apiUrl: process.env.XMR_API_URL,
//                 apiKey: process.env.XMR_API_KEY,
//                 explorerUrl: 'https://www.exploremonero.com/transaction/'
//             },
//             sol: {
//                 apiUrl: process.env.SOL_API_URL,
//                 apiKey: process.env.SOL_API_KEY,
//                 explorerUrl: 'https://solscan.io/tx/'
//             },
//             doge: {
//                 apiUrl: process.env.DOGE_API_URL,
//                 apiKey: process.env.DOGE_API_KEY,
//                 explorerUrl: 'https://dogechain.info/tx/'
//             }
//         };
//     }

//     // async verifyPayment(currency, orderAmount, paymentAddress) {
//     //     switch (currency.toUpperCase()) {
//     //         case 'TON':
//     //             return this.verifyTonTransaction(orderAmount, paymentAddress);
//     //         case 'BTC':
//     //             return this.verifyBitcoinTransaction(orderAmount, paymentAddress);
//     //         case 'LTC':
//     //             return this.verifyLitecoinTransaction(orderAmount, paymentAddress);
//     //         case 'USDT':
//     //         case 'TRX':
//     //             return this.verifyTronTransaction(orderAmount, paymentAddress);
//     //         case 'XMR':
//     //             return this.verifyMoneroTransaction(orderAmount, paymentAddress);
//     //         case 'SOL':
//     //             return this.verifySolanaTransaction(orderAmount, paymentAddress);
//     //         case 'DOGE':
//     //             return this.verifyDogecoinTransaction(orderAmount, paymentAddress);
//     //         default:
//     //             throw new Error('Unsupported cryptocurrency');
//     //     }
//     // }
//     async verifyPayment(currency, orderAmount, paymentAddress) {
//       try {
//           // Input validation
//           if (!currency || !orderAmount || !paymentAddress) {
//               throw new Error('Missing required payment parameters');
//           }
  
//           // Normalize currency
//           const normalizedCurrency = String(currency).toUpperCase();
          
//           // Validate amount
//           if (isNaN(orderAmount) || orderAmount <= 0) {
//               throw new Error('Invalid order amount');
//           }
  
//           // Address validation
//           if (typeof paymentAddress !== 'string' || paymentAddress.trim().length === 0) {
//               throw new Error('Invalid payment address');
//           }
  
//           console.log(`Verifying payment: ${normalizedCurrency}, Amount: ${orderAmount}, Address: ${paymentAddress}`);
  
//           switch (normalizedCurrency) {
//               case 'TON':
//                   return await this.verifyTonTransaction(orderAmount, paymentAddress);
//               case 'BTC':
//                   return await this.verifyBitcoinTransaction(orderAmount, paymentAddress);
//               case 'LTC':
//                   return await this.verifyLitecoinTransaction(orderAmount, paymentAddress);
//               case 'USDT':
//               case 'TRX':
//                   return await this.verifyTronTransaction(orderAmount, paymentAddress);
//               case 'XMR':
//                   return await this.verifyMoneroTransaction(orderAmount, paymentAddress);
//               case 'SOL':
//                   return await this.verifySolanaTransaction(orderAmount, paymentAddress);
//               case 'DOGE':
//                   return await this.verifyDogecoinTransaction(orderAmount, paymentAddress);
//               default:
//                   throw new Error(`Unsupported cryptocurrency: ${normalizedCurrency}`);
//           }
//       } catch (error) {
//           console.error('Payment verification error:', error);
//           throw new Error(`Payment verification failed: ${error.message}`);
//       }
//   }
//     async verifyTonTransaction(orderAmount, paymentAddress) {
//         try {
//             const oneHourAgo = Math.floor(Date.now() / 1000) - 3600;
            
//             const response = await axios.get(`${this.config.ton.apiUrl}/getTransactions`, {
//                 params: {
//                     address: paymentAddress,
//                     limit: 50,
//                     to_lt: 0,
//                     arch: false
//                 },
//                 headers: {
//                     'X-API-Key': this.config.ton.apiKey
//                 }
//             });

//             const transactions = response.data.result;
//             for (const tx of transactions) {
//                 if (
//                     tx.in_msg?.value && 
//                     tx.in_msg.source &&
//                     Number(tx.in_msg.value) >= orderAmount &&
//                     tx.utime >= oneHourAgo
//                 ) {
//                     return {
//                         verified: true,
//                         txHash: tx.transaction_id.hash,
//                         amount: tx.in_msg.value,
//                         sender: tx.in_msg.source,
//                         timestamp: tx.utime,
//                         explorerUrl: this.config.ton.explorerUrl + tx.transaction_id.hash
//                     };
//                 }
//             }
//             return { verified: false };
//         } catch (error) {
//             console.error('TON verification error:', error);
//             throw new Error('Failed to verify TON transaction');
//         }
//     }

//     async verifyBitcoinTransaction(orderAmount, paymentAddress) {
//         try {
//             const response = await axios.get(`${this.config.btc.apiUrl}/address/${paymentAddress}`, {
//                 headers: { 'X-Api-Key': this.config.btc.apiKey }
//             });

//             const transactions = response.data.txrefs || [];
//             const recentTx = transactions.find(tx => 
//                 tx.value >= orderAmount * 1e8 && // Convert to satoshis
//                 tx.confirmations > 0 &&
//                 Date.now() - new Date(tx.confirmed).getTime() < 3600000 // Within last hour
//             );

//             if (recentTx) {
//                 return {
//                     verified: true,
//                     txHash: recentTx.tx_hash,
//                     amount: recentTx.value / 1e8,
//                     confirmations: recentTx.confirmations,
//                     timestamp: new Date(recentTx.confirmed).getTime() / 1000,
//                     explorerUrl: this.config.btc.explorerUrl + recentTx.tx_hash
//                 };
//             }
//             return { verified: false };
//         } catch (error) {
//             console.error('Bitcoin verification error:', error);
//             throw new Error('Failed to verify Bitcoin transaction');
//         }
//     }

//     async verifyTronTransaction(orderAmount, paymentAddress) {
//         try {
//             const response = await axios.get(`${this.config.tron.apiUrl}/accounts/${paymentAddress}/transactions`, {
//                 headers: { 'TRON-PRO-API-KEY': this.config.tron.apiKey }
//             });

//             const transactions = response.data.data || [];
//             const recentTx = transactions.find(tx => 
//                 tx.raw_data.contract[0].parameter.value.amount >= orderAmount * 1e6 && // Convert to TRX units
//                 tx.ret[0].contractRet === 'SUCCESS' &&
//                 Date.now() - tx.block_timestamp < 3600000 // Within last hour
//             );

//             if (recentTx) {
//                 return {
//                     verified: true,
//                     txHash: recentTx.txID,
//                     amount: recentTx.raw_data.contract[0].parameter.value.amount / 1e6,
//                     timestamp: recentTx.block_timestamp / 1000,
//                     explorerUrl: this.config.tron.explorerUrl + recentTx.txID
//                 };
//             }
//             return { verified: false };
//         } catch (error) {
//             console.error('Tron verification error:', error);
//             throw new Error('Failed to verify Tron transaction');
//         }
//     }

//     async verifySolanaTransaction(orderAmount, paymentAddress) {
//         try {
//             const response = await axios.get(`${this.config.sol.apiUrl}/account/transactions`, {
//                 params: {
//                     account: paymentAddress,
//                     limit: 50
//                 },
//                 headers: {
//                     'Authorization': `Bearer ${this.config.sol.apiKey}`
//                 }
//             });

//             const transactions = response.data || [];
//             const recentTx = transactions.find(tx => 
//                 tx.lamports >= orderAmount * 1e9 && // Convert to lamports
//                 tx.confirmationStatus === 'finalized' &&
//                 Date.now() - tx.blockTime * 1000 < 3600000 // Within last hour
//             );

//             if (recentTx) {
//                 return {
//                     verified: true,
//                     txHash: recentTx.signature,
//                     amount: recentTx.lamports / 1e9,
//                     timestamp: recentTx.blockTime,
//                     explorerUrl: this.config.sol.explorerUrl + recentTx.signature
//                 };
//             }
//             return { verified: false };
//         } catch (error) {
//             console.error('Solana verification error:', error);
//             throw new Error('Failed to verify Solana transaction');
//         }
//     }

//     async verifyLitecoinTransaction(orderAmount, paymentAddress) {
//       try {
//           const response = await axios.get(`${this.config.ltc.apiUrl}/address/${paymentAddress}`, {
//               headers: { 'X-Api-Key': this.config.ltc.apiKey }
//           });

//           const transactions = response.data.txs || [];
//           const recentTx = transactions.find(tx => 
//               tx.amount >= orderAmount &&
//               tx.confirmations >= 6 &&
//               Date.now() - new Date(tx.time * 1000).getTime() < 3600000
//           );

//           if (recentTx) {
//               return {
//                   verified: true,
//                   txHash: recentTx.txid,
//                   amount: recentTx.amount,
//                   confirmations: recentTx.confirmations,
//                   timestamp: recentTx.time,
//                   explorerUrl: this.config.ltc.explorerUrl + recentTx.txid
//               };
//           }
//           return { verified: false };
//       } catch (error) {
//           console.error('Litecoin verification error:', error);
//           throw new Error('Failed to verify Litecoin transaction');
//       }
//   }

//   async verifyMoneroTransaction(orderAmount, paymentAddress) {
//       try {
//           const response = await axios.get(`${this.config.xmr.apiUrl}/get_address_txs`, {
//               params: {
//                   address: paymentAddress,
//                   view_key: process.env.XMR_VIEW_KEY
//               }
//           });

//           const transactions = response.data.transactions || [];
//           const recentTx = transactions.find(tx => 
//               tx.amount >= orderAmount &&
//               tx.confirmations >= 10 &&
//               Date.now() - new Date(tx.timestamp * 1000).getTime() < 3600000
//           );

//           if (recentTx) {
//               return {
//                   verified: true,
//                   txHash: recentTx.hash,
//                   amount: recentTx.amount,
//                   confirmations: recentTx.confirmations,
//                   timestamp: recentTx.timestamp,
//                   explorerUrl: this.config.xmr.explorerUrl + recentTx.hash
//               };
//           }
//           return { verified: false };
//       } catch (error) {
//           console.error('Monero verification error:', error);
//           throw new Error('Failed to verify Monero transaction');
//       }
//   }

//   async verifyDogecoinTransaction(orderAmount, paymentAddress) {
//       try {
//           const response = await axios.get(`${this.config.doge.apiUrl}/address/${paymentAddress}`, {
//               headers: { 'X-Api-Key': this.config.doge.apiKey }
//           });

//           const transactions = response.data.txs || [];
//           const recentTx = transactions.find(tx => 
//               tx.amount >= orderAmount &&
//               tx.confirmations >= 6 &&
//               Date.now() - new Date(tx.time * 1000).getTime() < 3600000
//           );

//           if (recentTx) {
//               return {
//                   verified: true,
//                   txHash: recentTx.txid,
//                   amount: recentTx.amount,
//                   confirmations: recentTx.confirmations,
//                   timestamp: recentTx.time,
//                   explorerUrl: this.config.doge.explorerUrl + recentTx.txid
//               };
//           }
//           return { verified: false };
//       } catch (error) {
//           console.error('Dogecoin verification error:', error);
//           throw new Error('Failed to verify Dogecoin transaction');
//       }
//   }

//   getExplorerUrl(currency, txHash) {
//       const config = this.config[currency.toLowerCase()];
//       return config ? config.explorerUrl + txHash : null;
//   }
// }

// module.exports = new BlockchainService();


const axios = require('axios');

class BlockchainService {
    constructor() {
        this.config = {
            ton: {
                apiUrl: 'https://toncenter.com/api/v2',
                apiKey: process.env.TON_API_KEY,
                explorerUrl: 'https://tonscan.org/tx/',
                decimals: 9
            },
            btc: {
                apiUrl: 'https://api.blockchair.com/bitcoin',
                apiKey: process.env.BTC_API_KEY,
                explorerUrl: 'https://www.blockchain.com/btc/tx/',
                decimals: 8
            },
            ltc: {
                apiUrl: process.env.LTC_API_URL,
                apiKey: process.env.LTC_API_KEY,
                explorerUrl: 'https://blockchair.com/litecoin/transaction/',
                decimals: 8
            },
            tron: {
                apiUrl: 'https://api.trongrid.io/v1',
                apiKey: process.env.TRON_API_KEY,
                explorerUrl: 'https://tronscan.org/#/transaction/',
                decimals: 6,
                usdtContract: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
            },
            xmr: {
                apiUrl: process.env.XMR_API_URL,
                apiKey: process.env.XMR_API_KEY,
                explorerUrl: 'https://www.exploremonero.com/transaction/',
                decimals: 12
            },
            sol: {
                apiUrl: process.env.SOL_API_URL,
                apiKey: process.env.SOL_API_KEY,
                explorerUrl: 'https://solscan.io/tx/',
                decimals: 9
            },
            doge: {
                apiUrl: process.env.DOGE_API_URL,
                apiKey: process.env.DOGE_API_KEY,
                explorerUrl: 'https://dogechain.info/tx/',
                decimals: 8
            }
        };
    }

    async verifyPayment(currency, orderAmount, paymentAddress) {
        try {
            if (!currency || !orderAmount || !paymentAddress) {
                throw new Error('Missing required payment parameters');
            }

            const normalizedCurrency = String(currency).toUpperCase();
            
            if (isNaN(orderAmount) || orderAmount <= 0) {
                throw new Error('Invalid order amount');
            }

            console.log(`Verifying payment: ${normalizedCurrency}, Amount: ${orderAmount}, Address: ${paymentAddress}`);

            switch (normalizedCurrency) {
                case 'TON':
                    return await this.verifyTonTransaction(orderAmount, paymentAddress);
                case 'BTC':
                    return await this.verifyBitcoinTransaction(orderAmount, paymentAddress);
                case 'LTC':
                    return await this.verifyLitecoinTransaction(orderAmount, paymentAddress);
                case 'USDT':
                    return await this.verifyTronTransaction(orderAmount, paymentAddress, 'USDT');
                case 'TRX':
                    return await this.verifyTronTransaction(orderAmount, paymentAddress);
                case 'XMR':
                    return await this.verifyMoneroTransaction(orderAmount, paymentAddress);
                case 'SOL':
                    return await this.verifySolanaTransaction(orderAmount, paymentAddress);
                case 'DOGE':
                    return await this.verifyDogecoinTransaction(orderAmount, paymentAddress);
                default:
                    throw new Error(`Unsupported cryptocurrency: ${normalizedCurrency}`);
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            return {
                verified: false,
                status: 'error',
                message: error.message
            };
        }
    }

    // Implement individual verification methods for each cryptocurrency
    // TON verification
    async verifyTonTransaction(orderAmount, paymentAddress) {
        try {
            const response = await axios.get(`${this.config.ton.apiUrl}/getTransactions`, {
                params: {
                    address: paymentAddress,
                    limit: 50,
                    to_lt: 0,
                    arch: false
                },
                headers: { 'X-API-Key': this.config.ton.apiKey }
            });

            const transactions = response.data.result;
            const matchingTx = transactions.find(tx => 
                tx.in_msg?.value >= orderAmount * Math.pow(10, this.config.ton.decimals) &&
                Date.now() / 1000 - tx.utime < 3600
            );

            return this.formatVerificationResult(matchingTx, 'ton');
        } catch (error) {
            return this.handleVerificationError('TON');
        }
    }

    // Bitcoin verification
    async verifyBitcoinTransaction(orderAmount, paymentAddress) {
        try {
            const response = await axios.get(`${this.config.btc.apiUrl}/address/${paymentAddress}`, {
                headers: { 'X-Api-Key': this.config.btc.apiKey }
            });

            const transactions = response.data.txrefs || [];
            const matchingTx = transactions.find(tx =>
                tx.value >= orderAmount * Math.pow(10, this.config.btc.decimals) &&
                tx.confirmations > 0 &&
                Date.now() - new Date(tx.confirmed).getTime() < 3600000
            );

            return this.formatVerificationResult(matchingTx, 'btc');
        } catch (error) {
            return this.handleVerificationError('Bitcoin');
        }
    }

    // TRON/USDT verification
    async verifyTronTransaction(orderAmount, paymentAddress, tokenType = null) {
        try {
            const response = await axios.get(
                `${this.config.tron.apiUrl}/accounts/${paymentAddress}/transactions`,
                { headers: { 'TRON-PRO-API-KEY': this.config.tron.apiKey }}
            );

            const transactions = response.data.data || [];
            const matchingTx = transactions.find(tx => {
                if (tokenType === 'USDT') {
                    return this.verifyUSDTTransaction(tx, orderAmount);
                }
                return this.verifyTRXTransaction(tx, orderAmount);
            });

            return this.formatVerificationResult(matchingTx, 'tron');
        } catch (error) {
            return this.handleVerificationError(tokenType || 'TRON');
        }
    }

    verifyUSDTTransaction(tx, orderAmount) {
        try {
            const contractData = tx.raw_data.contract[0];
            return contractData.type === 'TriggerSmartContract' &&
                   contractData.parameter.value.contract_address === this.config.tron.usdtContract &&
                   contractData.parameter.value.amount / Math.pow(10, this.config.tron.decimals) >= orderAmount;
        } catch (error) {
            return false;
        }
    }

    verifyTRXTransaction(tx, orderAmount) {
        try {
            const contractData = tx.raw_data.contract[0];
            return contractData.type === 'TransferContract' &&
                   contractData.parameter.value.amount / Math.pow(10, this.config.tron.decimals) >= orderAmount;
        } catch (error) {
            return false;
        }
    }

    // Helper methods
    formatVerificationResult(transaction, network) {
        if (!transaction) {
            return {
                verified: false,
                status: 'pending',
                message: 'No matching transaction found'
            };
        }

        return {
            verified: true,
            status: 'completed',
            txHash: transaction.hash || transaction.txID,
            amount: transaction.amount || transaction.value,
            confirmations: transaction.confirmations || 1,
            timestamp: transaction.timestamp || transaction.block_timestamp,
            explorerUrl: this.getExplorerUrl(network, transaction.hash || transaction.txID)
        };
    }

    handleVerificationError(network) {
        return {
            verified: false,
            status: 'error',
            message: `Failed to verify ${network} transaction`
        };
    }

    getExplorerUrl(currency, txHash) {
        const config = this.config[currency.toLowerCase()];
        return config ? config.explorerUrl + txHash : null;
    }
}

module.exports = new BlockchainService();