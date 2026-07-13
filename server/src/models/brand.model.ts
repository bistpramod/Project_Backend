//name 
// description
// logo 

// do crud tooo


//* create a brand schema

//* brand model

//* file upload and image upload is due to tomorrow



//! its the user details containg different values

// import mongoose from "mongoose"; // wrong: duplicate import — mongoose is imported below with Schema and Document

//* brand schema

// const brandSchema = new mongoose.Schema(
// //   {
//     brand_name: {
//       type: String,
//       required: [true, "Brand name should be specified"],
//       minLength: [3, "brand name  must be at least 3  characters "],

//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "email is required"],

//       unique: [true, " user with the same email already exists "],
//       trim: true,
//     },
   
//   
//     phone: {
//       type: String,
//       maxLength: [10 , " phone number at most 10 digits long"], 
     
//     },
//   },
//   { timestamps: true },
// );




//! updated brand Schema
import mongoose, { Schema, Document } from "mongoose";
import ImageSchema from "./image.model";
import { IImage } from "../types/global.types";

//* Interface
export interface IBrand extends Document {
  name: string;
  description?: string;
  logo: IImage;
}

//* Brand Schema
const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
      unique: true,
      minLength: 2,
      maxLength: 100,
    },

    description: {
      type: String,
      trim: true,
      minLength: 5,
      maxLength: 500,
    },

    logo: {
      type: ImageSchema,
      required: [true, "Logo is required"],
    },
  },
  {
    timestamps: true,
  },
);

//* Brand Model
const Brand = mongoose.model<IBrand>("brand", brandSchema);

export default Brand;