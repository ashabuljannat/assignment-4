import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewControllers } from './review.controller';
import { ReviewValidations } from './review.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.interface';

const router = express.Router();

router.get('/', ReviewControllers.getAllReview);

router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(ReviewValidations.reviewValidationSchema),
  ReviewControllers.createReview,
);

export const ReviewRoutes = router;
