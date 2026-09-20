// TODO: Create or update the affected functions to be accessible
//------ BEGIN ORIGINAL CODE (unchanged)------

// Sample function that should be accessible
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Another function to be exported
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// Internal helper function
function validateInput(data) {
  if (!data || typeof data !== 'object') {
    return false;
  }
  return true;
}

// Main application logic
function processOrder(order) {
  if (!validateInput(order)) {
    return { error: 'Invalid order data' };
  }
  
  const total = calculateTotal(order.items || []);
  return {
    orderId: order.id,
    total: total,
    formattedTotal: formatCurrency(total),
    status: 'processed'
  };
}

//------ END ORIGINAL CODE (unchanged)------

// Export all functions that should be accessible
module.exports = {
  calculateTotal,
  formatCurrency,
  processOrder,
  validateInput
};