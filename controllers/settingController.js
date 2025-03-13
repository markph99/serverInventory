const Room = require('../models/room');
const Item = require('../models/items');

// Register a new room
exports.registerRoom = async (req, res) => {
  try {
    const { roomName } = req.body;
    if (!roomName) {
      return res.status(400).json({ message: 'Room name is required' });
    }

    // Check if room already exists
    const existingRoom = await Room.findOne({ roomName });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room already exists' });
    }

    const newRoom = new Room({ roomName });
    await newRoom.save();
    res.status(201).json({ message: 'Room registered successfully', room: newRoom });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

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
