const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const axios = require('axios');

// Dashboard route
router.get('/dashboard', auth, async (req,res)=>{
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// Test route
router.get('/test', (req, res) => {
  res.json({ message: "Main routes working" });
});

// WALLET FUND ROUTE - For Flutterwave verification
router.post('/wallet/fund', auth, async (req, res) => {
  try {
    const { tx_ref, amount } = req.body;
    const userId = req.user.id;

    // 1. Verify payment with Flutterwave
    const response = await axios.get(`https://api.flutterwave.com/v3/transactions/${tx_ref}/verify`, {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
      }
    });

    const data = response.data.data;

    // 2. Check if payment was successful
    if(data.status === "successful" && data.amount === amount) {
      // 3. Credit user wallet
      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { walletBalance: amount } },
        { new: true }
      ).select('-password');

      return res.json({ 
        success: true, 
        message: `Wallet funded with ₦${amount}`,
        walletBalance: user.walletBalance 
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
