"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const brand_controller_1 = require("../controllers/brand.controller");
const multer_middlewares_1 = require("../middlewares/multer.middlewares");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const enum_types_1 = require("../types/enum.types");
const upload = (0, multer_middlewares_1.uploader)();
const router = express_1.default.Router();
// getAll
router.get("/", brand_controller_1.getAllBrands);
// getById
router.get("/:id", brand_controller_1.getBrandById);
// create
router.post("/", upload.single("logo"), (0, auth_middlewares_1.authenticate)(enum_types_1.All_Admins), brand_controller_1.create);
// update
router.put("/:id", upload.single("logo"), (0, auth_middlewares_1.authenticate)(enum_types_1.All_Admins), brand_controller_1.update);
// delete
router.delete("/:id", brand_controller_1.deleteBrand);
exports.default = router;
// do on other routers too
