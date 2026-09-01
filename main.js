// TODO: Create or update the affected functions to be accessible
// The functions below have been created to match the exported names

function processData(input) {
  return input;
}

function calculateTotal(items) {
  if (!items || !Array.isArray(items)) {
    return 0;
  }
  return items.reduce((sum, item) => {
    return sum + (item.price || 0);
  }, 0);
}

function formatResponse(data, format) {
  if (format === 'json') {
    return JSON.stringify(data);
  } else if (format === 'xml') {
    return `<data>${JSON.stringify(data)}</data>`;
  }
  return String(data);
}

function validateInput(input) {
  if (input === null || input === undefined) {
    return false;
  }
  if (typeof input === 'string' && input.trim().length === 0) {
    return false;
  }
  return true;
}

function transformData(data, transformer) {
  if (typeof transformer !== 'function') {
    return data;
  }
  return transformer(data);
}

function mergeResults(primary, secondary) {
  return { ...primary, ...secondary };
}

// TODO: This is the existing code that needs to be preserved
function newFunction() {
  // Implementation for the new function
}

module.exports = {
  processData,
  calculateTotal,
  formatResponse,
  validateInput,
  transformData,
  mergeResults,
  newFunction
};