import { NextFunction, Request, Response } from "express";
import Brand from "../models/brand.model";
import AppError from "../utils/appError.utils";

// its the brand controller

// get all brands


// ! THERE IS A DIFFERENT METHOD FOR TRY AND CATCH
export const getAllBrands = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brands = await Brand.find();

    res.status(200).json({
      message: "All brands fetched",
      status: "success",
      success: true,
      data: brands,
    });
  } catch (error) {
    next(error);
  }
};

// creating brand 
export const createBrand = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brand = new Brand(req.body);
    await brand.save();

    res.status(201).json({
      message: "brand created",
      success: true,
      status: "success",
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

// get brand by id
export const getBrandById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);

    if (!brand) {
      throw new AppError("brand not found", 404);
    }

    res.status(200).json({
      message: `brand: ${id} fetched`,
      success: true,
      status: "success",
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};
