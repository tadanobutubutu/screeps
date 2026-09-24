// TODO: Create or update the affected functions to be accessible
// ----- BEGIN ORIGINAL CODE (unchanged) -----

// Sample functions that need to be made accessible
function getData() {
  return { name: 'sample', value: 42 };
}

function processData(data) {
  if (!data) return null;
  return { ...data, processed: true };
}

function calculateTotal(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + (item.price || 0), 0);
}

function validateInput(input) {
  if (typeof input !== 'string') return false;
  return input.length > 0 && input.length <= 100;
}

function formatOutput(data, options = {}) {
  const { prefix = '', suffix = '', uppercase = false } = options;
  let result = `${prefix}${JSON.stringify(data)}${suffix}`;
  return uppercase ? result.toUpperCase() : result;
}

// Export all functions to make them accessible in main.js
module.exports = {
  getData,
  processData,
  calculateTotal,
  validateInput,
  formatOutput
};