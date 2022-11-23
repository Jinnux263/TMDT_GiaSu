
const mongoose = require('mongoose');
const subjectsModel = require('./subjects.model');
const tutorsModel = require('./tutors.model');
reqString = {
    type: String,
    required: true
}
reqNumber = {
    type: Number,
    required: true
}
const courseSchema = new mongoose.Schema(
    {
        subjects: [subjectsModel
        ],
        grade: reqString,
        description: reqString,
        salary: reqNumber,
        numberOfStudent: reqNumber,
        startDate: Date,
        endDate: Date,
        deadline: Date,
        tutors: [tutorSchema
        ]
    }
);

module.exports = mongoose.model('Courses', courseSchema)