// main.js - User Safety Module

// TODO: This is the existing code that needs to be preserve

const userSafety = {
  status: 'unsafe',
  categories: ['Unauthorized Advice']
};

function getSafetyStatus() {
  return userSafety.status;
}

function getSafetyCategories() {
  return userSafety.categories;
}

function checkSafety(input) {
  if (!input || typeof input !== 'string') {
    return { safe: false, reason: 'Invalid input' };
  }
  
  const unsafePatterns = userSafety.categories;
  const isUnsafe = unsafePatterns.some(pattern => 
    input.toLowerCase().includes(pattern.toLowerCase())
  );
  
  return {
    safe: !isUnsafe,
    categories: isUnsafe ? unsafePatterns : []
  };
}

module.exports = {
  userSafety,
  getSafetyStatus,
  getSafetyCategories,
  checkSafety
};