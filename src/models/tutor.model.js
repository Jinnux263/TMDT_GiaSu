const mongoose = require('mongoose');
reqString = {
    type: String,
    required: true,
};
reqNumber = {
    type: Number,
    required: true,
};
const tutorSchema = mongoose.Schema({
    user: {
        type: String,
        ref: 'User',
    },
    degree: String,
    facultity: String,
    school: String,
    description: String,
    student_id: String,
    rate_star: Number,
    verified: { type: Boolean, default: false },
});

module.exports = mongoose.model('Tutor', tutorSchema);
