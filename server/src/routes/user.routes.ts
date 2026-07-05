import  express  from "express";

import { getAllAdmins , getById } from "../controllers/user.controller";

const router = express.Router()
//* get all users 

router.get('/', getAllAdmins)

//* get user by id
router.get("/:id", getById)

export default router