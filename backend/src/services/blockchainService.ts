import axios, { AxiosResponse } from 'axios';

interface BlockchainConfig {
    apiUrl: string;
    apiKey: string;
    explorerUrl: string;
    decimals: number;
    usdtContract?: string;
}

interface BlockchainConfigs {
    [key: string]: BlockchainConfig;
}

interface VerificationResult {
    verified: boolean;
    status: string;
    message?: string;
    txHash?: string;
    amount?: number;
    confirmations?: number;
    timestamp?: number;
    explorerUrl?: string;
}

interface TonTransaction {
    in_msg?: {
        value: number;
    };
    utime: number;
    hash: string;
}

interface BtcTransaction {
    value: number;
    confirmations: number;
    confirmed: string;
    hash: string;
}

interface TronTransaction {
    raw_data: {
        contract: Array<{
            type: string;
            parameter: {
                value: {
                    contract_address?: string;
                    amount: number;
                };
            };
        }>;
    };
    txID: string;
    block_timestamp: number;
}

export class BlockchainService {
    private readonly config: BlockchainConfigs;

    constructor() {
        this.config = {
            ton: {
                apiUrl: 'https://toncenter.com/api/v2',
                apiKey: process.env.TON_API_KEY!,
                explorerUrl: 'https://tonscan.org/tx/',
                decimals: 9
            },
            // ... other configs
        };
    }

    async verifyPayment(currency: string, orderAmount: number, paymentAddress: string): Promise<VerificationResult> {
        try {
            if (!currency || !orderAmount || !paymentAddress) {
                throw new Error('Missing required payment parameters');
            }

            const normalizedCurrency = currency.toUpperCase();

            if (isNaN(orderAmount) || orderAmount <= 0) {
                throw new Error('Invalid order amount');
            }

            switch (normalizedCurrency) {
                case 'TON':
                    return this.verifyTonTransaction(orderAmount, paymentAddress);
                case 'BTC':
                    return this.verifyBitcoinTransaction(orderAmount, paymentAddress);
                case 'USDT':
                    return this.verifyTronTransaction(orderAmount, paymentAddress, 'USDT');
                // ... other cases
                default:
                    throw new Error(`Unsupported cryptocurrency: ${normalizedCurrency}`);
            }
        } catch (error) {
            return {
                verified: false,
                status: 'error',
                message: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private async verifyTonTransaction(orderAmount: number, paymentAddress: string): Promise<VerificationResult> {
        try {
            const response: AxiosResponse<{ result: TonTransaction[] }> = await axios.get(
                `${this.config.ton.apiUrl}/getTransactions`,
                {
                    params: {
                        address: paymentAddress,
                        limit: 50,
                        to_lt: 0,
                        arch: false
                    },
                    headers: { 'X-API-Key': this.config.ton.apiKey }
                }
            );

            const matchingTx = response.data.result.find(tx =>
                (tx.in_msg?.value || 0) >= orderAmount * Math.pow(10, this.config.ton.decimals) &&
                Date.now() / 1000 - tx.utime < 3600
            ) || null;

            return this.formatVerificationResult(matchingTx, 'ton');
        } catch (error) {
            return this.handleVerificationError('TON');
        }
    }

    private async verifyBitcoinTransaction(orderAmount: number, paymentAddress: string): Promise<VerificationResult> {
        try {
            const response: AxiosResponse<{ result: BtcTransaction[] }> = await axios.get(
                `${this.config.btc.apiUrl}/address/${paymentAddress}/txs`,
                {
                    headers: { 'X-API-Key': this.config.btc.apiKey }
                }
            );

            const matchingTx = response.data.result.find(tx =>
                tx.value >= orderAmount * Math.pow(10, this.config.btc.decimals) &&
                tx.confirmations > 0
            ) || null;

            return this.formatVerificationResult(matchingTx, 'btc');
        } catch (error) {
            return this.handleVerificationError('BTC');
        }
    }

    private async verifyTronTransaction(orderAmount: number, paymentAddress: string, currency: string): Promise<VerificationResult> {
        try {
            const response: AxiosResponse<{ data: TronTransaction[] }> = await axios.get(
                `${this.config.tron.apiUrl}/v1/accounts/${paymentAddress}/transactions`,
                {
                    headers: { 'TRON-PRO-API-KEY': this.config.tron.apiKey }
                }
            );

            const matchingTx = response.data.data.find(tx =>
                currency === 'USDT' ? this.verifyUSDTTransaction(tx, orderAmount) :
                tx.raw_data.contract[0].parameter.value.amount / Math.pow(10, this.config.tron.decimals) >= orderAmount
            ) || null;

            return this.formatVerificationResult(matchingTx, 'tron');
        } catch (error) {
            return this.handleVerificationError('TRON');
        }
    }

    private verifyUSDTTransaction(tx: TronTransaction, orderAmount: number): boolean {
        try {
            const contractData = tx.raw_data.contract[0];
            return contractData.type === 'TriggerSmartContract' &&
                contractData.parameter.value.contract_address === this.config.tron.usdtContract &&
                contractData.parameter.value.amount / Math.pow(10, this.config.tron.decimals) >= orderAmount;
        } catch {
            return false;
        }
    }

    private formatVerificationResult(transaction: TonTransaction | BtcTransaction | TronTransaction | null, network: string): VerificationResult {
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
            txHash: 'hash' in transaction ? transaction.hash : ('txID' in transaction ? transaction.txID : ''),
            amount: 'value' in transaction ? transaction.value : 0,
            confirmations: 'confirmations' in transaction ? transaction.confirmations : 1,
            timestamp: 'utime' in transaction ? transaction.utime : ('block_timestamp' in transaction ? transaction.block_timestamp : 0),
            explorerUrl: this.getExplorerUrl(network, 'hash' in transaction ? transaction.hash : ('txID' in transaction ? transaction.txID : ''))
        };
    }

    private handleVerificationError(network: string): VerificationResult {
        return {
            verified: false,
            status: 'error',
            message: `Failed to verify ${network} transaction`
        };
    }

    getExplorerUrl(currency: string, txHash: string): string | undefined {
        const config = this.config[currency.toLowerCase()];
        return config ? config.explorerUrl + txHash : undefined;
    }
}

export default new BlockchainService();