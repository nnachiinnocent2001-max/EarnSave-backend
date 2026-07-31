const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const axios = require('axios');

router.get('/dashboard', auth, async (req,res)=>{
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

router.get('/test', (req, res) => {
  res.json({ message: "Main routes working" });
});

router.post('/wallet/fund', auth, async (req, res) => {
  try {
    const { tx_ref, amount } = req.body;
    const userId = req.user.id;

    const response = await axios.get(`https://api.flutterwave.com/v3/transactions/${tx_ref}/verify`, {
      headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` }
    });

    const data = response.data;

    if(data.status === "successful" && data.amount >= amount) { // >= is safer
      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { wallet_balance: amount } },
        { new: true }
      ).select('-password');

      return res.json({ 
        success: true, 
        message: `Wallet funded with ₦${amount}`,
        wallet_balance: user.wallet_balance 
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
