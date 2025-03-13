const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Get token from the Authorization header (Bearer token)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY, (err, admin) => {
    if (err) return res.sendStatus(403);
    req.admin = admin;
    next();
  });
};

module.exports = authenticateToken;
