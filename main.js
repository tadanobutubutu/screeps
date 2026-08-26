// Main module for the application

// TODO: Implement the new function as per the issue requirements
function calculateTotal(items) {
  if (!Array.isArray(items)) {
    throw new TypeError('Items must be an array');
  }
  
  return items.reduce((sum, item) => {
    if (typeof item !== 'object' || item === null) {
      return sum;
    }
    return sum + (item.price || 0);
  }, 0);
}

// New function to calculate the average price of items
function calculateAveragePrice(items) {
  if (!Array.isArray(items)) {
    throw new TypeError('Items must be an array');
  }
  
  const total = calculateTotal(items);
  const itemCount = items.length;
  
  if (itemCount === 0) {
    throw new Error('Item array is empty');
  }
  
  return total / itemCount;
}

// Export the functions
module.exports = { calculateTotal, calculateAveragePrice };