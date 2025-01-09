import axios, { AxiosResponse } from 'axios';



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
interface BlockchainConfig {
    apiUrl: string;
    apiKey: string;
    explorerUrl: string;
    decimals: number;
    minConfirmations: number;
    usdtContract?: string;
}
interface BlockchainConfigs {
    [key: string]: BlockchainConfig;
}
export class BlockchainService {
    private readonly config: BlockchainConfigs = {
        BTC: {
            apiUrl: 'https://api.blockcypher.com/v1/btc/main',
            apiKey: process.env.BLOCKCYPHER_API_TOKEN!,
            explorerUrl: 'https://www.blockchain.com/btc/tx/',
            decimals: 8,
            minConfirmations: 2
        },
        LTC: {
            apiUrl: 'https://api.blockcypher.com/v1/ltc/main',
            apiKey: process.env.BLOCKCYPHER_API_TOKEN!,
            explorerUrl: 'https://blockchair.com/litecoin/transaction/',
            decimals: 8,
            minConfirmations: 6
        },
        DOGE: {
            apiUrl: 'https://api.blockcypher.com/v1/doge/main',
            apiKey: process.env.BLOCKCYPHER_API_TOKEN!,
            explorerUrl: 'https://dogechain.info/tx/',
            decimals: 8,
            minConfirmations: 6
        },
        SOL: {
            apiUrl: 'https://api.solscan.io',
            apiKey: process.env.SOLSCAN_API_KEY!,
            explorerUrl: 'https://solscan.io/tx/',
            decimals: 9,
            minConfirmations: 1
        },
        USDT: {
            apiUrl: 'https://api.trongrid.io',
            apiKey: process.env.TRONGRID_API_KEY!,
            explorerUrl: 'https://tronscan.org/#/transaction/',
            decimals: 6,
            minConfirmations: 19,
            usdtContract: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
        }
    };

    async verifyPayment(currency: string, amount: number, address: string): Promise<VerificationResult> {
        try {
            const config = this.config[currency.toUpperCase()];
            if (!config) throw new Error(`Unsupported currency: ${currency}`);

            const convertedAmount = amount * Math.pow(10, config.decimals);
            console.log("🚀 ~ BlockchainService ~ verifyPayment ~ convertedAmount:", convertedAmount)

            switch (currency.toUpperCase()) {
                case 'BTC':
                case 'LTC':
                case 'DOGE':
                    return await this.verifyUTXOTransaction(currency, convertedAmount, address, config);

                case 'SOL':
                    return await this.verifySolanaTransaction(convertedAmount, address, config);

                case 'USDT':
                    return await this.verifyTronTransaction(convertedAmount, address, config);

                default:
                    throw new Error(`Verification not implemented for ${currency}`);
            }
        } catch (error) {
            return {
                verified: false,
                status: 'error',
                message: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private async verifyUTXOTransaction(currency: string, expectedAmount: number, expectedAddress: string, config: BlockchainConfig): Promise<VerificationResult> {
        try {
            const response = await axios.get(`${config.apiUrl}/addrs/${expectedAddress}/full?token=${config.apiKey}`);
            const recentTx = response.data.txs?.[0];

            if (!recentTx) {
                return {
                    verified: false,
                    status: 'pending',
                    message: 'No transactions found'
                };
            }

            // Convert expected amount to satoshis (BTC: 1 = 100000000 satoshis)
            const expectedSatoshis = Math.round(expectedAmount); // Fixed conversion
            console.log("🚀 ~ BlockchainService ~ verifyUTXOTransaction ~ expectedSatoshis:", expectedSatoshis)

            // Find output for our address
            interface TransactionOutput {
                addresses?: string[];
                value: number;
            }

            const matchingOutput: TransactionOutput | undefined = recentTx.outputs.find((output: TransactionOutput) =>
                output.addresses?.includes(expectedAddress)
            );
            const receivedSatoshis = matchingOutput?.value || 0;
            console.log("🚀 ~ BlockchainService ~ verifyUTXOTransaction ~ receivedSatoshis:", receivedSatoshis)

            interface TransactionDebug {
                expectedAmount: number;
                expectedSatoshis: number;
                receivedSatoshis: number;
                expectedAddress: string;
                outputs: Array<{
                    value: number;
                    addresses: string[] | undefined;
                }>;
            }

            interface TxOutput {
                value: number;
                addresses: string[] | undefined;
            }

            interface TransactionDebug {
                expectedAmount: number;
                expectedSatoshis: number;
                receivedSatoshis: number;
                expectedAddress: string;
                outputs: TxOutput[];
            }

            interface TxOutput {
                value: number;
                addresses: string[] | undefined;
            }

            interface TransactionDebug {
                expectedAmount: number;
                expectedSatoshis: number;
                receivedSatoshis: number;
                expectedAddress: string;
                outputs: TxOutput[];
            }

            const debugInfo: TransactionDebug = {
                expectedAmount,
                expectedSatoshis,
                receivedSatoshis,
                expectedAddress,
                outputs: recentTx.outputs.map((o: { value: number; addresses?: string[] }): TxOutput => ({
                    value: o.value,
                    addresses: o.addresses
                }))
            };

            console.log('Transaction Debug:', debugInfo);
            console.log("🚀 ~ BlockchainService ~ verifyUTXOTransaction ~ recentTx.hash:", recentTx.hash)
            const isVerified =
                
                matchingOutput !== undefined &&
                receivedSatoshis == expectedSatoshis && // Exact match
                recentTx.confirmations >= config.minConfirmations;
            console.log("🚀 ~ BlockchainService ~ verifyUTXOTransaction ~ isVerified:", isVerified)
            return {
                verified: isVerified,
                status: isVerified ? 'completed' : 'pending',
                txHash: recentTx.hash,
                amount: receivedSatoshis / 100000000, // Convert back to BTC
                confirmations: recentTx.confirmations,
                timestamp: new Date(recentTx.received).getTime(),
                explorerUrl: `${config.explorerUrl}${recentTx.hash}`,
                message: !isVerified ? `Expected ${expectedAmount} BTC (${expectedSatoshis} sats), received ${receivedSatoshis / 100000000} BTC (${receivedSatoshis} sats)` : undefined
            };
               

        } catch (error) {
            console.error('UTXO verification error:', error);
            throw error;
        }
    }
    private async verifySolanaTransaction(amount: number, address: string, config: BlockchainConfig): Promise<VerificationResult> {
        const response = await axios.get(`${config.apiUrl}/account/transactions`, {
            params: { account: address },
            headers: { 'Authorization': `Bearer ${config.apiKey}` }
        });

        const recentTx = response.data?.[0];
        if (!recentTx) return { verified: false, status: 'pending' };

        return {
            verified: recentTx.confirmations >= config.minConfirmations,
            status: recentTx.confirmations >= config.minConfirmations ? 'completed' : 'pending',
            txHash: recentTx.signature,
            amount: recentTx.lamports / Math.pow(10, config.decimals),
            confirmations: recentTx.confirmations,
            timestamp: recentTx.blockTime * 1000,
            explorerUrl: `${config.explorerUrl}${recentTx.signature}`
        };
    }

    private async verifyTronTransaction(amount: number, address: string, config: BlockchainConfig): Promise<VerificationResult> {
        const response = await axios.get(`${config.apiUrl}/v1/accounts/${address}/transactions/trc20`, {
            params: {
                contract_address: config.usdtContract,
                only_confirmed: true,
                limit: 1
            },
            headers: { 'TRON-PRO-API-KEY': config.apiKey }
        });

        const recentTx = response.data.data?.[0];
        if (!recentTx) return { verified: false, status: 'pending' };

        return {
            verified: parseInt(recentTx.value) >= amount,
            status: parseInt(recentTx.value) >= amount ? 'completed' : 'pending',
            txHash: recentTx.transaction_id,
            amount: parseInt(recentTx.value) / Math.pow(10, config.decimals),
            confirmations: recentTx.confirmed ? config.minConfirmations : 0,
            timestamp: recentTx.block_timestamp,
            explorerUrl: `${config.explorerUrl}${recentTx.transaction_id}`
        };
    }
}