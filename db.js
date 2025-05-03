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
app.use(express.json()); 

// Set up routes early
// to clear cart for intial load of the website
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
// to show all data on the main page
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
// to show all that is there in the cart
app.get('/api/cart', async (req, res) => {
  try {
    const data = await cartCollection.find({}).toArray();
    res.json(data);
  } catch (err) {
    console.error("Error fetching:", err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
// to add item into the cart
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
// to delete 1 item at a time from the cart.
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
// to search in the main SKU bar
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
    await client.connect(); // creting the conncetion usign the URI given above with USERNAME and password
    const db = client.db('inventory_db'); // accessing to the actual DB
    collection = db.collection('shopping'); // accesing the whole array of the collections(all objects)
    cartCollection = db.collection('cart'); // // accessing cart collection.
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to DB", err);
  }
}

main();
