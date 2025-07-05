const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  // Placeholder: In production, verify JWT and set req.user
  next();
}; 