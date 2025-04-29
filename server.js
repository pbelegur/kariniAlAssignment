// server.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// MongoDB connection (replace with your MongoDB URI)
mongoose.connect('mongodb://localhost/ordering-website', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware to parse JSON
app.use(express.json());

// Sample route
app.get('/api/items', async (req, res) => {
  // Retrieve items from MongoDB (to be set up later)
  res.json([{ title: 'Sample Item' }]);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
