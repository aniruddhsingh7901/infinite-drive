const router = require('express').Router();
const paymentAuth = require('../middleware/payment.middleware');
const paymentController = require('../controllers/payment.controller');

// Create new payment
router.post('/create', paymentAuth, paymentController.createPayment);

// Check payment status
router.get('/check/:orderId', paymentAuth, paymentController.checkPayment);

// Get general payment status
router.get('/status/:orderId', paymentAuth, paymentController.getStatus);

// Verify specific transaction
router.get('/verify/:orderId/:txHash', paymentAuth, paymentController.verifyTransaction);

// Get payment methods/supported cryptocurrencies
router.get('/methods', async (req, res) => {
    try {
        const methods = await paymentService.getPaymentMethods();
        res.json({
            success: true,
            methods
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get payment methods' });
    }
});

// Get payment address for specific cryptocurrency
router.get('/address/:currency', paymentAuth, async (req, res) => {
    try {
        const address = await paymentService.getPaymentAddress(req.params.currency);
        res.json({
            success: true,
            address
        });
    } catch (error) {
        res.status(400).json({ error: 'Invalid currency' });
    }
});

module.exports = router;