import express from "express";
import {
  createProduct,
  getAll,
  getByBrand,
  getByCategory,
  getById,
  getFeatured,
  getNewArrivals,
  remove,
  update,
} from "../controllers/product.controller";
import { uploader } from "../middlewares/multer.middlewares";
import { authenticate } from "../middlewares/auth.middlewares";
import { All_Admins } from "../types/enum.types";

const router = express.Router();
const upload = uploader();


router.get("/", getAll);

router.get("/new_arrivals", getNewArrivals);

router.get("/is_featured", getFeatured);

router.get("/:id", getById);

router.post("/",upload.single("cover_image"),authenticate(All_Admins), createProduct);

router.put("/:id",upload.single("cover_image"),authenticate(All_Admins), update);

router.delete("/:id",authenticate(All_Admins), remove);

router.get("/brand/:brandId", getByBrand);

router.get("/category/:categoryId", getByCategory);

export default router;