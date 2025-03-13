const express = require('express');
const router = express.Router();
const itemController = require('../controllers/settingController');

// Room endpoints
router.post('/rooms', itemController.registerRoom);
router.get('/rooms', itemController.getRooms);

// Item endpoints
router.post('/items', itemController.registerItem);
router.get('/items', itemController.getItems);

module.exports = router;