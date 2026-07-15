import { Router } from "express";

import {
  create,
  deleteProduct,
  getAllProducts,
  getByBrand,
  getByCategory,
  getFeatured,
  getNewArrivals,
  getProductById,
  update,
} from "../controllers/product.controller";

import { uploader } from "../middlewares/multer.middlewares";
import { authenticate } from "../middlewares/auth.middlewares";
import { All_Admins } from "../types/enum.types";

const router = Router();
const upload = uploader();

// getAll
router.get("/", getAllProducts);

// getNewArrivals
router.get("/new_arrivals", getNewArrivals);

// getFeatured
router.get("/is_featured", getFeatured);

// getById
router.get("/:id", getProductById);

// getByBrand
router.get("/brand/:brandId", getByBrand);

// getByCategory
router.get("/category/:categoryId", getByCategory);

// create
router.post(
  "/",
  upload.fields([
    {
      name: "cover_image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  authenticate(All_Admins),
  create,
);

// update
router.put(
  "/:id",
  upload.fields([
    {
      name: "cover_image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  authenticate(All_Admins),
  update,
);

// delete
router.delete("/:id", authenticate(All_Admins), deleteProduct);

export default router;