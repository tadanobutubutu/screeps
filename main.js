// TODO: Create or update the affected functions to be accessible
// TODO: Add any updates related to new functions

// New function to process data
function processData(data) {
  // Process data
  return data.map(item => item * 2);
}

// Existing function to calculate sum
function calculateSum(numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}

// Exporting the new function and preserving existing exports
module.exports = {
  processData,
  calculateSum
};