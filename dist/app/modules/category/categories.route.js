"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const categories_controller_1 = require("./categories.controller");
const categories_validation_1 = require("./categories.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
router.get('/', categories_controller_1.CategoryControllers.getAllCategories);
router.post('/', (0, auth_1.default)(user_interface_1.USER_ROLE.admin), (0, validateRequest_1.default)(categories_validation_1.CategoryValidations.categoryValidationSchema), categories_controller_1.CategoryControllers.createCategory);
exports.CategoriesRoutes = router;
