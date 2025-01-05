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
      console.error('Create order error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  },

  getOrder: async (req: Request, res: Response) => {
    try {
      const order = await Order.findById(req.params.id).populate('bookId');
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  },

  handleDownload: async (req: Request, res: Response) => {
    try {
      const order = await Order.findById(req.params.id).populate<{ bookId: { fileKeys: Record<string, string> } }>('bookId');
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.downloads >= 3) {
        return res.status(403).json({ error: 'Download limit exceeded' });
      }

      if (!order.downloadExpiry || new Date() > order.downloadExpiry) {
        return res.status(403).json({ error: 'Download link expired' });
      }

      // Parse stored download links
      const downloadLinks = JSON.parse(order.downloadLink || '{}');
      
      // Increment download count
      order.downloads = (order.downloads || 0) + 1;
      await order.save();

      // If this is the last download, schedule file deletion
      if (order.downloads >= 3) {
        const fileKeys = Object.values(order.bookId.fileKeys).filter(Boolean) as string[];
        try {
          await storageService.deleteFiles(fileKeys);
          // Clear download links after successful deletion
          order.downloadLink = undefined;
          await order.save();
        } catch (error) {
          console.error('Error deleting files:', error);
          // Continue with download even if deletion fails
        }
      }

      res.json({ downloadLinks });
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Download failed' });
    }
  },

  getAllOrders: async (req: Request, res: Response) => {
    try {
      const orders = await Order.find().populate('bookId').sort('-createdAt');
      res.json(orders);
    } catch (error) {
      console.error('Get all orders error:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  },

  deleteOrder: async (req: Request, res: Response) => {
    try {
      const order = await Order.findById(req.params.id).populate<{ bookId: { fileKeys: Record<string, string> } }>('bookId');
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Delete associated files if they exist
      if (order.bookId.fileKeys) {
        const fileKeys = Object.values(order.bookId.fileKeys).filter(Boolean) as string[];
        if (fileKeys.length > 0) {
          await storageService.deleteFiles(fileKeys);
        }
      }

      await order.deleteOne();
      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Delete order error:', error);
      res.status(500).json({ error: 'Failed to delete order' });
    }
  }
};