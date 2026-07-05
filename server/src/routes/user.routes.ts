import  express  from "express";

import { getAllAdmins , getById , getAll} from "../controllers/user.controller";

const router = express.Router()
//* get all users 

router.get('/', getAll)
router.get('/admins', getAllAdmins)

//* get user by id
router.get("/:id", getById)

export default router