import { Request, Response, NextFunction } from 'express';

// src/middleware/error.ts
interface ErrorResponse {
    error: string;
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' } as ErrorResponse);
};