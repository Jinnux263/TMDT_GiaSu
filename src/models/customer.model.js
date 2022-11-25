
const mongoose = require('mongoose');
const customerSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            ref: "User"
        },
        numer_of_course: {
            type: Number
        }
    }
)
module.exports = mongoose.model("Customer", customerSchema)