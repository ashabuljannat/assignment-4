"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const zod_1 = require("zod");
const passwordSchema = zod_1.z.string().refine((password) => {
    const errors = [];
    if (!/\d/.test(password))
        errors.push('At least one number digit is required.');
    if (!/[A-Z]/.test(password))
        errors.push('At least one uppercase letter is required.');
    if (!/[a-z]/.test(password))
        errors.push('At least one lowercase letter is required.');
    if (!/[^a-zA-Z0-9]/.test(password))
        errors.push('At least one symbol is required.');
    if (password.length < 8)
        errors.push('Password must be at least 8 characters long.');
    if (/\s/.test(password)) {
        const spacePositions = password
            .split('')
            .reduce((acc, char, index) => (char === ' ' ? [...acc, index] : acc), []);
        errors.push(`Password must not contain spaces. Space positions: ${spacePositions.join(', ')}`);
    }
    if (errors.length > 0) {
        throw new Error(errors.join(' '));
    }
    return true;
}, { message: 'Invalid password format.' });
const regValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string({ required_error: 'User name is required.' }),
        email: zod_1.z.string().email(),
        role: zod_1.z.string(),
        password: passwordSchema,
    }),
});
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string({ required_error: 'User name is required.' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string({
            required_error: 'Current Password is required',
        }),
        newPassword: passwordSchema,
        // newPassword: passwordSchema,z.string({ required_error: 'Password is required' }),
    }),
});
exports.AuthValidation = {
    regValidationSchema,
    loginValidationSchema,
    changePasswordValidationSchema,
};
