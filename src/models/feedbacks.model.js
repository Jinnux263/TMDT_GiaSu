
const mongoose = require('mongoose');
const coursesModel = require('./courses.model');
const customersModel = require('./customers.model');
const tutorsModel = require('./tutors.model');

const feedbacksSchema = new mongoose.Schema(
    {
        customer: customersModel,
        tutor: tutorsModel,
        course: coursesModel,
        rate: Number,
        description: String
    }
);

module.exports = mongoose.model('Feedbacks', feedbacksSchema)