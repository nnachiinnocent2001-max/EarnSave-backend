const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TransactionSchema = new mongoose.Schema({
  tx_ref: { type: String, required: true, unique: true }, // unique reference from Flutterwave/Paystack
  amount: { type: Number, required: true, min: 0 },
  type: { type: String, required: true, enum: ["credit", "debit"] },
  description: { type: String, default: "" },
  date: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: {
    type: String,
    match: [/^[0-9]{10,15}$/, 'Phone must be 10-15 digits']
  },
  wallet_balance: {
    type: Number,
    default: 0,
    min: [0, 'Wallet balance cannot be negative']
  },
  transactions: [TransactionSchema],
}, {
  timestamps: true // auto adds createdAt and updatedAt
});

// 1. BCRYPT PRE-SAVE HOOK - Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // only hash if password changed

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 2. METHOD TO COMPARE PASSWORD DURING LOGIN
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 3. SAFE METHOD TO UPDATE WALLET + ADD TRANSACTION
UserSchema.methods.updateWallet = async function(amount, type, tx_ref, description = "") {
  if (type === 'debit' && this.wallet_balance < amount) {
    throw new Error('Insufficient wallet balance');
  }

  // Update balance
  this.wallet_balance = type === 'credit'
   ? this.wallet_balance + amount
    : this.wallet_balance - amount;

  // Add transaction record
  this.transactions.push({
    tx_ref,
    amount,
    type,
    description
  });

  await this.save();
  return this.wallet_balance;
};

// Prevent returning password in queries
UserSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', UserSchema);
