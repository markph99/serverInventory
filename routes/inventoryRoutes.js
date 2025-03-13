const express = require('express');
const router = express.Router();
const {
  createInventory,
  getAllInventories,
  deleteInventory
} = require('../controllers/inventoryController');

// Create a new inventory record
router.post('/', createInventory);

// Get all inventory records
router.get('/', getAllInventories);

// Delete an inventory record by id
router.delete('/:id', deleteInventory);

module.exports = router;
