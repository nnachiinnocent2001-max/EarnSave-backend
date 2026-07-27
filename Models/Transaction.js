const mongoose = require('mongoose');
const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String, // fund, withdraw, earning, task
  amount: Number,
  status: String,
  reference: String,
}, { timestamps: true });
module.exports = mongoose.model('Transaction', TransactionSchema);
