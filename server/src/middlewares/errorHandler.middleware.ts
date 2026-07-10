import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(error);
  const message = error?.message ?? "internal err";
  let status = error?.status ?? "error";
  let statusCode = error?.statusCode ?? 500;
  const success = false;
  if (error?.cause?.code === 11000) {
    statusCode = 400;
    status = "fail";
  }

  res.status(statusCode).json({
    message, // these are the responses sent by the app , when something error occurs
    status,
    success,
    data: null,
    originalError: error?.stack,
  });
};
