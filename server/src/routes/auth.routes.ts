import express from "express";
import multer from "multer"
import { login, register } from "../controllers/auth.controller";

// multer upload instance
const upload = multer({ dest: "uploads/" });

const router = express.Router();

//* register
router.post("/register", upload.single("ProfileImage"),register)

//* register
router.post('/register', register)  // its just the router 

//* login
router.post('/login', login)  



export default router; 

    