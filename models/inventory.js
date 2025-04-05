const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  // Optional serialNumbers array to store serial numbers if available.
  serialNumbers: { type: [String], default: [] }
});

const inventorySchema = new mongoose.Schema({
  purpose: {
    type: String,
    required: true,
  },
  addedBy: {
    type: String,
    required: true,
  },
  // Use a reference to the Room model instead of a plain string
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['incoming', 'outgoing'],
  },
  // An array of product entries, each with an itemName, quantity, and optional serialNumbers.
  products: [productSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Inventory', inventorySchema);
