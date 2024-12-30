import express from 'express';
import { orderController } from '../controllers/orderController';

const router = express.Router();

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrder);
router.get('/:id/download', orderController.handleDownload);

export default router;