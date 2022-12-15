const mongoose = require('mongoose');
reqString = {
  type: String,
  required: true,
};
reqNumber = {
  type: Number,
  required: true,
};
const transactionSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      enum: ['Deposit', 'Withdrawal', 'Payment', 'Order'],
      default: 'Deposit',
      required: true,
    },
    amount: reqNumber,
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('Transaction', transactionSchema);
