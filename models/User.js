const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  tx_ref: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deposit', 'withdrawal', 'investment'], required: true },
  status: { type: String, default: 'successful' },
  date: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  country: { type: String, default: "Nigeria" },
  bvn: { type: String },
  wallet_balance: { type: Number, default: 0 },
  transactions: [TransactionSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);        wallet_balance: user.wallet_balance 
      });
    } else {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
