import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryControllers } from './categories.controller';
import { CategoryValidations } from './categories.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.interface';

const router = express.Router();

router.get('/', CategoryControllers.getAllCategories);

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(CategoryValidations.categoryValidationSchema),
  CategoryControllers.createCategory,
);

export const CategoriesRoutes = router;
