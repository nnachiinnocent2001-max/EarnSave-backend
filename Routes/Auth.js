const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req,res)=>{
  try{
    const {email,password,phone,country,bvn} = req.body;
    let user = await User.findOne({email});
    if(user) return res.status(400).json({error: "User exists"});
    const hashed = await bcrypt.hash(password, 10);
    user = new User({email,password:hashed,phone,country,bvn});
    await user.save();
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
    res.json({token});
  }catch(err){res.status(500).json({error: err.message})}
});

router.post('/login', async (req,res)=>{
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({error: "Invalid credentials"});
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({error: "Invalid credentials"});
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
    res.json({token});
  }catch(err){res.status(500).json({error: err.message})}
});
module.exports = router;
