import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewServices } from './review.service';
import jwt, { JwtPayload } from 'jsonwebtoken';

const createReview = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(
    token as string,
    config.jwt_access_secret as string,
  ) as JwtPayload;
  // console.log(req.body)
  // console.log(decoded._id)

  const result = await ReviewServices.createReviewIntoDB({
    ...req.body,
    createdBy: decoded._id,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Review created successfully',
    data: result,
  });
});

const getAllReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.getAllReviewsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
  getAllReview,
};
