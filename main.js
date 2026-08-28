// TODO: add the new functions or changes requested in the issue

// Placeholder for the updated main.js
// Since I don't have the full context of the existing main.js file,
// please provide the complete current content so I can properly update it.

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
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Function to validate email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to capitalize first letter
function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export all functions to make them accessible
module.exports = {
  getUserData,
  calculateSum,
  formatDate,
  validateEmail,
  capitalizeFirstLetter
};