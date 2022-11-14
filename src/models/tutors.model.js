const mongoose = require('mongoose');
const customersModel = require('./customers.model');
const usersModel = require('./users.model');
const customerScheme = new mongoose.Schema(
    {
        user: {
            type: usersModel,
            unique: true,
            required: true,
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

module.exports = mongoose.model('Tutor', customerScheme);
