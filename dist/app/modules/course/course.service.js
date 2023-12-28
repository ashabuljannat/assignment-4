"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const review_model_1 = require("../review/review.model");
const course_constant_1 = require("./course.constant");
const course_model_1 = require("./course.model");
const query_1 = require("./query");
const AppError_1 = require("../../errors/AppError");
const createCourseIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.create(payload);
    return result;
});
const getAllCoursesFromDB = (reqQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const queryObj = Object.assign({}, reqQuery);
    course_constant_1.courseExcludeFilteringFields.forEach((el) => delete queryObj[el]);
    const queryPage = Number(reqQuery.page) || 1;
    const queryLimit = Number(reqQuery.limit) || 10;
    const { maxPrice: queryMaxPrice, minPrice: queryMinPrice } = reqQuery;
    const queryTags = reqQuery.tags;
    const queryLevel = reqQuery.level;
    const { sortBy, sortOrder } = reqQuery;
    const sort = {};
    if (sortBy) {
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }
    if (queryMaxPrice || queryMinPrice) {
        const queryResult = yield course_model_1.Course.find({
            $and: [
                { price: { $gte: queryMinPrice } },
                { price: { $lte: queryMaxPrice } },
            ],
        }).sort(sort).populate('createdBy');
        const { allPageData, totalPages } = (0, query_1.pagination)(queryResult, queryLimit);
        const meta = {
            page: totalPages,
            limit: queryLimit,
            total: queryResult.length,
        };
        const result = allPageData[queryPage - 1];
        return { meta, result };
    }
    if (queryTags || queryLevel) {
        const tagFilter = { tags: { $elemMatch: { name: queryTags } } };
        const detailsLevelFilter = { 'details.level': queryLevel };
        const queryResult = yield course_model_1.Course.find(queryTags ? tagFilter : detailsLevelFilter).sort(sort).populate('createdBy');
        const { allPageData, totalPages } = (0, query_1.pagination)(queryResult, queryLimit);
        const meta = {
            page: totalPages,
            limit: queryLimit,
            total: queryResult.length,
        };
        const result = allPageData[queryPage - 1];
        return { meta, result };
    }
    const queryResult = yield course_model_1.Course.find(queryObj).sort(sort).populate('createdBy');
    const { allPageData, totalPages } = (0, query_1.pagination)(queryResult, queryLimit);
    const meta = {
        page: totalPages,
        limit: queryLimit,
        total: queryResult.length,
    };
    const result = allPageData[queryPage - 1];
    return { meta, result };
});
const getCourseByIdWithReviewsFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isCourseExist = yield course_model_1.Course.find({ _id: id });
    if (isCourseExist.length < 1) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Course not found');
    }
    const result = yield course_model_1.Course.findById(id).populate('createdBy');
    const result2 = yield review_model_1.Review.find({ courseId: id }).populate('createdBy');
    // console.log(result2,11)
    return { result, result2 };
});
const getTheBestCourseFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const rResult = yield review_model_1.Review.find();
    // for get max average rating course * form chat gpt*
    const courseIdTotalRating = {};
    const courseIdReviewCount = {};
    rResult.forEach((review) => {
        if (courseIdTotalRating[review.courseId]) {
            courseIdTotalRating[review.courseId] += review.rating;
            courseIdReviewCount[review.courseId]++;
        }
        else {
            courseIdTotalRating[review.courseId] = review.rating;
            courseIdReviewCount[review.courseId] = 1;
        }
    });
    let maxAverageRating = -1;
    let courseIdWithMaxAverage = '';
    for (const courseId in courseIdTotalRating) {
        const totalRating = courseIdTotalRating[courseId];
        const reviewCount = courseIdReviewCount[courseId];
        const averageRating = totalRating / reviewCount;
        if (averageRating > maxAverageRating) {
            maxAverageRating = averageRating;
            courseIdWithMaxAverage = courseId;
        }
    }
    const averageRating = maxAverageRating.toFixed(3);
    const reviewCount = courseIdTotalRating[courseIdWithMaxAverage];
    const cResult = yield course_model_1.Course.findById(courseIdWithMaxAverage).populate('createdBy');
    return { cResult, rResult, averageRating, reviewCount };
});
const updateCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCourseExist = yield course_model_1.Course.findOne({ _id: id });
    if (!isCourseExist) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Course not found');
    }
    const { tags } = payload, courseRemainingData = __rest(payload, ["tags"]);
    try {
        const updatedBasicCourseInfo = yield course_model_1.Course.findByIdAndUpdate(id, courseRemainingData, { new: true, runValidators: true });
        if (!updatedBasicCourseInfo) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Failed to update course');
        }
        if (tags && tags.length > 0) {
            const tagsForDelete = tags
                .filter((el) => el.name && el.isDeleted)
                .map((el) => el.name);
            const deleteTag = yield course_model_1.Course.findByIdAndUpdate(id, {
                $pull: {
                    tags: { name: { $in: tagsForDelete } },
                },
            }, {
                new: true,
                runValidators: true,
            });
            if (!deleteTag) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Failed to update course');
            }
            const tagsForUpdate = tags.filter((el) => el.name && !el.isDeleted);
            const updateTag = yield course_model_1.Course.findByIdAndUpdate(id, {
                $addToSet: {
                    tags: {
                        $each: tagsForUpdate,
                        $elemMatch: {
                            name: { $nin: tagsForUpdate.map((tag) => tag.name) },
                        },
                    },
                },
            });
            // console.log(11,updateTag);
            // console.log(13, tagsForUpdate);
            if (!updateTag) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Failed to update course');
            }
        }
        const result = yield course_model_1.Course.findById(id).populate('createdBy');
        return result;
    }
    catch (err) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Catch Failed to update course');
    }
});
exports.CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getCourseByIdWithReviewsFromDB,
    getTheBestCourseFromDB,
    updateCourseIntoDB,
};
