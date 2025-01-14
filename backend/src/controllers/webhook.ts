import { Request, Response } from 'express';
// import { getRepository } from 'typeorm';
import Order from '../models/orderModel';
import WebSocketService from '../services/websocketService';
import { webSocketService } from '../app';
import { BlockchainService } from '../services/blockchainService';




class PaymentService {
    async getPaymentByAddress(address: string): Promise<Order | null> {
        return await Order.findOne({ where: { payment_address: address } });
    }

    async updatePaymentStatus(orderId: string, status: string, txHash: string,  confirmations?: number): Promise<void> {
        
        const order = await Order.findOne({ where: { id: orderId } });
        console.log("🚀 ~ PaymentService ~ updatePaymentStatus ~ order:", order)
        if (order) {
            order.status = status;
            order.txHash = txHash;
            let downloadLink = '';

            if (status === 'completed') {
                // Generate the download link based on the order ID
                downloadLink = `https://your-download-link/${order.id}`;
            }

            await order.save();
            webSocketService.broadcast('paymentStatus', { orderId: order.id, status, txHash, downloadLink, confirmations });
        }
    }
}



// const server = createServer();

const paymentService = new PaymentService();
// const webSocketService = new WebSocketService(server);
const blockchainService = new BlockchainService();

export const checkWebhookRegistration = async (req: Request, res: Response): Promise<void> => {
    const { address, currency, orderId } = req.query;
    console.log("🚀 ~ checkWebhookRegistration ~ req.query:", req.query)

    try {
        const webhooks = await blockchainService.listWebhooks(currency as string);
        console.log("🚀 ~ checkWebhookRegistration ~ webhooks:", webhooks)
        const isRegistered = webhooks.some((webhook: any) => webhook.address === address && webhook.url.includes(`orderId=${orderId}`));
        console.log("🚀 ~ checkWebhookRegistration ~ isRegistered:", isRegistered)

        res.status(200).json({
            success: true,
            isRegistered
        });
    } catch (error) {
        console.error('Error checking webhook registration:', error);
        res.status(500).json({ message: 'Failed to check webhook registration', error: error});
    }
};

export const handleBlockCypherWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { addresses, confirmations, total, hash, currency } = req.body;
        const { orderId } = req.query;
        console.log("🚀 ~ handleBlockCypherWebhook ~ req.body:", req.body);
        console.log("🚀 ~ handleBlockCypherWebhook ~ req.query:", req.query);

        if (!addresses || !addresses.length) {
            res.status(400).json({ message: 'Missing required parameter: addresses' });
            return;
        }

        if (!orderId) {
            res.status(400).json({ message: 'Missing required parameter: orderId' });
            return;
        }

        // const payment = await paymentService.getPaymentByAddress(addresses[0]);
        // console.log("🚀 ~ handleBlockCypherWebhook ~ payment:", payment);

        // if (!payment || payment.id !== orderId) {
        //     res.status(404).json({ message: 'Payment not found or orderId mismatch' });
        //     return;
        // }

        // Update payment status based on confirmations
        const REQUIRED_CONFIRMATIONS = 6;
        if (confirmations >= REQUIRED_CONFIRMATIONS) {
            await paymentService.updatePaymentStatus(orderId as string, 'completed', hash);
        } else {
            await paymentService.updatePaymentStatus(orderId as string, 'confirming', hash, confirmations);
        }

        res.status(200).json({ message: 'Payment status updated' });
    } catch (error) {
        console.error('Error handling BlockCypher webhook:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

