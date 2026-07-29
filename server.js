hererequire('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Health check for Render
app.get('/', (req, res) => {
  res.json({ message: "EarnSave API is running" });
});

// Connect DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => {
  console.log("Mongo Error: ", err.message);
  process.exit(1);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/main')); // your flutterwave + other routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server Running on ${PORT}`));
