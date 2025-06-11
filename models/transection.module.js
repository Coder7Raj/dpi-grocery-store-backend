const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['credit', 'debit', 'transfer'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  from: {
    type: String // Pay ID of sender (optional)
  },
  to: {
    type: String // Pay ID of receiver (optional)
  },
  note: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'success'
  }
});
module.exports = transactionSchema;
