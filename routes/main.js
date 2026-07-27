const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/dashboard', auth, async (req,res)=>{
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

module.exports = router;
