// main.js

// Some existing configuration
const CONFIG = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// Helper function
function formatData(data) {
  if (Array.isArray(data)) {
    return data.map(item => item.toString());
  }
  return [data.toString()];
}

// TODO: Update the implementation of this function if needed
function processUserData(user) {
  if (!user || typeof user !== 'object') {
    return null;
  }
  
  const formattedData = formatData(user);
  return {
    id: user.id || Date.now(),
    name: user.name || 'Anonymous',
    email: user.email || '',
    data: formattedData
  };
}

// Another helper function
function validateInput(input) {
  return input !== null && input !== undefined;
}

// Process multiple users
function processUsers(users) {
  if (!Array.isArray(users)) {
    return [];
  }
  
  return users
    .filter(validateInput)
    .map(processUserData)
    .filter(user => user !== null);
}

// Export functions
module.exports = {
  CONFIG,
  formatData,
  processUserData,
  validateInput,
  processUsers
};