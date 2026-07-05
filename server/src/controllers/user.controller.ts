

// remaining

import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import AppError from "../utils/appError.utils";

//! get all users


export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {

    //* find all users
    
    const users = await User.find({ role: "USER" });

    res.status(200).json({
      message: "All users fetched",
      status: "success",
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};



//! get all admins
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


//! get user by id

export  const getById = async (
    req:Request,
    res:Response,
    next:NextFunction,

)=>{

    try{
         const {id} = req.params;
         const user = await  User.findOne({_id:id})
         if(!user){
            throw new AppError("user not found",404)
         }
         res.status(200).json({
            message:`user: ${id} fetched`,
            success:true,
            status:"success",
            data : user,

         })
    }
    catch(error){

    }

}
