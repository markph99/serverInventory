const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// Route to create a new admin user
router.post('/admin', userController.createAdmin);

// Route to get all admin users
router.get('/admin', userController.getAdmins);

// Login routes
router.post('/login', authController.login);

module.exports = router;
