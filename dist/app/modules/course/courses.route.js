"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("./course.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const course_validation_1 = require("./course.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
router.get('/', course_controller_1.CourseControllers.getAllCourses);
router.get('/:courseId/reviews', course_controller_1.CourseControllers.getCourseByIdWithReviews);
router.post('/', (0, auth_1.default)(user_interface_1.USER_ROLE.admin), (0, validateRequest_1.default)(course_validation_1.CourseValidations.createCourseValidationSchema), course_controller_1.CourseControllers.createCourse);
router.put('/:courseId', (0, auth_1.default)(user_interface_1.USER_ROLE.admin), course_controller_1.CourseControllers.updateCourse);
exports.CoursesRoutes = router;
