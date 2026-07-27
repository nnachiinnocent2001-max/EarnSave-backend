const mongoose = require('mongoose');
const WithdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  bank_name: String,
  account_number: String,
  account_name: String,
  status: { type: String, default: 'pending' },
}, { timestamps: true });
module.exports = mongoose.model('Withdrawal', WithdrawalSchema);
