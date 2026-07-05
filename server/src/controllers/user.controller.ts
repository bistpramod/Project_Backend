// get all users

// remaining

import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";

export const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //*find all the users

    const admins = await User.find({
      role: {
        $in: ["ADMIN", "SUPERADMIN"],
      },
    });

    //* send messages about success response 

    res.status(200).json({
        message: "All users fetched",
        status:"success",
        success:true,
        data:admins,

    })
  } catch (error) {
    next(error);
  }
};

// get all admins

// get user by id

export  const getById = async (
    req:Request,
    res:Response,
    next:NextFunction,

)=>{

    try{

    }
    catch(error){

    }

}
