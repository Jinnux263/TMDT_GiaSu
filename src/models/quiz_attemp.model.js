const mongoose = require('mongoose');
const quizAttempSchema = mongoose.Schema(
  {
    answers: [Number],
    tutor: {
      type: String,
      ref: 'Tutor',
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model('QuizAttemp', quizAttempSchema);
