// TODO: Create or update the affected functions to be accessible

// Function to get user data
function getUserData(userId) {
  return { id: userId, name: 'Test User' };
}

// Function to calculate sum
function calculateSum(a, b) {
  return a + b;
}

// Function to format date
function formatDate(date) {
  return new Date(date).toISOString();
}

// Export all functions to make them accessible
module.exports = {
  getUserData,
  calculateSum,
  formatDate
};