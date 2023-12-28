/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { AppError, AppErrorPass } from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser, TRegUser } from './auth.interface';
import { createToken, formatToDate } from './auth.utils';

const registerUser = async (payload: TRegUser) => {
  const result = await User.create(payload);
  // console.log(result)
  return result;
};

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  // const user = await User.isUserExistsByUserName(payload.username);
  const user: any = await User.findOne({
    username: payload.username,
  }).select('+password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //create token and sent to the  client
  const jwtPayload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
    user,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { currentPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userData._id);
  const userPassword: any = await User.findOne({ _id: userData._id }).select(
    'password',
  );
  const userPrePassword: any = await User.findOne({ _id: userData._id }).select(
    'previousPassword',
  );
  const userPrePassword2: any = await User.findOne({
    _id: userData._id,
  }).select('previousPassword2');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // //checking if the password is correct
  if (!(await bcrypt.compare(payload?.currentPassword, userPassword?.password)))
    throw new AppErrorPass(
      httpStatus.FORBIDDEN,
      'Password change failed. Your Password do not matched',
    );

  if (await bcrypt.compare(payload?.newPassword, userPassword?.password))
    throw new AppErrorPass(
      httpStatus.FORBIDDEN,
      'Password change failed. This is your current Password',
    );

  if (
    userPrePassword?.previousPassword?.pass &&
    (await bcrypt.compare(
      payload?.newPassword,
      userPrePassword?.previousPassword?.pass,
    ))
  )
    throw new AppErrorPass(
      httpStatus.FORBIDDEN,
      `Password change failed. This is your previous Password (last used on ${formatToDate(
        userPrePassword?.previousPassword?.createdAt,
      )} ).`,
    );

  if (
    userPrePassword2?.previousPassword2?.pass &&
    (await bcrypt.compare(
      payload?.newPassword,
      userPrePassword2?.previousPassword2?.pass,
    ))
  )
    throw new AppErrorPass(
      httpStatus.FORBIDDEN,
      `Password change failed. This is your previous Password (last used on ${formatToDate(
        userPrePassword2?.previousPassword2?.createdAt,
      )} ).`,
    );

  //hash new password
  const newHashedPassword = await bcrypt.hash(payload?.newPassword, Number(8));

  const result = await User.findOneAndUpdate(
    { _id: userData._id },
    {
      password: newHashedPassword,
      previousPassword: userPassword?.password
        ? { pass: userPassword?.password, createdAt: new Date() }
        : '',
      previousPassword2: userPrePassword?.previousPassword
        ? {
            pass: userPrePassword?.previousPassword.pass,
            createdAt: userPrePassword?.previousPassword.createdAt,
          }
        : '',
      updatedAt: new Date(),
    },
    { new: true, runValidators: true },
  );
  return result;
};

export const AuthServices = {
  registerUser,
  loginUser,
  changePassword,
};
