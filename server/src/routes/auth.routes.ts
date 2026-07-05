import express from "express";
import { register } from "../controllers/auth.controller";

const router = express.Router();

//* register
router.post('/register', register)  // its just the router 

//* login



export default router; 

    