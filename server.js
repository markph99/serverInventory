require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Global Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB using the URI from .env file
const mongoUri = process.env.MONGO_URI;
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);
const settingRoutes = require('./routes/settingRoutes');
app.use('/api', settingRoutes);
const itemRoutes = require('./routes/inventoryRoutes');
app.use('/api/inventory', itemRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
