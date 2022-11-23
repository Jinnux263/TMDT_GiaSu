
const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true
}
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