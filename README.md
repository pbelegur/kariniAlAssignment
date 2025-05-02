# README 

# Backend API – Inventory and Cart Management

This is a Node.js and Express-based backend API designed to support an e-commerce application. It connects to a MongoDB database and handles inventory listing, search, and cart operations.

## Features

* Connects to a MongoDB database using the MongoDB Node.js driver
* Provides endpoints to retrieve and search product data
* Enables adding, retrieving, and deleting items from a cart
* Supports clearing the entire cart
* CORS enabled for cross-origin requests

## Prerequisites

* Node.js (v14 or higher recommended)
* MongoDB Atlas or local MongoDB instance

## Installation

1. Clone the repository:
   git clone <repository-url>
   cd <project-directory>

2. Install dependencies:
   npm install

3. Run the server:
   node db.js

   The server will start at `https://karinialassignment-production.up.railway.app/`.

## API Endpoints

### Inventory

* `GET /api/data`
  Retrieve all inventory items from the database.

* `POST /api/search`
  Search inventory items by title or variant SKU.
  **Request body format:**
  {
    "searchTerm": "example"
  }

### Cart

* `GET /api/cart`
  Retrieve all items currently in the cart.

* `POST /api/cart`
  Add a new item to the cart.
  **Request body format:** JSON object matching the item schema.

* `DELETE /api/cart`
  Delete a specific item from the cart.
  **Request body format:** JSON object identifying the item to delete.

* `DELETE /api/clearCart`
  Remove all items from the cart.

## Notes

* Ensure MongoDB access rules allow connections from your IP.
* For security in production, move sensitive values (e.g., database URI) to a `.env` file and use `dotenv`.

## License

This project is provided for educational and demonstration purposes. License terms may be added as needed.