const mongoose = require('mongoose');
reqString = {
    type: String,
    required: true
}
reqNumber = {
    type: Number,
    required: true
}
const courseSchema = mongoose.Schema(
    {
        subjects: [
            {
                type: String,
                ref: "Subject"
            }
        ],
        grade: {
            type: String,
            ref: "Grade"
        },
        description: reqString,
        status: reqString,
        deadline: Date,
        salary: reqNumber,
        numberOfStudent: reqNumber,
        startDate: Date,
        endDate: Date,
        customer: {
            type: String,
            ref: "Customer"
        }
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model("Course", courseSchema)