// Load environment variables from .env file
require('dotenv').config();

// Import necessary packages
const express = require('express');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample in-memory database
let items = [
  { id: 1, name: 'Item 1', description: 'First item' },
  { id: 2, name: 'Item 2', description: 'Second item' }
];

// Utility functions

/**
 * Returns the sum of two numbers.
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
function calculateSum(a, b) {
  return a + b;
}

/**
 * Returns the difference between two numbers (a - b).
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Difference of a and b
 */
function calculateDifference(a, b) {
  return a - b;
}

/**
 * Returns the product of two numbers.
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product of a and b
 */
function calculateProduct(a, b) {
  return a * b;
}

/**
 * Returns the quotient of two numbers (a / b).
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Quotient of a and b
 * @throws {Error} If b is 0
 */
function calculateQuotient(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
}

// API routes

/**
 * GET /items - Retrieve all items
 */
app.get('/items', (req, res) => {
  res.json(items);
});

/**
 * POST /items - Create a new item
 */
app.post('/items', (req, res) => {
  const { name, description } = req.body;
  const newId = items.length ? items[items.length - 1].id + 1 : 1;
  const newItem = { id: newId, name, description };
  items.push(newItem);
  res.status(201).json(newItem);
});

/**
 * GET /items/:id - Retrieve a specific item
 */
app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  const item = items.find(i => i.id === parseInt(id));
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

/**
 * PUT /items/:id - Update an existing item
 */
app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const index = items.findIndex(i => i.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  items[index] = { ...items[index], name, description };
  res.json(items[index]);
});

/**
 * DELETE /items/:id - Delete an item
 */
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  const index = items.findIndex(i => i.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  const deletedItem = items.splice(index, 1)[0];
  res.json(deletedItem);
});

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export utility functions for testing
module.exports = {
  calculateSum,
  calculateDifference,
  calculateProduct,
  calculateQuotient,
  app,
};