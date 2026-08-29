// TODO: Create or update the affected functions to be accessible
// ----- BEGIN ORIGINAL CODE (unchanged) -----

function processData(data) {
  return data.map(item => item * 2);
}

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item, 0);
}

module.exports = { processData, calculateTotal };