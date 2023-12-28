/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export const USER_ROLE = {
  user: 'user',
  admin: 'admin',
} as const;

export type TUser = {
  _id?: string;
  username: string;
  email: string;
  password: string;
  previousPassword?: any;
  previousPassword2?: any;
  role: 'admin' | 'user';
};

export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExistsByCustomId(id: string): Promise<TUser>;
  isUserExistsByUserName(username: string): Promise<TUser>;

  //instance methods for checking if passwords are matched
  isPasswordMatched(
    givenPassword: string,
    dbPassword: string,
  ): Promise<boolean>;

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
