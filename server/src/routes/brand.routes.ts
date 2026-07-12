import express from "express";
import {
  create,
  deleteBrand,
  getAllBrands,
  getBrandById,
  update,
} from "../controllers/brand.controller";
import { uploader } from "../middlewares/multer.middlewares";

const upload = uploader();

const router = express.Router();

// getAll
router.get("/", getAllBrands);

// getById
router.get("/:id", getBrandById);

// create
router.post("/", upload.single("logo"), create);

// update
router.put("/:id", upload.single("logo"), update);

// delete
router.delete("/:id", deleteBrand);

export default router;