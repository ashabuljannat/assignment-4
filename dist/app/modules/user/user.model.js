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
exports.User = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
//creating a custom static method
// userSchema.statics.isUserExists = async function (id: string) {
//   const existingUser = await User.findOne({ id });
//   return existingUser;
// };
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this; // doc
        // hashing password and save into DB
        user.password = yield bcrypt_1.default.hash(user.password, Number(8));
        next();
    });
});
// set '' after saving password
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});
userSchema.statics.isUserExistsByCustomId = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        // return await User.findOne({ _id: id }).select('+password');
        return yield exports.User.findOne({ _id: id });
    });
};
userSchema.statics.isUserExistsByUserName = function (username) {
    return __awaiter(this, void 0, void 0, function* () {
        // return await User.findOne({ username }).select('+password');
        return yield exports.User.findOne({ username });
    });
};
userSchema.statics.isPasswordMatched = function (
// plainTextPassword,
// hashedPassword,
givenPassword, dbPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, dbPassword);
    });
};
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (passwordChangedTimestamp, jwtIssuedTimestamp) {
    const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
};
exports.User = (0, mongoose_1.model)('User', userSchema);
