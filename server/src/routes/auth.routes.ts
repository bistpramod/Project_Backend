import express from "express";
// import { uploader } from "../middlewares/multer.middleware";
import {
  register,
  login,
  changeProfileImage,
} from "../controllers/auth.controller";
import { uploader } from "../middlewares/multer.middlewares";
import { authenticate } from "../middlewares/auth.middlewares";
// import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

const upload = uploader;

//* register
router.post("/register", upload.single("profile_image"), register);

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
