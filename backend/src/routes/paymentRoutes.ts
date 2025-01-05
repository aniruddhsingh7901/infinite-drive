import express from 'express';
import { paymentController } from '../controllers/paymentController';

const router = express.Router();

// Create payment
router.post('/create', paymentController.createPayment);

// Handle webhook
router.post('/webhook', 
  express.raw({ type: 'application/json' }), 
  paymentController.handleWebhook
);

// Check payment status
router.get('/status/:orderId', paymentController.checkPaymentStatus);

export default router;