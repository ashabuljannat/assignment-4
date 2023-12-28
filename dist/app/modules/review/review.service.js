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
exports.ReviewServices = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../errors/AppError");
const review_model_1 = require("./review.model");
const course_model_1 = require("../course/course.model");
const createReviewIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(11,payload.courseId);
    const isCourseExist = yield course_model_1.Course.find({ _id: payload.courseId });
    if (isCourseExist.length < 1) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Course not found');
    }
    const result = (yield review_model_1.Review.create(payload)).populate('createdBy');
    return result;
});
const getAllReviewsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.find().populate('createdBy');
    return result;
});
const getSingleCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.findById(id);
    return result;
});
exports.ReviewServices = {
    createReviewIntoDB,
    getAllReviewsFromDB,
    getSingleCourseFromDB,
};
