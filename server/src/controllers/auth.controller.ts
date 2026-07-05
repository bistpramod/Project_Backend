import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import {hashPassword} from "../utils/bcrypt.utils"
import appError from "../utils/appError.utils";
// its the controller

// register

export const register = async (
  req: Request, // the types are defined , next because of middlewares used 
  res: Response,
  next: NextFunction,
) => {
  try {
    //* body
    const { full_name, email, password } = req.body;

    if (!full_name) {
    //   const error: any = new Error("Full name is required ");
    //   error.statusCode = 400;
    //   error.status = "fail";
    //   throw error;
    throw new appError("full name is requred ", 400)
    }
    if (!email) {
     throw new appError("email is requred ", 400)
    }
    if (!password) { // we can still do like this in a traditional way , but when the conditions esceed too  much we have to minimize the code 
      const error: any = new Error("password is required ");
      error.statusCode = 400;
      error.status = "fail";
      throw error;
    }
    // const user = await User({ email, password, full_name});
    const user = new User({ email, password, full_name});

    //* hash Password 
    const hashpass = await hashPassword(password);
        user.password= hashpass;


    // hash password
    // handle profile image upload

    //! save the suser
    await user.save();

    //* success response
    res.status(201).json({
      message: "account created",
      success: true,
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// login

// change password
