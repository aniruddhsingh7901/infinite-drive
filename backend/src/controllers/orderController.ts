// import { Request, Response } from 'express';
// import Order from '../models/orderModel';
// import Book from '../models/Book';
// import { v4 as uuidv4 } from 'uuid';
// import { PaymentService } from './../services/paymentService';
// import { EmailService } from '../services/emailService';
// import { generateDownloadToken } from './../utils/tokenUtils';


// export const createOrder = async (req: Request, res: Response) => {
//   try {
//     const { userId, email, bookId, format, payment_currency } = req.body;
//     console.log("🚀 ~ createOrder ~  req.body:", req.body)

//     // Validate book exists and get price
//     const book = await Book.findByPk(bookId);
//     if (!book) {
//       return res.status(404).json({ error: 'Book not found' });
//     }

//     // Get payment address for selected cryptocurrency
//     const paymentService = new PaymentService();
//     const payment_address = await paymentService.generatePaymentAddress(payment_currency);
//     console.log("🚀 ~ createOrder ~ payment_address:", payment_address)

//     // Create order with pending status
//     const order = await Order.create({
//       id: uuidv4(),
//       userId,
//       bookId,
//       format,
//       email,
//       amount: book.price,
//       payment_currency,
//       payment_address,
//       status: 'pending',
//       downloadLink: null,
//       created_at: new Date(),
//       updated_at: new Date()
//     });

//     res.status(201).json({
//       success: true,
//       order: {
//         id: order.id,
//         payment_address,
//         amount: order.amount,
//         currency: order.payment_currency
//       }
//     });

//   } catch (error) {
//     console.error('Order creation failed:', error);
//     res.status(500).json({ error: 'Failed to create order' });
//   }
// };

// export const checkOrderStatus = async (req: Request, res: Response) => {
//   try {
//     const { orderId } = req.params;
//     const order = await Order.findByPk(orderId);

//     if (!order) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     const paymentService = new PaymentService();
//     const paymentStatus = await paymentService.verifyPayment(
//       order.payment_address,
//       order.amount,
//       order.payment_currency
//     );

//     if (paymentStatus.verified) {
//       // Update order status and set download link
//       const book = await Book.findByPk(order.bookId);
//       if (!book) {
//         throw new Error('Book not found');
//       }
//       const downloadToken = generateDownloadToken(orderId);
//       order.status = 'completed';
//       order.tx_hash = paymentStatus.txHash;
//       order.paid_amount = paymentStatus.amount;
//       order.completed_at = new Date();
//       order.downloadLink = book.filePaths[order.format.toLowerCase()];
//       await order.save();

//       const emailService = new EmailService();
//       if (!paymentStatus.txHash) {
//         throw new Error('Transaction hash is missing');
//       }
//       await emailService.sendDownloadLink(
//         order.email,
//         downloadToken,
//         paymentStatus.txHash
//       );

//       return res.json({
//         success: true,
//         status: 'completed',
//         downloadToken,
//         txHash: paymentStatus.txHash
//       });
//     }

//     res.json({
//       success: true,
//       status: 'pending',
//       message: 'Payment not yet verified'
//     });
//   } catch (error) {
//     console.error('Order status check failed:', error);
//     res.status(500).json({ error: 'Failed to check order status' });
//   }
// };

// export const getUserOrders = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.params;
//     const orders = await Order.findByUserId(userId);

//     res.json({
//       success: true,
//       orders: orders.map(order => ({
//         id: order.id,
//         bookId: order.bookId,
//         format: order.format,
//         status: order.status,
//         downloadLink: order.status === 'completed' ? order.downloadLink : null,
//         amount: order.amount,
//         currency: order.payment_currency,
//         completed_at: order.completed_at
//       }))
//     });

//   } catch (error) {
//     console.error('Get user orders failed:', error);
//     res.status(500).json({ error: 'Failed to get user orders' });
//   }
// };