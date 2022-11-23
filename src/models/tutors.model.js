const mongoose = require('mongoose');
const customersModel = require('./customers.model');
const usersModel = require('./users.model');
const tutorSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            ref: "Users"
        },
        degree: String,
        grade: Number,
        Faculity: String,
        School: String,
        Description: String,
        courses: [
            {
                course: CourseModel,
                status: String,
                lastModifiedDate: Date
            }
        ],
        studentId: Number,
        rates:
            [
                {
                    customer: customersModel,
                    rating: Number,
                    lastModifiedDate: Date
                }
            ]

    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Tutors', tutorSchema);
