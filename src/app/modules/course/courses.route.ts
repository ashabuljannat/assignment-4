import express from 'express';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.interface';

const router = express.Router();

router.get('/', CourseControllers.getAllCourses);

router.get('/:courseId/reviews', CourseControllers.getCourseByIdWithReviews);

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.put('/:courseId', auth(USER_ROLE.admin), CourseControllers.updateCourse);

export const CoursesRoutes = router;
