const Order = require('../models/order.model');
const BlockchainService = require('../services/blockchain.service');
const DownloadService = require('../services/download.service');
const EmailService = require('../services/email.service');
const paymentService = require('../services/payment.service');
exports.createPayment = async (req, res) => {
    try {
        const { email, cryptocurrency, amount, bookId } = req.body;
        
        if (!email || !cryptocurrency || !amount || !bookId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields' 
            });
        }

        const currencyInfo = paymentService.supportedCurrencies[cryptocurrency];
        if (!currencyInfo || !currencyInfo.address) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid cryptocurrency selected' 
            });
        }

        // Format amount based on cryptocurrency decimals
        const formattedAmount = parseFloat(amount).toFixed(currencyInfo.decimals || 8);
        const orderId = `ORDER${Date.now()}`;
        const paymentAddress = currencyInfo.address;

        // Generate wallet-compatible QR code
        const walletUri = `${cryptocurrency.toLowerCase()}:${paymentAddress}`;
        const qrCodeData = {
            uri: walletUri,
            amount: formattedAmount,
            label: `Book Purchase - ${orderId}`,
            message: 'Payment for digital book'
        };

        const order = await Order.create({
            orderId,
            email,
            amount: formattedAmount,
            bookId,
            currency: cryptocurrency,
            paymentAddress,
            status: 'pending'
        });

        res.json({
            success: true,
            orderId: order.id,
            paymentAddress,
            amount: formattedAmount,
            currency: cryptocurrency,
            qrCodeData,
            paymentUri: walletUri,
            networkFee: currencyInfo.networkFee,
            waitTime: currencyInfo.waitTime,
            minConfirmations: currencyInfo.minConfirmations,
            instructions: currencyInfo.instructions,
            explorerUrl: BlockchainService.getExplorerUrl(cryptocurrency, ''),
            walletDeepLink: `${cryptocurrency.toLowerCase()}://transfer?address=${paymentAddress}&amount=${formattedAmount}`
        });
    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Payment creation failed',
            details: error.message 
        });
    }
};

exports.checkPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                error: 'Order not found' 
            });
        }

        const verificationResult = await BlockchainService.verifyPayment(
            order.currency,
            order.amount,
            order.paymentAddress
        );
        
        if (verificationResult.verified) {
            await Order.updateStatus(orderId, {
                status: 'completed',
                txHash: verificationResult.txHash,
                paidAmount: verificationResult.amount,
                completedAt: new Date()
            });

            const downloadToken = await DownloadService.generateToken(orderId);
            await EmailService.sendDownloadLink(
                order.email, 
                downloadToken,
                order.currency,
                verificationResult.txHash
            );

            return res.json({
                success: true,
                status: 'completed',
                downloadToken,
                explorerUrl: verificationResult.explorerUrl,
                txHash: verificationResult.txHash,
                confirmations: verificationResult.confirmations
            });
        }

        const currencyInfo = paymentService.supportedCurrencies[order.currency];
        res.json({
            success: true,
            status: 'pending',
            message: `Waiting for payment (${verificationResult.confirmations || 0}/${currencyInfo.minConfirmations} confirmations)`,
            confirmations: verificationResult.confirmations || 0,
            requiredConfirmations: currencyInfo.minConfirmations
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Payment verification failed' 
        });
    }
};

exports.getStatus = async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId);
        console.log('Checking status for orderId:', orderId);

        const order = await Order.findById(orderId);
        console.log('Retrieved order:', order);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Fix order property validation
        if (!order.payment_currency || !order.amount || !order.payment_address) {
            console.log('Invalid order details:', {
                currency: order.payment_currency,
                amount: order.amount,
                address: order.payment_address
            });
            return res.status(400).json({
                success: false,
                message: 'Invalid order payment details'
            });
        }

        const paymentStatus = await BlockchainService.verifyPayment(
            order.payment_currency,
            parseFloat(order.amount),
            order.payment_address
        );

        return res.json({
            success: true,
            orderId: order.id,
            status: paymentStatus.verified ? 'completed' : 'pending',
            amount: order.amount,
            currency: order.payment_currency,
            address: order.payment_address,
            confirmations: paymentStatus.confirmations || 0,
            verified: paymentStatus.verified || false,
            ...(paymentStatus.verified && {
                txHash: paymentStatus.txHash,
                explorerUrl: BlockchainService.getExplorerUrl(order.payment_currency, paymentStatus.txHash),
                completedAt: paymentStatus.completedAt || new Date()
            })
        });

    } catch (error) {
        console.error('Payment status check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to check payment status',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.verifyTransaction = async (req, res) => {
    try {
        const { orderId, txHash } = req.params;
        console.log('Verifying transaction:', { orderId, txHash });

        // Validate input parameters
        if (!orderId || !txHash) {
            return res.status(400).json({
                success: false,
                error: 'Order ID and transaction hash are required'
            });
        }

        // Find order
        const order = await Order.findById(orderId);
        console.log('Found order:', order);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Verify transaction on blockchain
        const verificationResult = await BlockchainService.verifyPayment(
            order.payment_currency,
            parseFloat(order.amount),
            order.payment_address,
            txHash
        );
        console.log('Verification result:', verificationResult);

        if (verificationResult.verified) {
            // Update order status
            await Order.updateStatus(orderId, {
                status: 'completed',
                txHash: txHash,
                paidAmount: verificationResult.amount
            });

            // Generate download token
            const downloadToken = await DownloadService.generateToken(orderId);

            // Send email notification
            await EmailService.sendDownloadLink(
                order.email,
                downloadToken,
                order.payment_currency,
                txHash
            );

            return res.json({
                success: true,
                status: 'completed',
                downloadToken,
                explorerUrl: BlockchainService.getExplorerUrl(order.payment_currency, txHash),
                confirmations: verificationResult.confirmations || 0
            });
        }

        return res.json({
            success: false,
            status: 'invalid',
            message: 'Transaction verification failed',
            confirmations: verificationResult.confirmations || 0,
            details: verificationResult.message || 'Transaction not found or invalid'
        });

    } catch (error) {
        console.error('Transaction verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Transaction verification failed',
            message: error.message
        });
    }
};

module.exports = exports;