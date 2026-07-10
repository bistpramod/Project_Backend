import express from "express";
import { uploader } from "../middlewares/multer.middlewares";
import { login, register } from "../controllers/auth.controller";

const router = express.Router();

const upload = uploader();

//* register
router.post("/register", upload.single("profile_image"), register); // its just the router

//* login
router.post("/login", login);

export default router;
