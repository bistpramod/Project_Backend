"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const router = express_1.default.Router();
//* get all category
router.get("/", category_controller_1.getAll);
//* get by id
router.get("/:id", category_controller_1.getById);
//* create/post
router.post("/", category_controller_1.create);
//* update/put
router.put("/:id", category_controller_1.update);
//* delete
router.delete("/:id", category_controller_1.remove);
exports.default = router;
