import express from 'express';
import { CourseControllers } from './course.controller';

const router = express.Router();

router.get('/best', CourseControllers.getTheBestCourse);

export const CourseRoutes = router;
