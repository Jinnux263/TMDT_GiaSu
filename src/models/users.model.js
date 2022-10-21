const mongoose = require('mongoose');
const userScheme = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: Number,
            default: 0,
        },
        cart: {
            type: Array,
            default: [],
        },
        images: {
            type: Object,
            default: {
                publics_id: '',
                url:
                    'https://res.cloudinary.com/dxnfxl89q/image/upload/v1609941293/javcommerce/person_slkixq.jpg',
            },
            require: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Users', userScheme);
