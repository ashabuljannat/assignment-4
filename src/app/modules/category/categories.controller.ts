import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryServices } from './categories.service';
import config from '../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';

const createCategory = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(
    token as string,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  const result = await CategoryServices.createCategoryIntoDB({
    ...req.body,
    createdBy: decoded._id,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const result = await CategoryServices.getAllCategoryFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getAllCategories,
};
