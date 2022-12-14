const mongoose = require('mongoose');
const mailSettingsSchema = mongoose.Schema(
    {
        type: Number,
        content: String,
    },
    {
        timestamps: true,
    },
);
module.exports = mongoose.model('MailSetting', mailSettingsSchema);
