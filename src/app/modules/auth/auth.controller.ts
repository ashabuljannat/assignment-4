/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const registerUser = catchAsync(async (req, res) => {
  const user: any = await AuthServices.registerUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
});

const loginUser = catchAsync(async (req, res) => {
  // console.log(10,req.body,req.user);
  const result = await AuthServices.loginUser(req.body);
  const { accessToken, user } = result;

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User login successfully!',
    data: {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token: accessToken,
    },
  });
});

const changePassword = catchAsync(async (req: any, res) => {
  // console.log(10,req.body,req.user);
  const { ...passwordData } = req.body;
  const result = await AuthServices.changePassword(req.user, passwordData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password changed successfully!',
    data: result,
  });

  if (!result) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Password changed successfully!',
      data: result,
    });
  }
});

export const AuthControllers = {
  registerUser,
  loginUser,
  changePassword,
};
