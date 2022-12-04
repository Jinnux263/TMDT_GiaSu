const express = require('express');
const tutorController = require('../controllers/tutor.controller');
const router = express.Router();
router.get('/:tutorId/applied-courses', tutorController.getAllApplyCourses);
router.get('/:tutorId/pending-courses', tutorController.getAllPendingCourses);
router.get('/:tutorId/ongoing-courses', tutorController.getAllOngoingCourses);
module.exports = router;
