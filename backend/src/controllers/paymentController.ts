import { Request, Response } from 'express';
import { CoinbaseService } from '../services/coinbaseService';
import { EmailService } from '../services/emailService';
import { StorageService } from '../services/storageService';
import { Order } from '../models/Order';
import { Book } from '../models/Book';

const coinbaseService = new CoinbaseService();
const emailService = new EmailService();
const storageService = new StorageService();

export const paymentController = {
  createPayment: async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body;
      const order = await Order.findById(orderId).populate<{ bookId: typeof Book }>('bookId').lean();
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const charge = await coinbaseService.createCharge({
        id: order._id,
        amount: order.amount,
        customerEmail: order.customerEmail,
        bookTitle: (order.bookId as any).title
      });

      await Order.findByIdAndUpdate(orderId, {
        paymentChargeId: charge.id
      });

      res.json({ paymentUrl: charge.hosted_url });
    } catch (error) {
      res.status(500).json({ error: 'Payment creation failed' });
    }
  },

  handleWebhook: async (req: Request, res: Response) => {
    try {
      const signature = req.headers['x-cc-webhook-signature'] as string;
      
      if (!coinbaseService.validateWebhook(JSON.stringify(req.body), signature)) {
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }

      const event = req.body;
      const { orderId, customerEmail } = event.data.metadata;

      if (event.type === 'charge:confirmed') {
        const order = await Order.findById(orderId).populate('bookId').lean();
        if (!order) return res.sendStatus(404);

        const downloadLink = await storageService.generateDownloadLink(
          ((order.bookId as any).fileKeys[order.format])
        );

        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'completed',
          downloadLink,
          downloadExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        });

        await emailService.sendDownloadLink(
          customerEmail,
          downloadLink,
          '24 hours'
        );
      }

      res.sendStatus(200);
    } catch (error) {
      console.error('Webhook error:', error);
      res.sendStatus(500);
    }
  }
};