import { BlockchainService } from '../services/blockchainService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BlockchainService', () => {
  let blockchainService: BlockchainService;

  const mockSuccessfulTransaction = {
    hash: 'a35d396a49ef62990405e9a3b21bfb9b401413ffcb0c7a7d9c4e2fd949a79390',
    value: 100000000, // 1 BTC in satoshis
    confirmations: 3,
    received_time: Date.now(),
    inputs: [{ prev_addresses: ['sender-address'] }],
    outputs: [{ addresses: ['recipient-address'] }]
  };

  const mockRealTransaction = {
    hash: '0bbef8543c959f055842055c8be53d9ce2111ef948bb81339dfa4d70a48dc5ab',
    value: 7722890, // 0.07722890 BTC in satoshis
    confirmations: 1439,
    received_time: new Date('2024-12-29T05:31:24Z').getTime(),
    inputs: Array(60).fill({ prev_addresses: ['sender-address'] }), 
    outputs: [{ 
      addresses: ['bc1qg-k6qvp'],
      value: 7722890 
    }],
    fees: 24918,
    block_height: 876945,
    size: 8986
  };

  beforeEach(() => {
    blockchainService = new BlockchainService();
    jest.clearAllMocks();
  });

  test('verifyPayment should return success for valid payment', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { txs: [mockSuccessfulTransaction] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: 'https://api.example.com' }
    });

    const result = await blockchainService.verifyPayment(
      'BTC',
      1.0,
      'recipient-address'
    );

    expect(result.verified).toBe(true);
    expect(result.status).toBe('completed');
    expect(result.txHash).toBe(mockSuccessfulTransaction.hash);
  });

  test('verifyPayment should handle pending transactions', async () => {
    const pendingTx = {
      ...mockSuccessfulTransaction,
      confirmations: 1 // Less than required confirmations
    };

    mockedAxios.get.mockResolvedValueOnce({
      data: { txs: [pendingTx] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: 'https://api.example.com' }
    });

    const result = await blockchainService.verifyPayment(
      'BTC',
      1.0,
      'recipient-address'
    );

    expect(result.verified).toBe(false);
    expect(result.status).toBe('pending');
  });

  test('should handle rate limiting', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      response: {
        status: 429,
        headers: { 'retry-after': '5' }
      }
    });

    const result = await blockchainService.verifyPayment(
      'BTC',
      1.0,
      'recipient-address'
    );

    expect(result.verified).toBe(false);
    expect(result.status).toBe('error');
  });

  test('verifyPayment should validate real BTC transaction', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { txs: [mockRealTransaction] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: 'https://api.example.com' }
    });

    const result = await blockchainService.verifyPayment(
      'BTC',
      0.07722890,
      'bc1qg-k6qvp'
    );

    expect(result.verified).toBe(true);
    expect(result.status).toBe('completed');
    expect(result.txHash).toBe(mockRealTransaction.hash);
    expect(result.amount).toBe(mockRealTransaction.value);
    expect(result.confirmations).toBe(mockRealTransaction.confirmations);
  });
});

describe('BlockchainService BTC Transaction Tests', () => {
  let blockchainService: BlockchainService;

  const mockRealBTCTransaction = {
    hash: '7ea20b7708f7f05726fa4c254fcded5ef478d3bd8c543340502f9fcd9c6d5b12',
    value: 13507, // 0.00013507 BTC in satoshis
    confirmations: 32,
    received_time: new Date('2025-01-09T02:51:20Z').getTime(),
    inputs: [{ 
      prev_addresses: ['bc1qtrqh3a08gf8cpm0ppkatyv32npq57yqdxep64j']
    }],
    outputs: [
      { 
        addresses: ['bc1q85unuycxg4jwf8a4935cc2q9lm8ymqss6z5acv'],
        value: 1063 // 0.00001063 BTC
      },
      {
        addresses: ['bc1qwj8e732k7rzxfa300n868d3nw7xxtk60ksxhsr'],
        value: 12444 // 0.00012444 BTC
      }
    ],
    fees: 493, // 0.00000493 BTC
    block_height: 878393,
    size: 223
  };

  beforeEach(() => {
    blockchainService = new BlockchainService();
    jest.clearAllMocks();
  });

  test('should verify real BTC transaction from 09 Jan 2025', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { txs: [mockRealBTCTransaction] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: 'https://api.example.com' }
    });

    const result = await blockchainService.verifyPayment(
      'BTC',
      0.00001063, // Testing for first output amount
      'bc1q85unuycxg4jwf8a4935cc2q9lm8ymqss6z5acv'
    );

    expect(result.verified).toBe(true);
    expect(result.status).toBe('completed');
    expect(result.txHash).toBe(mockRealBTCTransaction.hash);
    expect(result.amount).toBe(1063); // 0.00001063 BTC in satoshis
    expect(result.confirmations).toBe(32);
  });

  test('should handle transaction with multiple outputs', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { txs: [mockRealBTCTransaction] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: 'https://api.example.com' }
    });

    const result = await blockchainService.verifyPayment(
      'BTC',
      0.00012444, // Testing for second output amount
      'bc1qwj8e732k7rzxfa300n868d3nw7xxtk60ksxhsr'
    );

    expect(result.verified).toBe(true);
    expect(result.status).toBe('completed');
    expect(result.amount).toBe(12444); // 0.00012444 BTC in satoshis
  });

  test('should verify transaction confirmations', async () => {
    const pendingTx = {
      ...mockRealBTCTransaction,
      confirmations: 1 // Less than required (usually 2-6 for BTC)
    };

    mockedAxios.get.mockResolvedValueOnce({
      data: { txs: [pendingTx] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: 'https://api.example.com' }
    });

    const result = await blockchainService.verifyPayment(
      'BTC',
      0.00001063,
      'bc1q85unuycxg4jwf8a4935cc2q9lm8ymqss6z5acv'
    );

    expect(result.verified).toBe(false);
    expect(result.status).toBe('pending');
    expect(result.message).toContain('Waiting for confirmations');
  });
});