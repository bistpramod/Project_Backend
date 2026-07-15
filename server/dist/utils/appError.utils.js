"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode, errors) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.errors = errors;
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.isOperation = true;
        this.errors = errors;
        Error.captureStackTrace(this, AppError);
    }
}
exports.default = AppError;
//! this code is used in all kind of projects so its like you can copy paste all this code
