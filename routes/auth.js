const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route POST /api/auth/register
router.post('/register', async (req,res)=>{
  try{
    const {name, email,password,phone,country,bvn} = req.body;
    
    if(!email ||!password) return res.status(400).json({error: "Email and password required"});

    let user = await User.findOne({email});
    if(user) return res.status(400).json({error: "User already exists"});

    const hashed = await bcrypt.hash(password, 10);
    user = new User({name, email,password:hashed,phone,country,bvn});
    await user.save();

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, wallet_balance: user.wallet_balance }
    });
  }catch(err){
    console.error(err.message)
    res.status(500).json({error: "Server Error"})
  }
});

// @route POST /api/auth/login
router.post('/login', async (req,res)=>{
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({error: "Invalid credentials"});

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({error: "Invalid credentials"});

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, wallet_balance: user.wallet_balance }
    });
  }catch(err){
    console.error(err.message)
    res.status(500).json({error: "Server Error"})
  }
});

module.exports = router;
