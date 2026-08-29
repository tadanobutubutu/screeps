// TODO: Add back any required exports that might have been removed

// Restore the required exports that were removed
export const VERSION = '1.0.0';

export function initialize() {
  console.log('App initialized');
  return true;
}

export function getConfig() {
  return {
    apiUrl: process.env.API_URL || ...
    timeout: 5000
  };
}

export function calculateDiscount(price, discount) {
  if (typeof price !== 'number' || price < 0) {
    throw new Error('Price must be a non-negative number');
  }
  if (typeof discount !== 'number' || discount < 0) {
    throw new Error('Discount must be a non-negative number');
  }
  
  // Calculate discounted price
  const discountedPrice = price * (1 - discount / 100);
  return Math.max(0, discountedPrice);
}

export default {
  VERSION,
  initialize,
  getConfig,
  calculateDiscount
};