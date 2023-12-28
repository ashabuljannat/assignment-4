"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseControllers = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const course_service_1 = require("./course.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const createCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    // console.log(req.body)
    // console.log(decoded._id)
    const result = yield course_service_1.CourseServices.createCourseIntoDB(Object.assign(Object.assign({}, req.body), { createdBy: decoded._id }));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Course created successfully',
        data: result,
    });
}));
const getAllCourses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { meta, result } = yield course_service_1.CourseServices.getAllCoursesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Courses retrieved successfully',
        meta,
        data: { courses: result },
    });
}));
const getCourseByIdWithReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const { result, result2 } = yield course_service_1.CourseServices.getCourseByIdWithReviewsFromDB(courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Course with Reviews retrieved successfully',
        data: {
            course: result,
            reviews: result2,
        },
    });
}));
const getTheBestCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cResult, rResult, averageRating, reviewCount } = yield course_service_1.CourseServices.getTheBestCourseFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Best course retrieved successfully',
        data: {
            course: cResult,
            // reviews: rResult,
            averageRating,
            reviewCount,
        },
    });
}));
const updateCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const result = yield course_service_1.CourseServices.updateCourseIntoDB(courseId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Course updated successfully',
        data: result,
    });
}));
exports.CourseControllers = {
    createCourse,
    getCourseByIdWithReviews,
    getAllCourses,
    getTheBestCourse,
    updateCourse,
    // deleteCourse,
};
