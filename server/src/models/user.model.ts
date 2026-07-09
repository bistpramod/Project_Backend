//! its the user details containg different values

import mongoose from "mongoose";
import { Role } from "../types/enum.types";

//* user schema

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, "full_name is required"],
      minLength: [3, "name  must be at least 3  characters "],

      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],

      unique: [true, " user with the same email already exists "],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [3, "password  must be at least 8 characters "],

      trim: true,
    },
   role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: {
      type: String,
      maxLength: [10 , " phone number at most 10 digits long"], 
     
    },
  },
  { timestamps: true },
);


// user model 

const User = mongoose.model("user", userSchema)
export default User;