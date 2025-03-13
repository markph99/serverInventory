const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Received login request for:", username);

    // Find the user with role 'admin'
    const user = await User.findOne({ username, role: 'admin' });
    if (!user) {
      console.log("User not found or not an admin for username:", username);
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for username:", username);
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    console.log("Login successful for user:", user.username);
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login };
