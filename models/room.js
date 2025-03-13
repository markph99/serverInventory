const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomName: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
