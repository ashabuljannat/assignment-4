/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { Review } from './review.model';
import { TReview } from './review.interface';
import { Course } from '../course/course.model';

const createReviewIntoDB = async (payload: TReview) => {
  // console.log(11,payload.courseId);
  const isCourseExist = await Course.find({ _id: payload.courseId });

  if (isCourseExist.length < 1) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }
  const result = (await Review.create(payload)).populate('createdBy');
  return result;
};

const getAllReviewsFromDB = async () => {
  const result = await Review.find().populate('createdBy');
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Review.findById(id);
  return result;
};

export const ReviewServices = {
  createReviewIntoDB,
  getAllReviewsFromDB,
  getSingleCourseFromDB,
};
