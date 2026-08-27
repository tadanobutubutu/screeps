// TODO: Create or update the affected functions to be accessible

function initializeApp() {
  return 'App initialized';
}

function processData(data) {
  if (!data) return null;
  return data.map(item => item * 2);
}

function validateInput(input) {
  if (typeof input !== 'string') return false;
  return input.length > 0;
}

function formatOutput(result) {
  return JSON.stringify(result, null, 2);
}

function handleError(error) {
  console.error('Error occurred:', error.message);
  return { success: false, error: error.message };
}

function calculateMetrics(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return { count: 0, sum: 0, average: 0 };
  }
  
  const sum = data.reduce((acc, val) => acc + val, 0);
  return {
    count: data.length,
    sum: sum,
    average: sum / data.length
  };
}

module.exports = {
  initializeApp,
  processData,
  validateInput,
  formatOutput,
  handleError,
  calculateMetrics
};