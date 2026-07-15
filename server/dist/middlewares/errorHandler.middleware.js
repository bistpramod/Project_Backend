"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    console.log(error);
    const message = error?.message ?? "Internal server error";
    let status = error?.status ?? "error";
    let statusCode = error?.statusCode ?? 500;
    const success = false;
    if (error?.cause?.code === 11000) {
        statusCode = 400;
        status = "fail";
    }
    res.status(statusCode).json({
        message,
        success,
        status,
        data: null,
        details: error?.errors ?? null,
        original_error: error?.stack,
    });
};
exports.errorHandler = errorHandler;
