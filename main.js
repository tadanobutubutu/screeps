// main.js - Core application logic

const CONFIG = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3
};

/**
 * Initialize the application
 */
function initialize() {
  console.log('Application initialized');
  return true;
}

/**
 * Get configuration settings
 * @returns {Object} Configuration object
 */
function getConfig() {
  return { ...CONFIG };
}

/**
 * Process user data
 * @param {Object} userData - User data to process
 * @returns {Object} Processed user data
 */
function processUserData(userData) {
  if (!userData || typeof userData !== 'object') {
    return null;
  }
  
  return {
    ...userData,
    processed: true,
    timestamp: Date.now()
  };
}

// TODO: Implement calculateDiscount
function calculateDiscount(price, discountPercentage) {
  if (typeof price !== 'number' || typeof discountPercentage !== 'number') {
    throw new Error('Invalid input: price and discountPercentage must be numbers');
  }
  
  if (price < 0 || discountPercentage < 0 || discountPercentage > 100) {
    throw new Error('Invalid input: price and discountPercentage must be non-negative, and discountPercentage must not exceed 100');
  }
  
  const discountAmount = price * (discountPercentage / 100);
  const finalPrice = price - discountAmount;
  
  return {
    originalPrice: price,
    discountPercentage: discountPercentage,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100
  };
}

/**
 * Format currency value
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

module.exports = {
  initialize,
  getConfig,
  processUserData,
  calculateDiscount,
  formatCurrency
};