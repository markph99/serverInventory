const Room = require('../models/room');
const Item = require('../models/items');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register a new room (existing code)
exports.registerRoom = async (req, res) => {
  try {
    const { roomName, roomPassword } = req.body;
    if (!roomName || !roomPassword) {
      return res.status(400).json({ message: 'Room name and password are required' });
    }

    // Check if room already exists
    const existingRoom = await Room.findOne({ roomName });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room already exists' });
    }

    // Hash the room password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(roomPassword, saltRounds);

    const newRoom = new Room({ roomName, roomPassword: hashedPassword });
    await newRoom.save();
    res.status(201).json({ message: 'Room registered successfully', room: newRoom });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// New: Room Login
exports.loginRoom = async (req, res) => {
  try {
    const { roomName, roomPassword } = req.body;
    if (!roomName || !roomPassword) {
      return res.status(400).json({ message: 'Room name and password are required.' });
    }

    // Find the room by name
    const room = await Room.findOne({ roomName });
    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(roomPassword, room.roomPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect room password.' });
    }

    // Generate a JWT token for the room session
    const token = jwt.sign(
      { id: room._id, roomName: room.roomName },
      process.env.ROOM_SECRET_KEY || process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Room login successful.', token });
  } catch (error) {
    console.error("Room login error:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Existing methods for items...

// Get all rooms (for location dropdown)
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.status(200).json({ rooms });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Register a new item
exports.registerItem = async (req, res) => {
  try {
    const { itemName, itemDescription } = req.body;
    if (!itemName || !itemDescription) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newItem = new Item({ itemName, itemDescription });
    await newItem.save();
    res.status(201).json({ message: 'Item registered successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all items (for item name dropdown)
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find({});
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
