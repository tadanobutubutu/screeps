// Main application file
const express = require('express');
const app = express();

// Existing configuration
const PORT = process.env.PORT || 3000;
const DEFAULT_TAX_RATE = 0.08;

// Helper function to format currency
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// Calculate sales tax
function calculateTax(subtotal, taxRate = DEFAULT_TAX_RATE) {
  return subtotal * taxRate;
}

// Calculate total with tax
function calculateTotal(subtotal, taxRate = DEFAULT_TAX_RATE) {
  const tax = calculateTax(subtotal, taxRate);
  return subtotal + tax;
}

// Calculate discount based on price and discount percentage
function calculateDiscount(price, discountPercentage) {
  if (price < 0 || discountPercentage < 0) {
    return 0;
  }
  if (discountPercentage > 100) {
    discountPercentage = 100;
  }
  return price - (price * discountPercentage / 100);
}

// API Routes
app.get('/', (req, res) => {
  res.send('Welcome to the store API');
});

app.get('/api/calculate', (req, res) => {
  const { subtotal, taxRate } = req.query;
  const subtotalNum = parseFloat(subtotal) || 0;
  const taxRateNum = parseFloat(taxRate) || DEFAULT_TAX_RATE;
  
  const tax = calculateTax(subtotalNum, taxRateNum);
  const total = calculateTotal(subtotalNum, taxRateNum);
  
  res.json({
    subtotal: formatCurrency(subtotalNum),
    tax: formatCurrency(tax),
    total: formatCurrency(total),
    taxRate: taxRateNum
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = {
  app,
  calculateTax,
  calculateTotal,
  calculateDiscount,
  formatCurrency
};