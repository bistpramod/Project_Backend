import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import Product from "../models/product.model";
import appError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { deleteFile, upload } from "../utils/cloudinary.utils";

const Folder = "/product_picture";

//* Create Product
export const create = catchAsync(async (req: Request, res: Response) => {
  const { name, description, brand, price, category, new_arrival, is_featured } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!name) throw new appError("Name is required.", 400);
  if (!description) throw new appError("Description is required.", 400);
  if (!brand) throw new appError("Brand is required.", 400);
  if (!price) throw new appError("Price is required.", 400);
  if (!category) throw new appError("Category is required.", 400);
  if (!files || !files.cover_image || !files.cover_image[0]) {
    throw new appError("Cover image is required.", 400);
  }

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

  // Create product
  const product = new Product({
    name,
    description,
    price,
    brand: brandRef._id,
    category: categoryRef._id,
    new_arrival: new_arrival || false,
    is_featured: is_featured || false,
  });

  // Upload cover_image
  const { path, public_id } = await upload(files.cover_image[0], Folder);
  product.cover_image = {
    path,
    public_id,
  };

  // Promise.all()
  // Upload images
  if (files.images && files.images.length > 0) {
    const promises = files.images.map((file) => upload(file, Folder));
    // product.images = await Promise.all(promises);
    const file = await Promise.allSettled(promises); // file is changed to file to avaoid the conflict
    const fullFilled = file
      .filter(
        (promise) => promise.status === "fulfilled",)
      .map((img) => img.value)
    product.set("images", fullFilled)


  }

  // Save product
  await product.save();

  // Send response
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
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      brand,
      category,
      new_arrival,
      is_featured,
      cover_image,

    } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return next(new appError("Product not found.", 404));
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (brand) product.brand = brand;
    if (category) product.category = category;
    if (typeof new_arrival !== "undefined") product.new_arrival = new_arrival;
    if (typeof is_featured !== "undefined") product.is_featured = is_featured;
    //* update cover images 
    //code 
    if(cover_image && cover_image[0]){
      deleteFile(product.cover_image.public_id);
      const { path, public_id } = await upload(cover_image[0], Folder);
      product.cover_image = {
        path,
        public_id,
      };
    }

    //* update images 
    // code
    

    //save product 
    await product.save();
    //* send success response 
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
    const { id } = req.params;
    const product = await Product.findOne({ _id: id });

    if (!product) {
      return next(new appError("Product not found.", 404));
    }

    // delete cover image
    await deleteFile(product.cover_image.public_id);

    // delete images
    if (product.images && product.images.length > 0) {
      await Promise.allSettled(
        product.images.map((image) => deleteFile(image.public_id)),
      );
    }

    // delete product
    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: `Product: ${id} deleted`,
      data: null,
    });
  },
);

//
// //* Get products by category
// export const getByCategory = catchAsync(
//   async (req: Request, res: Response) => {
//     const { categoryId } = req.params;

//     const products = await Product.find({
//       category: categoryId,
//     });

//     if (!products.length) {
//       throw new appError("No products found.", 404);
//     }

//     res.status(200).json({
//       success: true,
//       message: "Products fetched by category.",
//       data: products,
//     });
//   },
// );


