// server/src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Access token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded; // { userId, role, phone }
    next();
  } catch (err) {
    return res.status(403).json({ status: 'error', message: 'Invalid or expired token' });
  }
};

// Restrict routes exclusively to admins (e.g. profit reports, settings)
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ status: 'error', message: 'Unauthorized: Admin privileges required' });
  }
};

module.exports = { verifyToken, requireAdmin };