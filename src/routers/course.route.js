const express = require('express');
const router = express.Router();

const courseController = require('../controllers/course.controller');

router.get('/', courseController.getAllCourse);

router.post('/', courseController.createCourse);
router.post('/:courseId/apply', courseController.tutorApply);
router.get('/:courseId/applied-tutors', courseController.getAppliedTutors);
router.post('/:courseId/accept-tutor', courseController.acceptTutor);
router.post('/create-multiple', courseController.createMultipleCourse);

router.get('/get-list-course', courseController.getListCourse);

router.post('/get-open-course', courseController.getOpenCourse);
router.patch('/:courseId/cancel', courseController.cancelCourse);
router.delete(
  '/delete-course-by-customer',
  courseController.customerDeleteCourse,
);

module.exports = router;
