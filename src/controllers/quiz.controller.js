const quizAttempModel = require('../models/quiz_attemp.model');
const tutorModel = require('../models/tutor.model');

class QuizController {
  async addAttemp(req, res) {
    try {
      const { answers, tutorId } = req.body;
      const tutor = await tutorModel.findById(tutorId);
      if (!tutor) {
        return res
          .status(404)
          .json({ data: req.body, message: 'Tutor not found' });
      }
      const quiz = await quizAttempModel.create({
        answers: answers,
        tutor: tutorId,
      });
      res.status(201).json({ data: quiz, message: 'Created quiz' });
    } catch (error) {
      return res.status(500).json({ data: req.body, message: error.message });
    }
  }
  async haveAttempted(req, res) {
    try {
      const { tutorId } = req.params;
      const attemp = await quizAttempModel.findOne({ tutor: tutorId });
      console.log(tutorId, attemp);
      if (attemp) {
        res.status(200).json({
          attemptedQuiz: true,
          message: 'Quiz Attemp status',
        });
      } else {
        res.status(200).json({
          attemptedQuiz: false,
          message: 'Quiz Attemp status',
        });
      }
    } catch (error) {
      return res.status(500).json({ data: req.query, message: error.message });
    }
  }
}
module.exports = new QuizController();
