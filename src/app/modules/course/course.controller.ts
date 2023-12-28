/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

const createCourse = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(
    token as string,
    config.jwt_access_secret as string,
  ) as JwtPayload;
  // console.log(req.body)
  // console.log(decoded._id)

  const result = await CourseServices.createCourseIntoDB({
    ...req.body,
    createdBy: decoded._id,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Course created successfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const { meta, result } = await CourseServices.getAllCoursesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses retrieved successfully',
    meta,
    data: { courses: result },
  });
});

const getCourseByIdWithReviews = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { result, result2 } =
    await CourseServices.getCourseByIdWithReviewsFromDB(courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course with Reviews retrieved successfully',
    data: {
      course: result,
      reviews: result2,
    },
  });
});

const getTheBestCourse = catchAsync(async (req, res) => {
  const { cResult, rResult, averageRating, reviewCount } =
    await CourseServices.getTheBestCourseFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Best course retrieved successfully',
    data: {
      course: cResult,
      // reviews: rResult,
      averageRating,
      reviewCount,
    },
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.updateCourseIntoDB(courseId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getCourseByIdWithReviews,
  getAllCourses,
  getTheBestCourse,
  updateCourse,
  // deleteCourse,
};
