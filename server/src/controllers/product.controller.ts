import { Request, Response } from "express";
import mongoose from "mongoose";

import Product from "../models/product.model";
import appError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { upload } from "../utils/cloudinary.utils";

const uploadFolder = "/product_picture";

//* Create Product
export const create = catchAsync(async (req: Request, res: Response) => {
  const { name, description, brand, price, category } = req.body;
  const file = req.file;

  if (!name) throw new appError("Name is required.", 400);
  if (!description) throw new appError("Description is required.", 400);
  if (!brand) throw new appError("Brand is required.", 400);
  if (!price) throw new appError("Price is required.", 400);
  if (!category) throw new appError("Category is required.", 400);
  if (!file) throw new appError("Product image is required.", 400);

  const existingProduct = await Product.findOne({ name });

  if (existingProduct) {
    throw new appError("Product already exists.", 400);
  }

  const categoryRef = await mongoose
    .model("category")
    .findOne({ name: category });

  if (!categoryRef) {
    throw new appError("Category not found.", 404);
  }

  const brandRef = await mongoose
    .model("brand")
    .findOne({ name: brand });

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
    product_image: {
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
});

//* Get all products
export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      message: "All products fetched.",
      data: products,
    });
  },
);

//* Get product by id
export const getProductById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) throw new appError("Product not found.", 404);

    res.status(200).json({
      success: true,
      message: `Product ${id} fetched.`,
      data: product,
    });
  },
);

//* Update product
export const update = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) throw new appError("Product not found.", 404);

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  },
);

//* Delete product
export const deleteProduct = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) throw new appError("Product not found.", 404);

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

    if (!products.length) {
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

    if (!products.length) {
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

    if (!products.length) {
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

    if (!products.length) {
      throw new appError("Featured products not found.", 404);
    }

    res.status(200).json({
      success: true,
      message: "Featured products fetched.",
      data: products,
    });
  },
);