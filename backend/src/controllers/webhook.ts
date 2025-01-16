import { Request, Response } from 'express';
// import { getRepository } from 'typeorm';
import Order from '../models/orderModel';
import WebSocketService from '../services/websocketService';
import { webSocketService } from '../app';
import { BlockchainService } from '../services/blockchainService';
import { orderStore } from '../services/orderStore';



class PaymentService {
    async getPaymentByOrderId(orderId: string): Promise<Order | null> {
        return await Order.findOne({ where: { id: orderId } });
    }

    async updatePaymentStatus(orderId: string, status: string, txHash: string,  confirmations?: number): Promise<void> {
        
        const order = await Order.findOne({ where: { id: orderId } });
        console.log("🚀 ~ PaymentService ~ updatePaymentStatus ~ order:", order)
        if (order) {
            order.status = status;
            if (order.txHash == null) {
                order.txHash = txHash;
            }
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


const paymentService = new PaymentService();
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
        console.log("🚀 ~ handleBlockCypherWebhook ~ hash:", hash)
        console.log("🚀 ~ handleBlockCypherWebhook ~ addresses:", addresses)
        console.log("🚀 ~ handleBlockCypherWebhook ~ confirmations:", confirmations)
        const { orderId } = req.query;
      
        console.log("🚀 ~ handleBlockCypherWebhook ~ req.query:", req.query);

        if (!addresses || !addresses.length) {
            res.status(400).json({ message: 'Missing required parameter: addresses' });
            return;
        }

        if (!orderId) {
            res.status(400).json({ message: 'Missing required parameter: orderId' });
            return;
        }

        const currentOrderId = orderStore.getCurrentOrderId();
        console.log("🚀 ~ handleBlockCypherWebhook ~ currentOrderId:", currentOrderId)
        if (orderId !== currentOrderId) {
            res.status(400).json({ message: 'Order ID does not match the current order' });
            return;
        }

        const payment = await paymentService.getPaymentByOrderId(orderId as string);
        // console.log("🚀 ~ handleBlockCypherWebhook ~ payment:", payment);

        if (!payment) {
            res.status(404).json({ message: 'Payment not found' });
            return;
        }
      
        // console.log("🚀 ~ handleBlockCypherWebhook ~ payment:", payment);

    
        if (!payment) {
            res.status(404).json({ message: 'Payment not found' });
            return;
        }
        
        // Update payment status based on confirmations
        const REQUIRED_CONFIRMATIONS = 1;
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

export const deleteWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { webhookId } = req.params;
        const { currency } = req.query;

        if (!webhookId) {
            res.status(400).json({ message: 'Missing required parameter: webhookId' });
            return;
        }

        if (!currency) {
            res.status(400).json({ message: 'Missing required parameter: currency' });
            return;
        }

        await blockchainService.deleteWebhook(webhookId, currency as string);
        res.status(200).json({ message: 'Webhook deleted successfully' });
    } catch (error) {
        console.error('Error deleting webhook:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const registerWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { address, currency, orderId } = req.body;
        console.log("🚀 ~ registerWebhook ~ req.body:", req.body);

        if (!address || !currency || !orderId) {
            res.status(400).json({ message: 'Missing required parameters: address, currency, or orderId' });
            return;
        }

        await blockchainService.registerWebhook(address, currency, orderId);
        res.status(200).json({ message: 'Webhook registered successfully' });
    } catch (error) {
        console.error('Error registering webhook:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteAllWebhooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const { currency } = req.query;
        console.log("🚀 ~ deleteAllWebhooks ~ req.query:", req.query);

        if (!currency) {
            res.status(400).json({ message: 'Missing required parameter: currency' });
            return;
        }

        await blockchainService.deleteAllWebhooks(currency as string);
        res.status(200).json({ message: 'All webhooks deleted successfully' });
    } catch (error) {
        console.error('Error deleting all webhooks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
