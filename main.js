// Main module for the application

// Import required module for scoping table header cells
import { useState } from 'react';

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

// New function to change table header cell scope
function useTableHeaderCellScope() {
  const [scope, setScope] = useState('col'); // Default to column scope

  const toggleScope = () => setScope((prevScope) => (prevScope === 'col' ? 'row' : 'col'));

  return { scope, toggleScope };
}

// Export the functions
module.exports = { calculateTotal, useTableHeaderCellScope };