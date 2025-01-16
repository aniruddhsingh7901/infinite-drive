import { Request, Response } from 'express';
import Order from '../models/orderModel';
import { Book } from '../models';
import { DownloadController } from './downloadController';
import  EmailService  from '../services/emailService';

const emailService = EmailService
const downloadController = new DownloadController();




const handleSuccessfulPayment = async (order: Order, txHash:string): Promise<string> => {
    try {
        const book = await Book.findByPk(order.bookId);
        if (!book) throw new Error('Book not found');
        if (!order) throw new Error('Order not found');

        // Generate download token
        const downloadTokenObj = await downloadController.generateDownloadToken(order.id)
        // const downloadTokenObj = await downloadService.generateDownloadToken(order.id);
        const downloadToken = downloadTokenObj.get('token');
        console.log("🚀 ~ handleSuccessfulPayment ~ downloadToken:", downloadToken)

        // Get selected format from order
        const format = order.format.toLowerCase();

        // Generate format-specific download link
        const downloadLink = `${process.env.API_URL}/download/${downloadToken}?format=${format}`;

        console.log("🚀 ~ handleSuccessfulPayment ~ downloadLink:", downloadLink);

        // Update order
        await Order.update({
            downloadToken,
            downloadLink,
            completedAt: new Date( Date.now())
        }, {
            where: { id: order.id }
        });

        // Send email with format-specific link
        const emailBody = `
        Thank you for your purchase!
        
        Your download link (valid for 24 hours):
        ${format.toUpperCase()} Version: ${downloadLink}
        
        Transaction Hash: ${txHash}
        
        Note: This link can only be used once.
    `;

        await emailService.sendEmail(order.email, 'Your Book Download Link', emailBody);

        return downloadLink

    } catch (error) {
        console.error('Error handling successful payment:', error);
        throw error;
    }
};

export const checkOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.params;
        console.log("🚀 ~ checkOrderStatus ~ req.params:", req.params)

        const order = await Order.findOne({ where: { id: orderId } });

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        if (order.status === 'completed' && order.txHash) {
            // Call handleSuccessfulPayment to generate download token and link
            // const downloadToken = await 
            const downloadLink = await handleSuccessfulPayment(order , order.txHash);
            console.log("🚀 ~ checkOrderStatus ~ downloadLink:", downloadLink)
           
            res.status(200).json({ status: 'completed', txHash: order.txHash, downloadLink: downloadLink , email:order.email});
        } else {
            res.status(200).json({ status: order.status });
        }
    } catch (error) {
        console.error('Error checking order status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByPk(orderId, {
            include: [{ model: Book, attributes: ['title'] }] // Assuming you have a Book model
        });
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error getting order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.findAll({
            // Assuming you have a Book model
        });

        const formattedOrders = orders.map(order => ({
            id: order.id,
            customerEmail: order.email,
            bookId: order.bookId, // Assuming the association is set up correctly
            format: order.format,
            amount: order.amount,
            paymentMethod: order.payment_currency,
            status: order.status,
        }));
        // console.log("🚀 ~ getAllOrders ~ formattedOrders:", formattedOrders)

        res.status(200).json(formattedOrders);
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.params;
        const updateData = req.body;
        const [updated] = await Order.update(updateData, {
            where: { id: orderId }
        });
        if (!updated) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        const updatedOrder = await Order.findByPk(orderId);
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.params;
        console.log("🚀 ~ deleteOrder ~ req.params:", req.params)
        const deleted = await Order.destroy({
            where: { id: orderId }
        });
        if (!deleted) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};