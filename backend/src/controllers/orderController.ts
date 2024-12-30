import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { StorageService } from '../services/storageService';

const storageService = new StorageService();

export const orderController = {
  createOrder: async (req: Request, res: Response) => {
    try {
      const order = new Order(req.body);
      await order.save();
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  },

  getOrder: async (req: Request, res: Response) => {
    try {
      const order = await Order.findById(req.params.id).populate('bookId');
      if (!order) return res.status(404).json({ error: 'Order not found' });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  },

  handleDownload: async (req: Request, res: Response) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      
      if (order.downloads >= 3) {
        return res.status(403).json({ error: 'Download limit exceeded' });
      }

      if (!order.downloadExpiry || new Date() > new Date(order.downloadExpiry.toString())) {
        return res.status(403).json({ error: 'Download link expired' });
      }

      order.downloads += 1;
      await order.save();

      if (order.downloads >= 3) {
        if (order.downloadLink) {
          await storageService.deleteFile(order.downloadLink);
        }
      }

      res.json({ downloadLink: order.downloadLink });
    } catch (error) {
      res.status(500).json({ error: 'Download failed' });
    }
  }
};