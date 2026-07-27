const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  country: { type: String, default: 'NG' },
  bvn: String,
  wallet_balance: { type: Number, default: 0 },
  currency: { type: String, default: 'NGN' },
  isAdmin: { type: Boolean, default: false },
  referral_code: String,
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
