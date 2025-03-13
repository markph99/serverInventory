const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  purpose: {
    type: String,
    required: true,
  },
  addedBy: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
    enum: ['incoming', 'outgoing'],
  },
  // An array of products (each product has itemName and quantity)
  products: [
    {
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Inventory', inventorySchema);
