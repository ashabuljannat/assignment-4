/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { AppErrorAuth } from '../errors/AppError';
import { TUserRole } from '../modules/user/user.interface';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    // checking if the token is missing
    if (!token) {
      throw new AppErrorAuth(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { _id, role, iat, exp, email } = decoded;
    // console.log('decoded', decoded);

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppErrorAuth(
        httpStatus.UNAUTHORIZED,
        'You are not authorized  for this role hi!',
      );
    }

    (req as any).user = decoded as JwtPayload;
    next();
  });
};

export default auth;
