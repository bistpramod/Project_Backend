import express from "express";
import {
  create,
  deleteBrand,
  getAllBrands,
  getBrandById,
  update,
} from "../controllers/brand.controller";
import { uploader } from "../middlewares/multer.middlewares";
import { authenticate } from "../middlewares/auth.middlewares";
import { All_Admins } from "../types/enum.types";

const upload = uploader();

const router = express.Router();

// getAll
router.get("/", getAllBrands);

// getById
router.get("/:id", getBrandById);

// create
router.post("/", upload.single("logo"), authenticate(All_Admins), create);

// update
router.put("/:id", upload.single("logo"),authenticate(All_Admins), update);


// delete
router.delete("/:id", deleteBrand);

export default router;

// do on other routers too
