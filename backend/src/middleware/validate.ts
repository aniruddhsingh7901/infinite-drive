// src/middleware/validate.ts
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

interface OrderRequest {
    customerEmail: string;
    bookId: string;
    format: 'PDF' | 'EPUB';
    amount: number;
}

export const validateOrder = [
    body('customerEmail').isEmail(),
    body('bookId').isMongoId(),
    body('format').isIn(['PDF', 'EPUB']),
    body('amount').isNumeric(),
    (req: Request<{}, {}, OrderRequest>, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];