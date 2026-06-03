import type { Request, Response, NextFunction } from "express";

interface AppError extends Error {
    statusCode?: number;
}

export const ErrorHandler = (
    error: AppError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error(`ERROR ${req.method} ${req.url} - ${error.message}`);
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
    });
};
