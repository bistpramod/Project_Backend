import express from "express";

import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import brandRoutes from "./brand.routes";
// each router has been imported from the required destination

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/brands", brandRoutes);

export default router;