
const mongoose = require('mongoose');
const gradeSchema = mongoose.Schema(
    {
        num: Number,
        name: String
    }
)
module.exports = mongoose.model("Grade", gradeSchema)