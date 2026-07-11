import { NextFunction, Request, Response } from "express";
import Brand from "../models/brand.model";
import appError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { upload } from "../utils/cloudinary.utils";

const uploadFolder = "/brands";
/**
 * BRAND CONTROLLER
 * Handles all brand-related operations
 */

/**
 * Create a new brand
 * @param req - Express request object
 * @param res - Express response object
 */
export const create = catchAsync(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  // req.file / files
  const file = req.file;
  // TODO: Handle req.file / files for logo upload

  if (!name) {
    throw new appError("name required.", 400);
  }

  if (!file) {
    throw new appError("logo is required.", 400);
  }

  const existingBrand = await Brand.findOne({ name });

  if (existingBrand) {
    throw new appError("Brand already exists.", 400);
  }
   //* upload to cloudinary
  const { path, public_id } = await upload(file, uploadFolder);

  //profile_image = {path:'',public_id:''}
  // profile_image = ''

  brand.logo = {
    path,
    public_id,
  };

  const brand = new Brand({
    name,
    description,
  });

  // Save brand to database
  await brand.save();

  res.status(201).json({
    success: true,
    message: "Brand created successfully.",
    data: brand,
  });
});

//? get all brands
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

//? create a new brand
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

//? Get brand by id

export const getBrandById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);

    if (!brand) {
      throw new appError("brand not found", 404);
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


//* Update Brand
export const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!brand) {
      return next(new appError("Brand not found.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Brand updated successfully.",
      data: brand,
    });
  },
);

//* Delete Brand
export const deleteBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return next(new appError("Brand not found.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully.",
    });
  },
);
