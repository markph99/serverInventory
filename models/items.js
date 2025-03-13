// models/item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  itemDescription: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true // Automatically manages createdAt and updatedAt
});

module.exports = mongoose.model('Items', itemSchema);
