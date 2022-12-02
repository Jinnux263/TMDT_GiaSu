const mongoose = require('mongoose');
const tutor_courseSchema = mongoose.Schema(
  {
    tutor: {
      type: String,
      ref: 'Tutor',
    },
    course: {
      type: String,
      ref: 'Course',
    },
    status: {
      type: String,
      enum: ['Pending', 'Reject', 'Accept', 'Finish', 'Ongoing'],
      default: 'Pending',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('TutorCourse', tutor_courseSchema);
