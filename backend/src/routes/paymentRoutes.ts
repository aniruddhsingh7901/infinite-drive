// import { Router, Request, Response } from 'express';
// import paymentAuth from '../middleware/paymentMiddleware';
// import createPayment from '../controllers/paymentController';
// import checkPayment from '../controllers/paymentController';
// import getStatus from '../controllers/paymentController';
// import verifyTransaction from '../controllers/paymentController';
// import { PaymentService } from '../services/paymentService';

// interface PaymentMethods {
//     currency: string;
//     name: string;
//     enabled: boolean;
// }

// interface PaymentAddress {
//     currency: string;
//     address: string;
// }

// const router = Router();
// const paymentService = new PaymentService();

// // Create new payment
// router.post('/create', paymentAuth, createPayment);

// // Check payment status
// router.get('/check/:orderId', paymentAuth, checkPayment);

// // Get general payment status
// router.get('/status/:orderId', paymentAuth, getStatus);

// // Verify specific transaction
// router.get('/verify/:orderId/:txHash', paymentAuth, verifyTransaction);

// // Get payment methods/supported cryptocurrencies
// router.get('/methods', async (_req: Request, res: Response) => {
//     try {
//         const methods: PaymentMethods[] = await paymentService.getPaymentMethods();
//         res.json({
//             success: true,
//             methods
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: 'Failed to get payment methods'
//         });
//     }
// });

// // Get payment address for specific cryptocurrency
// router.get('/address/:currency', paymentAuth, async (req: Request, res: Response) => {
//     try {
//         const address: PaymentAddress = await paymentService.getPaymentAddress(
//             req.params.currency
//         );
//         res.json({
//             success: true,
//             address
//         });
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             error: 'Invalid currency'
//         });
//     }
// });

// export default router;

import { Request, Response, Router } from 'express';
import PaymentController from '../controllers/paymentController';
import paymentAuth from '../middleware/paymentMiddleware';
import { PaymentService } from '../services/paymentService'; // Fixed import
import { BlockchainService } from '../services/blockchainService';
const blockchainService = new BlockchainService();
// interface PaymentMethods {
//     currency: string;
//     name: string;
//     enabled: boolean;
// }

// interface PaymentAddress {
//     currency: string;
//     address: string;
// }

const router = Router();
const paymentService = new PaymentService();

router.post('/create', paymentAuth, PaymentController.createPayment.bind(PaymentController));

router.get('/check/:orderId', paymentAuth, PaymentController.checkPayment.bind(PaymentController));

router.get('/methods', async (_req: Request, res: Response) => {
    try {
        const methods = await paymentService.getPaymentMethods();
        res.json({ success: true, methods });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get payment methods'
        });
    }
});

// router.post('/verify-test', async (req: Request, res: Response) => {
//     try {
//         const { currency, address, amount } = req.body;

//         if (!currency || !address || !amount) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Missing required parameters'
//             });
//         }

//         const verification = await blockchainService.verifyPayment(
//             currency,
//             parseFloat(amount),
//             address
//         );

//         res.json({
//             success: true,
//             verification
//         });

//     } catch (error) {
//         console.error('Test verification error:', error);
//         res.status(500).json({
//             success: false,
//             error: error instanceof Error ? error.message : 'Verification failed'
//         });
//     }
// });


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