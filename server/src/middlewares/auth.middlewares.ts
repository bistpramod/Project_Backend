import { Request, Response } from "express";
import { Role } from "../types/enum.types";
import { NextFunction } from "express";
import AppError from "../utils/appError.utils";
import { verifyJwtToken } from "../utils/jwt.utils";
import { IJwtReturn } from "../types/global.types";
import ENV_CONFIG from "../config/env.config";
//* 1. login
//* 2. authorized ?

export const authenticate = (roles?: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Authorization header  / cookies
      console.log(req.headers)
      //* 1. get access_token

      const cookies = req.cookies;
      // console.log(cookies)
      const access_token = cookies.access_token;
      console.log(access_token)
      if (!access_token) {
        throw new AppError("unAuthorized", 401)
      }
      //* 2. verify access token
      const decoded_data = verifyJwtToken(access_token);
      if (!decoded_data) {
        throw new AppError("unAuthorized", 401)
      }
      console.log(decoded_data)
      //* 3. check token expiry
      // how to check if the token is expired or not
      if ((decoded_data as IJwtReturn).exp*100 <Date.now()) {
        //* clear cookies
        res.clearCookie("access_token",{
          httpOnly: ENV_CONFIG.NODE_ENV === "production"?false:true,
          secure: ENV_CONFIG.NODE_ENV === "production"?true:false,
          maxAge: 0,
          sameSite: ENV_CONFIG.NODE_ENV === "production"?"none":"lax",
        });
        throw new AppError("unAuthorized", 401)
      }
      //* 4.check role
      if(roles && roles.length> 0 && !roles.includes(decoded_data.role)){
        throw new AppError("accessdenied ", 403)
      }
      
    next();
  } catch (error) {
    next(error);
  }
}}