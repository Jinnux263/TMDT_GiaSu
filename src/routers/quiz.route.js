const express = require('express');
const quizController = require('../controllers/quiz.controller');
const router = express.Router();

router.post('/', quizController.addAttemp);
router.get('/:tutorId/attempted', quizController.haveAttempted);
module.exports = router;
