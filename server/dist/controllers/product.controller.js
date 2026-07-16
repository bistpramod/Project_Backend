"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByCategory = exports.getByBrand = exports.getNewArrivals = exports.getFeatured = exports.remove = exports.getById = exports.getAll = exports.createProduct = exports.deleteProduct = exports.update = exports.getProductById = exports.getAllProducts = exports.create = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = __importDefault(require("../models/product.model"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const Folder = "/product_picture";
//* Create Product
exports.create = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { name, description, brand, price, category, new_arrival, is_featured } = req.body;
    const files = req.files;
    if (!name)
        throw new appError_utils_1.default("Name is required.", 400);
    if (!description)
        throw new appError_utils_1.default("Description is required.", 400);
    if (!brand)
        throw new appError_utils_1.default("Brand is required.", 400);
    if (!price)
        throw new appError_utils_1.default("Price is required.", 400);
    if (!category)
        throw new appError_utils_1.default("Category is required.", 400);
    if (!files || !files.cover_image || !files.cover_image[0]) {
        throw new appError_utils_1.default("Cover image is required.", 400);
    }
    const existingProduct = await product_model_1.default.findOne({ name });
    if (existingProduct) {
        throw new appError_utils_1.default("Product already exists.", 400);
    }
    const categoryRef = await mongoose_1.default
        .model("category")
        .findOne({ name: category });
    if (!categoryRef) {
        throw new appError_utils_1.default("Category not found.", 404);
    }
    const brandRef = await mongoose_1.default
        .model("brand")
        .findOne({ name: brand });
    if (!brandRef) {
        throw new appError_utils_1.default("Brand not found.", 404);
    }
    // Create product
    const product = new product_model_1.default({
        name,
        description,
        price,
        brand: brandRef._id,
        category: categoryRef._id,
        new_arrival: new_arrival || false,
        is_featured: is_featured || false,
    });
    // Upload cover_image
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(files.cover_image[0], Folder);
    product.cover_image = {
        path,
        public_id,
    };
    // Promise.all()
    // Upload images
    if (files.images && files.images.length > 0) {
        const promises = files.images.map((file) => (0, cloudinary_utils_1.upload)(file, Folder));
        // product.images = await Promise.all(promises);
        const file = await Promise.allSettled(promises); // file is changed to file to avaoid the conflict
        const fullFilled = file
            .filter((promise) => promise.status === "fulfilled")
            .map((img) => img.value);
        product.set("images", fullFilled);
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
exports.getAllProducts = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const products = await product_model_1.default.find();
    res.status(200).json({
        success: true,
        message: "All products fetched.",
        data: products,
    });
});
//* Get product by id
exports.getProductById = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const product = await product_model_1.default.findById(id);
    if (!product)
        throw new appError_utils_1.default("Product not found.", 404);
    res.status(200).json({
        success: true,
        message: `Product ${id} fetched.`,
        data: product,
    });
});
//* Update product
exports.update = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, price, brand, category, new_arrival, is_featured, cover_image, } = req.body;
    const product = await product_model_1.default.findById(id);
    if (!product) {
        return next(new appError_utils_1.default("Product not found.", 404));
    }
    if (name)
        product.name = name;
    if (description)
        product.description = description;
    if (price)
        product.price = price;
    if (brand)
        product.brand = brand;
    if (category)
        product.category = category;
    if (typeof new_arrival !== "undefined")
        product.new_arrival = new_arrival;
    if (typeof is_featured !== "undefined")
        product.is_featured = is_featured;
    //* update cover images 
    //code 
    if (cover_image && cover_image[0]) {
        (0, cloudinary_utils_1.deleteFile)(product.cover_image.public_id);
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(cover_image[0], Folder);
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
});
//* Delete product
exports.deleteProduct = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const product = await product_model_1.default.findOne({ _id: id });
    if (!product) {
        return next(new appError_utils_1.default("Product not found.", 404));
    }
    // delete cover image
    await (0, cloudinary_utils_1.deleteFile)(product.cover_image.public_id);
    // delete images
    if (product.images && product.images.length > 0) {
        await Promise.allSettled(product.images.map((image) => (0, cloudinary_utils_1.deleteFile)(image.public_id)));
    }
    // delete product
    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: `Product: ${id} deleted`,
        data: null,
    });
});
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
exports.createProduct = exports.create;
exports.getAll = exports.getAllProducts;
exports.getById = exports.getProductById;
exports.remove = exports.deleteProduct;
exports.getFeatured = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const products = await product_model_1.default.find({ is_featured: true });
    res.status(200).json({
        success: true,
        message: "Featured products fetched.",
        data: products,
    });
});
exports.getNewArrivals = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const products = await product_model_1.default.find({ new_arrival: true });
    res.status(200).json({
        success: true,
        message: "New arrival products fetched.",
        data: products,
    });
});
exports.getByBrand = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { brandId } = req.params;
    const products = await product_model_1.default.find({ brand: brandId });
    if (!products.length) {
        throw new appError_utils_1.default("No products found for this brand.", 404);
    }
    res.status(200).json({
        success: true,
        message: "Products fetched by brand.",
        data: products,
    });
});
exports.getByCategory = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { categoryId } = req.params;
    const products = await product_model_1.default.find({ category: categoryId });
    if (!products.length) {
        throw new appError_utils_1.default("No products found for this category.", 404);
    }
    res.status(200).json({
        success: true,
        message: "Products fetched by category.",
        data: products,
    });
});
