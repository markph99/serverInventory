// controllers/inventoryController.js
const Inventory = require('../models/inventory');
const Item = require('../models/items'); // Catalog item model, which includes a 'stock' field

// Helper function to process outgoing inventory: deduct stock for each product
const processOutgoing = async (products) => {
  for (const prod of products) {
    // Decrement the stock of the catalog item by the quantity in the outgoing record
    const updatedItem = await Item.findOneAndUpdate(
      { itemName: prod.itemName },
      { $inc: { stock: -prod.quantity } },
      { new: true }
    );
    if (!updatedItem) {
      throw new Error(`Catalog item ${prod.itemName} not found`);
    }
    // Check if the updated stock falls below zero
    if (updatedItem.stock < 0) {
      throw new Error(`Not enough stock for ${prod.itemName}`);
    }
  }
};

// CREATE an Inventory Record
const createInventory = async (req, res) => {
  try {
    const { status, products } = req.body;
    
    // Ensure required fields exist (additional validations can be added here)
    if (!req.body.purpose || !req.body.addedBy || !req.body.location || !status || !products || products.length === 0) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // If the inventory record is outgoing, deduct stock from catalog items
    if (status === 'outgoing') {
      await processOutgoing(products);
    }
    
    const newInventory = await Inventory.create(req.body);
    res.status(201).json(newInventory);
  } catch (error) {
    console.error('Error creating inventory record:', error);
    res.status(400).json({ error: error.message || 'Failed to create inventory record' });
  }
};

// GET All Inventory Records
const getAllInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find({});
    res.status(200).json(inventories);
  } catch (error) {
    console.error('Error fetching inventory records:', error);
    res.status(500).json({ error: 'Failed to retrieve inventory records' });
  }
};

// DELETE an Inventory Record
const deleteInventory = async (req, res) => {
  try {
    const invId = req.params.id;
    const deletedInventory = await Inventory.findByIdAndDelete(invId);
    if (!deletedInventory) {
      return res.status(404).json({ error: 'Inventory record not found' });
    }
    res.json({ message: 'Inventory record deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory record:', error);
    res.status(500).json({ error: 'Failed to delete inventory record' });
  }
};

module.exports = {
  createInventory,
  getAllInventories,
  deleteInventory,
};
