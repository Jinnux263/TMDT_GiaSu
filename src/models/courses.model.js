
const mongoose = require('mongoose');
const subjectsModel = require('./subjects.model');
const tutorsModel = require('./tutors.model');

const courseSchema = new mongoose.Schema(
    {
        subjects: [subjectsModel
        ],
        grade: String,
        description: String,
        salary: Number,
        numberOfStudent: Number,
        startDate: Date,
        endDate: Date,
        deadline: Date,
        tutors: [
            {
                tutor: tutorsModel,
                status: String,
                lastModifiedDate: Date
            }
        ]
    }
);

module.exports = mongoose.model('Courses', courseSchema)