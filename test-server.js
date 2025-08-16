require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Simple User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
  userId: { type: Number, default: 1 }
});

userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 10);
};

const User = mongoose.model('User', userSchema);

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'username, password, and role required' });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ error: 'username already exists' });
    }

    const user = new User({ username, role });
    await user.setPassword(password);
    await user.save();

    console.log('User created successfully:', user._id);
    return res.status(201).json({ message: 'User registered', id: user._id });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Ping endpoint
app.get('/ping', (req, res) => {
  console.log('Ping received');
  res.json({ ok: true, time: Date.now() });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server listening on ${PORT}`);
});