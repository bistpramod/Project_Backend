"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const db_config_1 = require("./config/db.config");
const env_config_1 = __importDefault(require("./config/env.config"));
const nodemailer_config_1 = require("./config/nodemailer.config");
// dotenv.config()
const PORT = env_config_1.default.PORT;
const DB_URI = env_config_1.default.DB_URI;
//* connect database
(0, db_config_1.connectDatabase)(DB_URI);
//* listen
app_1.default.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    (0, nodemailer_config_1.verifyMailServerConnection)();
});
