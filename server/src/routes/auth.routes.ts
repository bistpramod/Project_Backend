import express from "express";
// Fixed import: middleware filename is `multer.middlewares.ts` (plural).
import { uploader } from "../middlewares/multer.middlewares";
import {
  register,
  login,
  changeProfileImage,
} from "../controllers/auth.controller";
// import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validator.middleware";
import { registerUserSchema } from "../validators/auth.validator";
import { authenticate } from "../middlewares/auth.middlewares";

const router = express.Router();

const upload = uploader();

//* register
router.post(
  "/register",
  upload.single("profile_image"),
  validate(registerUserSchema),
  register,
);

//* login
router.post("/login", login);

//* change profile image
router.put(
  "/profile-image",
  upload.single("profile_image"),
  authenticate(),
  changeProfileImage,
);

//* logout
// router.post('/logout' ,logout)

//* get profile
// router.get('/me', profile)

export default router;