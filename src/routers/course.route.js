const express = require('express');
const router = express.Router();

const courseController = require('../controllers/course.controller');

router.get('/', courseController.getAllCourse);

router.post('/', courseController.createCourse);
router.post('/:courseId/apply', courseController.applyCourse);
router.post('/:courseId/accept-tutor', courseController.acceptTutor);
router.post('/create-multiple', courseController.createMultipleCourse);

router.get('/get-list-course', courseController.getListCourse);

router.get('/get-open-course', courseController.getOpenCourse);

router.delete(
  '/delete-course-by-customer',
  courseController.customerDeleteCourse,
);

module.exports = router;
