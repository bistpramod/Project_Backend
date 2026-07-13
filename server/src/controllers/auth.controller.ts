import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { comparePassword, hashPassword } from "../utils/bcrypt.utils";
import appError from "../utils/appError.utils";
import { upload, deleteFile } from "../utils/cloudinary.utils";
import { generateJwtToken } from "../utils/jwt.utils";
import { IJwtPayload } from "../types/global.types";
import ENV_CONFIG from "../config/env.config";
import { sendResponse } from "../utils/sendResponse.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import AppError from "../utils/appError.utils";
import { sendEmail } from "../utils/emailServer.utils";
const uploadFolder = "/profile_images";

// register
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { full_name, email, password } = req.body;
    const file = req.file;

    console.log(file);

    if (!full_name) {
      throw new appError("full name is requred ", 400);
    }

    if (!email) {
      throw new appError("email is requred ", 400);
    }

    if (!password) {
      const error: any = new Error("password is required ");
      error.statusCode = 400;
      error.status = "fail";
      throw error;
    }

    const user = new User({ email, password, full_name });

    //* hash Password
    const hashpass = await hashPassword(password);
    user.password = hashpass;

    //* upload profile image
    if (file) {
      const { path, public_id } = await upload(file, uploadFolder);

      user.profile_image = {
        path,
        public_id,
      };
    }

    await user.save();
//* send account created email
    sendEmail({
      to: user.email,
      subject: "Account created",
      html: `<div>
      <h2>Account created</h2>
      <p>Hello ${user.full_name}, welcome to out service</p>
      </div>`,
    });
    // Remove password before sending response
    const { password: user_pass, ...rest } = user.toObject();

    res.status(201).json({
      message: "account created",
      success: true,
      status: "success",
      data: rest,
    });
  } catch (error) {
    next(error);
  }
};

// login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new appError(" email is required", 400);
    }

    if (!password) {
      throw new appError("password is required", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new appError("credentialsdoes not match ", 400);
    }

    //* compare password
    const isPassMatched = await comparePassword(password, user.password);

    if (!isPassMatched) {
      throw new appError(" credentials do not match at all . ", 400);
    }

    // Remove password before sending response
    const { password: user_pass, ...rest } = user.toObject();

    //* generate jwt token
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

// change profile image
export const changeProfileImage = catchAsync(
  async (req: Request, res: Response) => {
    const { _id } = req.user;
    const file = req.file;

    if (!file) {
      throw new AppError("profile image is required", 400);
    }

    const user = await User.findOne({ _id });

    if (!user) {
      throw new AppError("Profile not found", 400);
    }

    if (user.profile_image && user.profile_image.public_id) {
      await deleteFile(user.profile_image.public_id);
    }

    const { path, public_id } = await upload(file, uploadFolder);

    user.profile_image = {
      path,
      public_id,
    };

    //* You probably also want to save the updated user
    await user.save();

    sendResponse(res, {
      message: "Profile updated",
      statusCode: 200,
      data: user,
    });
  },
);

// change password

// forgot password

// change email