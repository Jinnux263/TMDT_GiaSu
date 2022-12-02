const mongoose = require('mongoose');
const gradeSchema = mongoose.Schema(
  {
    num: Number,
    name: String,
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('Grade', gradeSchema);
