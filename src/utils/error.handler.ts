import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    if (err.message.includes('Validation error')) {
        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    }

    console.error('ERROR:', err);
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
};