"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// @types/packageName
const app = (0, express_1.default)();
//* ealth route 
app.get("/", (req, res, next) => {
    res.status(200).json({
        message: "server is ready and running ",
        success: true,
        status: "success",
        data: null,
    });
});
exports.default = app;
