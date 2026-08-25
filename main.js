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

// Export the function
module.exports = { calculateTotal };