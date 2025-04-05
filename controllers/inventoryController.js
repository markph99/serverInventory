// controllers/inventoryController.js
const Inventory = require('../models/inventory');
const Item = require('../models/items'); // Catalog item model, which includes a 'stock' field
const Room = require('../models/room');   // Room model for location reference

// Helper function to process outgoing inventory: deduct stock for each product
const processOutgoing = async (products) => {
  for (const prod of products) {
    // Find the catalog item first to check available stock
    const item = await Item.findOne({ itemName: prod.itemName });
    if (!item) {
      throw new Error(`Catalog item ${prod.itemName} not found`);
    }
    // Ensure the available stock is sufficient
    if (item.stock < prod.quantity) {
      throw new Error(`Not enough stock for ${prod.itemName}`);
    }
    // Decrement the stock of the catalog item by the quantity in the outgoing record
    await Item.findOneAndUpdate(
      { itemName: prod.itemName },
      { $inc: { stock: -prod.quantity } },
      { new: true }
    );
  }
};

// CREATE an Inventory Record
const createInventory = async (req, res) => {
  try {
    const { purpose, addedBy, location, status, products } = req.body;
    
    // Validate required fields
    if (!purpose || !addedBy || !location || !status || !products || products.length === 0) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Verify that the provided location is a valid Room ID
    const room = await Room.findById(location);
    if (!room) {
      return res.status(400).json({ error: 'Invalid room location id provided' });
    }

    // Validate each product entry
    for (const prod of products) {
      if (!prod.itemName || !prod.quantity) {
        return res.status(400).json({ error: 'Each product must have an itemName and quantity' });
      }
      // Optional: if serialNumbers are provided, ensure the array length matches the quantity
      if (prod.serialNumbers && Array.isArray(prod.serialNumbers)) {
        if (prod.serialNumbers.length !== prod.quantity) {
          return res.status(400).json({ error: `Serial numbers count for ${prod.itemName} must match quantity` });
        }
      }
    }

    // If the inventory record is outgoing, process stock deduction
    if (status === 'outgoing') {
      await processOutgoing(products);
    }
    
    // Create the inventory record (location will be stored as the Room's ObjectId)
    const newInventory = await Inventory.create(req.body);
    res.status(201).json(newInventory);
  } catch (error) {
    console.error('Error creating inventory record:', error);
    res.status(400).json({ error: error.message || 'Failed to create inventory record' });
  }
};

// GET All Inventory Records with Room details populated
const getAllInventories = async (req, res) => {
  try {
    // Populate the location field to include room details (e.g., roomName)
    const inventories = await Inventory.find({}).populate('location', 'roomName');
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
