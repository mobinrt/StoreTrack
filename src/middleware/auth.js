const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'missing authorization header' });

  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'invalid authorization format' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch {
    return res.status(401).json({ error: 'invalid or expired token' });
  }
};

exports.requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'forbidden' });
    }
    next();
  };
};
