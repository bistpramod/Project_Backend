import express from "express";
import {
  
  createBrand,
  getAllBrands,
  getBrandById,

} from "../controllers/brand.controller";

// not update delete and update features 


const router = express.Router();
router.route("/").get(getAllBrands).post(createBrand);
router.route("/:id").get(getBrandById)

export default router;
