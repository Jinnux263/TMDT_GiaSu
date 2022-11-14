const mongoose = require('mongoose');
const usersModel = require('./users.model');
const customerScheme = new mongoose.Schema(
    {
        user: {
            type: usersModel,
            unique: true,
            required: true,
        },
        courses: [
            CourseModel
        ]

    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Customers', customerScheme);
