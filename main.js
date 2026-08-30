// Feature implemented
function getGreeting(name) {
  if (!name) {
    return "Hello, World!";
  }
  return `Hello, ${name}!`;
}

function processData(data) {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
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

module.exports = {
  getGreeting,
  processData,
  validateInput
};