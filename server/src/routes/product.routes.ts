import express from "express";

import {
  create,
  getAllProducts,
  getByBrand,
  getByCategory,
  getProductById,
  getFeatured,
  getNewArrivals,
  deleteProduct,
  update,
} from "../controllers/product.controller";

import { uploader } from "../middlewares/multer.middlewares";
import { authenticate } from "../middlewares/auth.middlewares";
import { All_Admins } from "../types/enum.types";

// import { uploader } from "../middlewares/multer.middleware";
// import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();
const upload = uploader();

router.get("/", getAllProducts);

router.get("/new_arrivals", getNewArrivals);

router.get("/is_featured", getFeatured);

router.get("/:id", getProductById);

router.post(
  "/",
  upload.single("cover_image"),
  authenticate(All_Admins),
  create,
);

router.put(
  "/:id",
  upload.single("cover_image"),
  authenticate(All_Admins),
  update,
);

router.delete(
  "/:id",
  authenticate(All_Admins),
  deleteProduct,
);

router.get("/brand/:brandId", getByBrand);

router.get("/category/:categoryId", getByCategory);

export default router;