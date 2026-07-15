"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.update = exports.getBrandById = exports.createBrand = exports.getAllBrands = exports.create = void 0;
const brand_model_1 = __importDefault(require("../models/brand.model"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const uploadFolder = "/brands";
exports.create = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { name, description } = req.body;
    // req.file / files
    const file = req.file;
    // TODO: Handle req.file / files for logo upload
    if (!name) {
        throw new appError_utils_1.default("name required.", 400);
    }
    if (!file) {
        throw new appError_utils_1.default("logo is required.", 400);
    }
    const existingBrand = await brand_model_1.default.findOne({ name });
    if (existingBrand) {
        throw new appError_utils_1.default("Brand already exists.", 400);
    }
    //* upload to cloudinary
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
    //profile_image = {path:'',public_id:''}
    // profile_image = ''
    // brand.logo = { path, public_id }; // wrong: brand was used before it was declared
    const brand = new brand_model_1.default({
        name,
        description,
        logo: {
            path,
            public_id,
        },
    });
    //* Save brand to database
    await brand.save();
    res.status(201).json({
        success: true,
        message: "Brand created successfully.",
        data: brand,
    });
});
//? get all brands
const getAllBrands = async (req, res, next) => {
    try {
        const brands = await brand_model_1.default.find();
        res.status(200).json({
            message: "All brands fetched",
            status: "success",
            success: true,
            data: brands,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllBrands = getAllBrands;
//? create a new brand
const createBrand = async (req, res, next) => {
    try {
        const brand = new brand_model_1.default(req.body);
        await brand.save();
        res.status(201).json({
            message: "brand created",
            success: true,
            status: "success",
            data: brand,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createBrand = createBrand;
//? Get brand by id
const getBrandById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const brand = await brand_model_1.default.findById(id);
        if (!brand) {
            throw new appError_utils_1.default("brand not found", 404);
        }
        res.status(200).json({
            message: `brand: ${id} fetched`,
            success: true,
            status: "success",
            data: brand,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getBrandById = getBrandById;
//* Update Brand
exports.update = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const brand = await brand_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!brand) {
        return next(new appError_utils_1.default("Brand not found.", 404));
    }
    res.status(200).json({
        success: true,
        message: "Brand updated successfully.",
        data: brand,
    });
});
//* Delete Brand
exports.deleteBrand = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const brand = await brand_model_1.default.findByIdAndDelete(req.params.id);
    if (!brand) {
        return next(new appError_utils_1.default("Brand not found.", 404));
    }
    res.status(200).json({
        success: true,
        message: "Brand deleted successfully.",
    });
});
