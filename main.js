// TODO: Add back any required exports that might have been removed
// Example of how to export a required function from another file
// const { myFunction } = require('./otherFile');
// module.exports = { myFunction };

// Export utility functions that are required by the test suite
const { formatDate } = require('./utils/dateUtils');
const { validateEmail } = require('./utils/validation');
const { calculateTotal } = require('./utils/math');

module.exports = {
  formatDate,
  validateEmail,
  calculateTotal
};