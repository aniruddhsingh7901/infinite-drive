import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import { Order } from '../models/Order';
import { Book } from '../models/Book';

// Add interface for populated Order
import { Document } from 'mongoose';

interface PopulatedOrder extends Document {
  _id: string;
  bookId: {
    _id: string;
    title: string;
    price: number;
    // other book fields you need
  };
  customerEmail: string;
  amount: number;
  paymentStatus: string;
  paymentChargeId?: string;
}

const paymentService = new PaymentService();

export const paymentController = {
  createPayment: async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId)
        .populate<PopulatedOrder>('bookId')
        .exec();

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const payment = await paymentService.createPayment({
        orderId: order._id.toString(),
        amount: order.amount,
        customerEmail: order.customerEmail,
        bookTitle: order.bookId.title // Now TypeScript knows title exists
      });

      if (!payment.success) {
        return res.status(500).json({ error: payment.error });
      }

      await Order.findByIdAndUpdate(orderId, {
        paymentChargeId: payment.chargeId
      });

      res.json({ paymentUrl: payment.paymentUrl });
    } catch (error) {
      console.error('Payment creation error:', error);
      res.status(500).json({ error: 'Payment creation failed' });
    }
  },

  handleWebhook: async (req: Request, res: Response) => {
    try {
      const signature = req.headers['x-cc-webhook-signature'] as string;
      const rawBody = JSON.stringify(req.body);

      if (!signature) {
        return res.status(400).json({ error: 'No signature provided' });
      }

      const isValid = paymentService.validateSignature(signature, rawBody);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid signature' });
      }

      const success = await paymentService.handleWebhook(rawBody, signature);
      if (!success) {
        return res.status(400).json({ error: 'Webhook processing failed' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  },

  checkPaymentStatus: async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json({
        status: order.paymentStatus,
        chargeId: order.paymentChargeId
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to check payment status' });
    }
  }
};