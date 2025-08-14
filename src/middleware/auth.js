const jwt = require('jsonwebtoken');
const User = require('../models/User');


async function authenticate(req, res, next) {
  try {
    const header = req.headers['authorization'];
    if (!header) return res.status(401).json({ error: 'missing authorization header' });

    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'invalid authorization format' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decoded.sub });
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = {
      userId: user.userId,   
      role: user.role
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid or expired token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'forbidden' });
    }
    next();
  };
}

module.exports = { authenticate, requireRole };
