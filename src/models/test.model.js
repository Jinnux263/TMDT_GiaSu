const mongoose = require('mongoose');
reqString = {
    type: String,
    required: true
}
reqNumber = {
    type: Number,
    required: true
}
const testSchema = mongoose.Schema(
    {
        subject: [
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
        number_of_student: reqNumber,
        start_date: Date,
        end_date: Date,
        customer: {
            type: String,
            ref: "Customer"
        }
    }
)
module.exports = mongoose.model("Course", courseSchema)