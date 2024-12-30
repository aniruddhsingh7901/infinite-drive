import express from 'express';
import { paymentController } from '../controllers/paymentController';

const router = express.Router();

router.post('/create', paymentController.createPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

export default router;