
const express = require('express');
const router = express.Router();

const CourseController = require('../controllers/course.controller');

router.get('/', CourseController.getAllCourse);

router.post('/', CourseController.createCourse);

router.post('/create-multiple', CourseController.createMultipleCourse);

router.get('/get-list-course', CourseController.getListCourse);

router.get('/get-open-course', CourseController.getOpenCourse);

router.delete('/delete-course-by-customer', CourseController.customerDeleteCourse);

module.exports = router