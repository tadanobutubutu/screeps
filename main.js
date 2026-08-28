// main.js
export function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}

// ... rest of the code ...