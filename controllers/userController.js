const bcrypt = require('bcrypt');
const User = require('../models/users');

const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user with role admin
    const adminUser = new User({ username, password: hashedPassword, role: 'admin' });
    await adminUser.save();

    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createAdmin, getAdmins };
