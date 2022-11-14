
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
    {
        subjects: [
            {
                subject: Number
            }
        ]
    }
);

module.exports = mongoose.model('Subjects', subjectSchema)