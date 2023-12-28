/* eslint-disable @typescript-eslint/no-this-alias */
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';

const userSchema = new Schema<TUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
      },
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    previousPassword: {
      type: {},
      select: 0,
    },
    previousPassword2: {
      type: {},
      select: 0,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

//creating a custom static method
// userSchema.statics.isUserExists = async function (id: string) {
//   const existingUser = await User.findOne({ id });
//   return existingUser;
// };

userSchema.pre('save', async function (next) {
  const user = this; // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(user.password, Number(8));
  next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  // return await User.findOne({ _id: id }).select('+password');
  return await User.findOne({ _id: id });
};

userSchema.statics.isUserExistsByUserName = async function (username: string) {
  // return await User.findOne({ username }).select('+password');
  return await User.findOne({ username });
};

userSchema.statics.isPasswordMatched = async function (
  // plainTextPassword,
  // hashedPassword,
  givenPassword,
  dbPassword,
) {
  return await bcrypt.compare(givenPassword, dbPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
