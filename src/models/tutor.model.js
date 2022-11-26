
const mongoose = require('mongoose');
reqString = {
    type: String,
    required: true
}
reqNumber = {
    type: Number,
    required: true
}
const tutorSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            ref: "User"
        },
        degree: reqString,
        facultity: reqString,
        school: reqString,
        description: reqString,
        student_id: reqString,
        rate_star: reqNumber
    }
)

module.exports = mongoose.model("Tutor", tutorSchema)