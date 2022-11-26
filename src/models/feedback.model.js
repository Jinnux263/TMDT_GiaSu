
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
    {
        customer: {
            type: String,
            ref: "Customer"
        },
        tutor: {
            type: String,
            ref: "Tutor"
        },
        course: {
            type: String,
            ref: "Course"
        },
        rate: Number,
        description: String
    }
);

module.exports = mongoose.model('Feedback', feedbackSchema)