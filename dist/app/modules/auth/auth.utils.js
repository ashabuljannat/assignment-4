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
exports.formatToDate = exports.pushUniqueByPassHash = exports.pushUniqueByPass = exports.pushUnique = exports.createToken = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createToken = (jwtPayload, secret, expiresIn) => {
    return jsonwebtoken_1.default.sign(jwtPayload, secret, {
        expiresIn,
    });
};
exports.createToken = createToken;
function pushUnique(arr, value) {
    if (!arr.includes(value)) {
        arr.push(value);
        if (arr.length > 3) {
            arr.shift(); // Remove the oldest element
        }
    }
}
exports.pushUnique = pushUnique;
function pushUniqueByPass(arr, newObj) {
    const index = arr.findIndex((obj) => obj.pass === newObj.pass);
    if (index === -1) {
        arr.push(newObj);
        if (arr.length > 3) {
            arr.shift(); // Remove the oldest element
        }
        return false; // Successfully added
    }
    else {
        return true; // Matching pass found, not added
    }
}
exports.pushUniqueByPass = pushUniqueByPass;
function pushUniqueByPassHash(newObj, array) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(newObj,array)
        for (let index = 0; index < array.length; index++) {
            const hash = array[index];
            // console.log(11, index, hash);
            const match = yield bcrypt_1.default.compare(newObj.pass, hash.pass);
            // console.log('pass match', match);
            if (!match) {
                array.push(newObj);
                if (array.length > 3) {
                    array.shift(); // Remove the oldest element
                }
                //   // return false; // Successfully added
            }
        }
        console.log(newObj, 'arr', array);
    });
}
exports.pushUniqueByPassHash = pushUniqueByPassHash;
function formatToDate(inputDate) {
    const dateObject = new Date(inputDate);
    const formattedDate = `${dateObject.getFullYear()}-${String(dateObject.getMonth() + 1).padStart(2, '0')}-${String(dateObject.getDate()).padStart(2, '0')} at ${String(dateObject.getHours() % 12 || 12).padStart(2, '0')}:${String(dateObject.getMinutes()).padStart(2, '0')} ${dateObject.getHours() < 12 ? 'AM' : 'PM'}`;
    return formattedDate;
}
exports.formatToDate = formatToDate;
