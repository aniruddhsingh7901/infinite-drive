import { Request, Response, NextFunction } from 'express';

interface PaymentRequest extends Request {
    body: {
        email?: string;
        cryptocurrency?: string;
        bookId?: string;
    };
    params: {
        orderId?: string;
    };
}

export const paymentAuth = async (
    req: PaymentRequest,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        if (req.method === 'POST') {
            const { email, cryptocurrency, bookId } = req.body;
            
            if (!email || !cryptocurrency || !bookId) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email format'
                });
            }
        }

        if (req.method === 'GET' && req.params.orderId) {
            if (!req.params.orderId.match(/^[a-zA-Z0-9-]+$/)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid order ID format'
                });
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default paymentAuth;

