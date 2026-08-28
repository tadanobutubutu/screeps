const { formatDate } = require('./utils/dateUtils');
const { validateEmail } = require('./utils/validation');
const { calculateTotal } = require('./utils/math');

// TODO: Create or update the affected functions to be accessible

// Export utility functions that are required by the test suite
module.exports = {
  formatDate,
  validateEmail,
  calculateTotal,
  checkLandmarkStructure
};