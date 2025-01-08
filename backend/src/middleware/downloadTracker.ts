import { Request, Response, NextFunction } from 'express';
import Order from '../models/orderModel';
export const downloadTracker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByPk(orderId);

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        if (order.status === 'completed') {
            res.status(403).json({ message: 'Download link has expired' });
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
};