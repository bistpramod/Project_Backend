import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { comparePassword, hashPassword } from "../utils/bcrypt.utils";
import appError from "../utils/appError.utils";
import { upload } from "../utils/cloudinary.utils";
// import { generateJwtToken } from "../utils/jwt.utils";
// import { IJwtPayload } from "../types/global.types";
import { generateJwtToken } from "../utils/jwt.utils";
import { IJwtPayload } from "../types/global.types";
import ENV_CONFIG from "../config/env.config";
import { sendResponse } from "../utils/sendResponse.utils";

const uploadFolder = "/profile_images";

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
    const file = req.file;
    console.log(file)

    if (!full_name) {
      //   const error: any = new Error("Full name is required ");
      //   error.statusCode = 400;
      //   error.status = "fail";
      //   throw error;
      throw new appError("full name is requred ", 400);
    }
    if (!email) {
      throw new appError("email is requred ", 400); //! new method to throw the password
    }
    if (!password) {
      // we can still do like this in a traditional way , but when the conditions esceed too  much we have to minimize the code
      const error: any = new Error("password is required ");
      error.statusCode = 400;
      error.status = "fail";
      throw error;
    }
    // const user = await User({ email, password, full_name});
    const user = new User({ email, password, full_name });

    //* hash Password
    const hashpass = await hashPassword(password);
    user.password = hashpass;

    // hash password
    // handle profile image upload
      if (file) {
      //* upload to cloudinary
      const { path, public_id } = await upload(file, uploadFolder);

      //profile_image = {path:'',public_id:''}
      // profile_image = ''

      user.profile_image = {
        path,
        public_id,
      };
    }

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

//* login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // email. and password
    const { email, password } = req.body;
    if (!email) {
      throw new appError(" email is required", 400);
    }
    if (!password) {
      throw new appError("password is required", 400);
    }

    // find yser by email

    const user = await User.findOne({ email });
    if (!user) {
      throw new appError("credentialsdoes not match ", 400);
    }

    //* compare password
    const isPassMatched = await comparePassword(password, user.password);
    if (!isPassMatched) {
      throw new appError(" credentials do not match at all . ", 400);
    }

    //todo: generate jwt token
    //todo: generate jwt token
    const payload: IJwtPayload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    const access_token = generateJwtToken(payload);

    res.cookie("access_token", access_token, {
      httpOnly: ENV_CONFIG.NODE_ENV === "development" ? false : true,
      secure: ENV_CONFIG.NODE_ENV === "development" ? false : true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: ENV_CONFIG.NODE_ENV === "development" ? "lax" : "none",
    });
    //* send success response
    sendResponse(res, {
      message: "Login success",
     
      statusCode: 201,
      data: {
        user: rest,
        access_token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// change password
