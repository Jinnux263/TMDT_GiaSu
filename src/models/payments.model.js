const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            trim: true,
            unique: true,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        paymentID: {
            type: String,
            required: true,
        },
        address: {
            type: Object,
            required: true,
        },
        cart: {
            type: Array,
            default: [],
        },
        status: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Payments', PaymentSchema);
