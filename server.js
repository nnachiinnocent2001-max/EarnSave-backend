require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/main'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: "EarnSave API is running" });
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
 .then(() => {
    console.log('MongoDB Connected ✅');
    app.listen(PORT, () => console.log(`Server Running on ${PORT}`));
  })
 .catch(err => console.log('Mongo Error:', err));
