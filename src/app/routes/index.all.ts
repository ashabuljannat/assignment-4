import { Router } from 'express';
import { ReviewRoutes } from '../modules/review/review.route';
import { CategoriesRoutes } from '../modules/category/categories.route';
import { CourseRoutes } from '../modules/course/course.route';
import { CoursesRoutes } from '../modules/course/courses.route';
import { AuthRoutes } from '../modules/auth/auth.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/course',
    route: CourseRoutes,
  },
  {
    path: '/courses',
    route: CoursesRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/categories',
    route: CategoriesRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
