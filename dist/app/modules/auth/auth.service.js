"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = require("../../errors/AppError");
const user_model_1 = require("../user/user.model");
const auth_utils_1 = require("./auth.utils");
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.create(payload);
    // console.log(result)
    return result;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    // const user = await User.isUserExistsByUserName(payload.username);
    const user = yield user_model_1.User.findOne({
        username: payload.username,
    }).select('+password');
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    //checking if the password is correct
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password)))
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'Password do not matched');
    //create token and sent to the  client
    const jwtPayload = {
        _id: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
        user,
    };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsByCustomId(userData._id);
    const userPassword = yield user_model_1.User.findOne({ _id: userData._id }).select('password');
    const userPrePassword = yield user_model_1.User.findOne({ _id: userData._id }).select('previousPassword');
    const userPrePassword2 = yield user_model_1.User.findOne({
        _id: userData._id,
    }).select('previousPassword2');
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // //checking if the password is correct
    if (!(yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.currentPassword, userPassword === null || userPassword === void 0 ? void 0 : userPassword.password)))
        throw new AppError_1.AppErrorPass(http_status_1.default.FORBIDDEN, 'Password change failed. Your Password do not matched');
    if (yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.newPassword, userPassword === null || userPassword === void 0 ? void 0 : userPassword.password))
        throw new AppError_1.AppErrorPass(http_status_1.default.FORBIDDEN, 'Password change failed. This is your current Password');
    if (((_a = userPrePassword === null || userPrePassword === void 0 ? void 0 : userPrePassword.previousPassword) === null || _a === void 0 ? void 0 : _a.pass) &&
        (yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.newPassword, (_b = userPrePassword === null || userPrePassword === void 0 ? void 0 : userPrePassword.previousPassword) === null || _b === void 0 ? void 0 : _b.pass)))
        throw new AppError_1.AppErrorPass(http_status_1.default.FORBIDDEN, `Password change failed. This is your previous Password (last used on ${(0, auth_utils_1.formatToDate)((_c = userPrePassword === null || userPrePassword === void 0 ? void 0 : userPrePassword.previousPassword) === null || _c === void 0 ? void 0 : _c.createdAt)} ).`);
    if (((_d = userPrePassword2 === null || userPrePassword2 === void 0 ? void 0 : userPrePassword2.previousPassword2) === null || _d === void 0 ? void 0 : _d.pass) &&
        (yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.newPassword, (_e = userPrePassword2 === null || userPrePassword2 === void 0 ? void 0 : userPrePassword2.previousPassword2) === null || _e === void 0 ? void 0 : _e.pass)))
        throw new AppError_1.AppErrorPass(http_status_1.default.FORBIDDEN, `Password change failed. This is your previous Password (last used on ${(0, auth_utils_1.formatToDate)((_f = userPrePassword2 === null || userPrePassword2 === void 0 ? void 0 : userPrePassword2.previousPassword2) === null || _f === void 0 ? void 0 : _f.createdAt)} ).`);
    //hash new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.newPassword, Number(8));
    const result = yield user_model_1.User.findOneAndUpdate({ _id: userData._id }, {
        password: newHashedPassword,
        previousPassword: (userPassword === null || userPassword === void 0 ? void 0 : userPassword.password)
            ? { pass: userPassword === null || userPassword === void 0 ? void 0 : userPassword.password, createdAt: new Date() }
            : '',
        previousPassword2: (userPrePassword === null || userPrePassword === void 0 ? void 0 : userPrePassword.previousPassword)
            ? {
                pass: userPrePassword === null || userPrePassword === void 0 ? void 0 : userPrePassword.previousPassword.pass,
                createdAt: userPrePassword === null || userPrePassword === void 0 ? void 0 : userPrePassword.previousPassword.createdAt,
            }
            : '',
        updatedAt: new Date(),
    }, { new: true, runValidators: true });
    return result;
});
exports.AuthServices = {
    registerUser,
    loginUser,
    changePassword,
};
