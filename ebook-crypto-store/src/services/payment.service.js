
const crypto = require('crypto');
const { pool } = require('../config/database');

class PaymentService {
    constructor() {
        this.supportedCurrencies = {
            USDT: {
                name: 'Tether',
                symbol: 'USDT',
                address: process.env.USDT_ADDRESS,
                decimals: 6,
                minConfirmations: 1,
                networkFee: '1 TRX',
                waitTime: '1-5 minutes',
                qrFormat: (address, amount) => {
                    // Format for TRC20 USDT
                    const amountInUnits = Math.floor(parseFloat(amount) * 1e6);
                    return `tron://transfer?toAddress=${address}&amount=${amountInUnits}&token=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`;
                },
                explorerUrl: 'https://tronscan.org/#/transaction/',
                contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
            },
            TRX: {
                name: 'Tron',
                symbol: 'TRX',
                address: process.env.TRX_ADDRESS,
                decimals: 6,
                minConfirmations: 1,
                networkFee: '1 TRX',
                waitTime: '1-5 minutes',
                qrFormat: (address, amount) => {
                    const amountInSun = Math.floor(parseFloat(amount) * 1e6);
                    return `tron://transfer?toAddress=${address}&amount=${amountInSun}`;
                },
                explorerUrl: 'https://tronscan.org/#/transaction/'
            },
            BTC: {
                name: 'Bitcoin',
                symbol: 'BTC',
                address: process.env.BTC_ADDRESS,
                decimals: 8,
                minConfirmations: 2,
                networkFee: '0.0001 BTC',
                waitTime: '10-60 minutes',
                qrFormat: (address, amount) => `bitcoin:${address}?amount=${parseFloat(amount).toFixed(8)}`,
                explorerUrl: 'https://www.blockchain.com/btc/tx/'
            },
            ETH: {
                name: 'Ethereum',
                symbol: 'ETH',
                address: process.env.ETH_ADDRESS,
                decimals: 18,
                minConfirmations: 12,
                networkFee: '0.005 ETH',
                waitTime: '2-5 minutes',
                qrFormat: (address, amount) => `ethereum:${address}@1?value=${Math.floor(parseFloat(amount) * 1e18)}`,
                explorerUrl: 'https://etherscan.io/tx/'
            },
            BNB: {
                name: 'BNB',
                symbol: 'BNB',
                address: process.env.BNB_ADDRESS,
                decimals: 18,
                minConfirmations: 1,
                networkFee: '0.001 BNB',
                waitTime: '1-3 minutes',
                qrFormat: (address, amount) => `bnb:${address}@56?amount=${parseFloat(amount).toFixed(18)}&network=bsc`,
                explorerUrl: 'https://bscscan.com/tx/'
            }
        };
    }

    formatAmount(amount, decimals) {
        try {
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                throw new Error('Invalid amount');
            }
            return parsedAmount;
        } catch (error) {
            console.error('Amount formatting error:', error);
            throw new Error('Invalid amount format');
        }
    }

    async getPaymentMethods() {
        return Object.entries(this.supportedCurrencies).map(([key, value]) => ({
            id: key,
            name: value.name,
            symbol: value.symbol,
            minConfirmations: value.minConfirmations,
            networkFee: value.networkFee,
            waitTime: value.waitTime
        }));
    }

    async generatePaymentAddress(currency) {
        const currencyConfig = this.supportedCurrencies[currency];
        if (!currencyConfig || !currencyConfig.address) {
            throw new Error('Unsupported currency or missing address');
        }
        return currencyConfig.address;
    }

    formatQRCode(currency, address, amount) {
        const currencyConfig = this.supportedCurrencies[currency];
        if (!currencyConfig) {
            throw new Error('Unsupported currency');
        }

        try {
            const formattedAmount = this.formatAmount(amount);
            const qrData = currencyConfig.qrFormat(address, formattedAmount);
            console.log('Generated QR Data:', { currency, address, amount: formattedAmount, qrData });
            return qrData;
        } catch (error) {
            console.error('QR code formatting error:', error);
            throw new Error(`Failed to generate QR code: ${error.message}`);
        }
    }

    async createPayment(orderId, amount, currency) {
        try {
            const paymentAddress = await this.generatePaymentAddress(currency);
            const formattedAmount = this.formatAmount(amount);
            
            const query = `
                UPDATE orders 
                SET payment_address = $1, 
                    payment_currency = $2,
                    status = 'awaiting_payment',
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $3 
                RETURNING *
            `;
            
            const result = await pool.query(query, [paymentAddress, currency, orderId]);
            const order = result.rows[0];

            const currencyConfig = this.supportedCurrencies[currency];
            return {
                ...order,
                qrCodeData: this.formatQRCode(currency, paymentAddress, formattedAmount),
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

    getExplorerUrl(currency, txHash) {
        return this.supportedCurrencies[currency]?.explorerUrl + txHash;
    }

    async updatePaymentStatus(orderId, status, txHash = null, paidAmount = null) {
        const query = `
            UPDATE orders 
            SET status = $1,
                tx_hash = COALESCE($2, tx_hash),
                paid_amount = COALESCE($3, paid_amount),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4 
            RETURNING *
        `;
        const result = await pool.query(query, [status, txHash, paidAmount, orderId]);
        return result.rows[0];
    }
}

module.exports = new PaymentService();