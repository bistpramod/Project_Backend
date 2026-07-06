//name 
// description
// logo 

// do crud tooo


//* create a brand schema

//* brand model

//* file upload and image upload is due to tomorrow



//! its the user details containg different values

import mongoose from "mongoose";

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
const brandSchema = new mongoose.Schema(
  {
    brand_name: {
      type: String,
      required: [true,"brand name is always required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true,"brand email is always required"],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Brand = mongoose.model("brand", brandSchema)
export default  Brand;