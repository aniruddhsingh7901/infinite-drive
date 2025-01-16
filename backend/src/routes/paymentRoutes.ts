
import { Request, Response, Router } from 'express';
import PaymentController from '../controllers/paymentController';
import paymentAuth from '../middleware/paymentMiddleware';
import { PaymentService } from '../services/paymentService'; // Fixed import
import { BlockchainService } from '../services/blockchainService';
const blockchainService = new BlockchainService();


const router = Router();
const paymentService = new PaymentService();

router.post('/create', paymentAuth, PaymentController.createPayment.bind(PaymentController));

router.get('/check/:orderId', paymentAuth, PaymentController.checkPayment.bind(PaymentController));





router.get('/address/:currency', paymentAuth, async (req: Request, res: Response) => {
    try {
        const address = await paymentService.generatePaymentAddress(req.params.currency);
        res.json({ success: true, address });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Invalid currency'
        });
    }
});

export default router;