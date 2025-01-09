const assert = require('assert');
const paymentProcessor = require('../../../src/paymentProcessor'); // Adjust the path as necessary

describe('Payment Processing', () => {
    it('should process a successful payment', async () => {
        const result = await paymentProcessor.processPayment({ amount: 100, currency: 'USD' });
        assert.strictEqual(result.status, 'success');
    });

    it('should fail a payment with insufficient funds', async () => {
        const result = await paymentProcessor.processPayment({ amount: 1000000, currency: 'USD' });
        assert.strictEqual(result.status, 'failed');
        assert.strictEqual(result.error, 'Insufficient funds');
    });

    it('should handle invalid payment details', async () => {
        const result = await paymentProcessor.processPayment({ amount: -100, currency: 'USD' });
        assert.strictEqual(result.status, 'failed');
        assert.strictEqual(result.error, 'Invalid payment details');
    });
});