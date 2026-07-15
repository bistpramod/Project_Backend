import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Product from "../models/product.model";
import appError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { upload } from "../utils/cloudinary.utils";

const uploadFolder = "/product_picture";

//* Create Product
export const create = catchAsync(
  async (req: Request, res: Response) => {
    const { name, description, brand, price, category } = req.body;
    const file = req.file;

    if (!name) {
      throw new appError("name is required.", 400);
    }

    if (!description) {
      throw new appError("description is required.", 400);
    }

    if (!brand) {
      throw new appError("brand is required.", 400);
    }

    if (!price) {
      throw new appError("price is required.", 400);
    }

    if (!category) {
      throw new appError("category is required.", 400);
    }

    if (!file) {
      throw new appError("product image is required.", 400);
    }

    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      throw new appError("Product already exists.", 400);
    }

    const categoryRef = await mongoose
      .model("category")
      .findOne({ name: "mobile" });

    if (!categoryRef) {
      throw new appError("Category not found.", 404);
    }

    const brandRef = await mongoose
      .model("brand")
      .findOne({ name: "Apple" });

    if (!brandRef) {
      throw new appError("Brand not found.", 404);
    }

    const { path, public_id } = await upload(file, uploadFolder);

    const product = new Product({
      name,
      description,
      price,
      brand: brandRef._id,
      category: categoryRef._id,
      cover_image: {
        path,
        public_id,
      },
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  },
);

//* Get all products
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      status: "success",
      message: "All products fetched.",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

//* Get product by id
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      throw new appError("Product not found.", 404);
    }

    res.status(200).json({
      success: true,
      status: "success",
      message: `Product ${id} fetched.`,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

//* Update product
export const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!product) {
      return next(new appError("Product not found.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  },
);

//* Delete product
export const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(new appError("Product not found.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  },
);

//* Get products by category
export const getByCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    const products = await Product.find({
      category: categoryId,
    });

    if (products.length === 0) {
      throw new appError("No products found.", 404);
    }

    res.status(200).json({
      success: true,
      message: "Products fetched by category.",
      data: products,
    });
  },
);

//* Get products by brand
export const getByBrand = catchAsync(
  async (req: Request, res: Response) => {
    const { brandId } = req.params;

    const products = await Product.find({
      brand: brandId,
    });

    if (products.length === 0) {
      throw new appError("No products found.", 404);
    }

    res.status(200).json({
      success: true,
      message: "Products fetched by brand.",
      data: products,
    });
  },
);

//* Get new arrivals
export const getNewArrivals = catchAsync(
  async (req: Request, res: Response) => {
    const products = await Product.find({
      new_arrival: true,
    });

    if (products.length === 0) {
      throw new appError("New arrivals not found.", 404);
    }

    res.status(200).json({
      success: true,
      message: "New arrivals fetched.",
      data: products,
    });
  },
);

//* Get featured products
export const getFeatured = catchAsync(
  async (req: Request, res: Response) => {
    const products = await Product.find({
      is_featured: true,
    });

    if (products.length === 0) {
      throw new appError("Featured products not found.", 404);
    }

    res.status(200).json({
      success: true,
      message: "Featured products fetched.",
      data: products,
    });
  },
);