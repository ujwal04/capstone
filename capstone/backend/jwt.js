const jwt = require('jsonwebtoken');

// Secret key to sign and verify JWT tokens
const secretKey = 'your-secret-key';

// Function to generate a JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: '10h' }); // Adjust the expiration time as needed
};

// Middleware to verify JWT token in the request headers
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = { generateToken, verifyToken };
