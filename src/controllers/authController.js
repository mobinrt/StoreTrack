const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' });
    }

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ error: 'username already exists' });

    const user = new User({ username, role: role || 'staff' });
    await user.setPassword(password);
    await user.save();

    return res.status(201).json({ message: 'User registered', id: user._id });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

    const payload = { sub: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.json({ token, role: user.role });
  } catch (err) {
    next(err);
  }
};
