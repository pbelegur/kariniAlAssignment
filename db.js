const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000;

const uri = 'mongodb+srv://PavanSamarth99:DogPavan%4007@cluster0.nzjzcb2.mongodb.net/?retryWrites=true&w=majority&ssl=true';
const client = new MongoClient(uri);
let collection;
let cartCollection;
app.use(cors({
  origin: '*'
}));
app.use(express.json()); // 👈 MUST be before routes

// Set up routes early
app.delete('/api/clearCart', async (req, res) => {
  try {
    // Delete ALL documents in the cart collection
    const result = await cartCollection.deleteMany({});

    res.status(200).json({
      message: 'All items removed from cart',
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});
app.get('/api/data', async (req, res) => {
  try {
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (err) {
    console.error("Error fetching:", err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
// Set up routes early
app.get('/api/cart', async (req, res) => {
  try {
    const data = await cartCollection.find({}).toArray();
    res.json(data);
  } catch (err) {
    console.error("Error fetching:", err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
app.post('/api/cart', async (req, res) => {
  try {
    // Validate the incoming data
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Request body is empty' });
    }
    // Insert the new item into the cart collection
    const result = await cartCollection.insertOne(req.body);
    const insertedItem = await cartCollection.findOne({ _id: result.insertedId });
    console.log("inserted item:",insertedItem);
    res.status(201).json(insertedItem);
  } catch (err) {
    console.error("Error adding item to cart:", err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});
app.delete('/api/cart', async (req, res) => {
  try {
    // Validate the incoming data
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Request body is empty' });
    }

    // Delete the matching item from the cart collection
    const result = await cartCollection.deleteOne(req.body);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    res.status(200).json({
      message: 'Item removed from cart',
      deletedItem: req.body
    });
  } catch (err) {
    console.error("Error removing item from cart:", err);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});
// app.post('/api/data', async (req, res) => {
//   try {
//     const newItem = new YourModel(req.body);
//     const savedItem = await newItem.save();
//     res.status(201).json(savedItem);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
app.post('/api/search', async (req, res) => {
  const { searchTerm } = req.body; // expect { searchTerm: "..." }

  if (!searchTerm) {
    return res.status(400).json({ error: "Missing searchTerm in body" });
  }

  try {
    const results = await collection.find({
      $or: [
        { "Variant SKU": { $regex: searchTerm, $options: 'i' } },
        { "Title": { $regex: searchTerm, $options: 'i' } }
      ]
    }).toArray();

    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Connect to MongoDB and start server
async function main() {
  try {
    await client.connect();
    const db = client.db('inventory_db');
    collection = db.collection('shopping');
    cartCollection = db.collection('cart');
    app.listen(port, () => {
      console.log(`✅ Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to DB", err);
  }
}

main();
