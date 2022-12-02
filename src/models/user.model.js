const mongoose = require('mongoose');
reqString = {
  type: String,
  required: true,
};
reqNumber = {
  type: Number,
  required: true,
};
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: reqString,
    phone_number: reqString,
    fullname: reqString,
    address: reqString,
    gender: {
      type: String,
      enum: ['male', 'female'],
      default: 'male'
    },
    dob: Date,
    role: {
      type: String,
      enum: ['tutor', 'customer'],
      default: 'tutor',
    },
    email: reqString,
    balance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamp: true,
  },
);
module.exports = mongoose.model('User', userSchema);
