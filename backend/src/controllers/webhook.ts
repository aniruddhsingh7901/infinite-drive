import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';

export const handleBlockCypherWebhook = async (req: Request, res: Response) => {
    try {
        const { address, confirmations, total, hash } = req.body;

        // Verify the payment details
        const paymentService = new PaymentService();
        const payment = await paymentService.getPaymentByAddress(address);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Update payment status based on confirmations
        if (confirmations >= payment.minConfirmations) {
            await paymentService.updatePaymentStatus(payment.orderId, 'completed', hash);
        } else {
            await paymentService.updatePaymentStatus(payment.orderId, 'confirming', hash, confirmations);
        }

        res.status(200).json({ message: 'Payment status updated' });
    } catch (error) {
        console.error('Error handling BlockCypher webhook:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};