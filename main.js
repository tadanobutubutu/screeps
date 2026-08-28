// TODO: Add back any required exports that might have been removed

// Resolve conflicts and add back removed exports
const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price || 0), 0);
};

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const capitalizeString = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

module.exports = {
  formatDate,
  calculateTotal,
  validateEmail,
  capitalizeString,
  debounce
};