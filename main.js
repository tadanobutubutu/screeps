// main.js

// Utility functions
function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// TODO: Add any other missing exports that might have been?
// Added missing exports as per the issue
function fetchData(endpoint) {
  return fetch(endpoint).then(res => res.json());
}

function saveData(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data) resolve({ success: true });
      else reject(new Error('No data provided'));
    }, 100);
  });
}

function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Existing exports
module.exports = {
  formatDate,
  validateEmail,
  calculateTotal,
  fetchData,
  saveData,
  parseJSON,
  debounce,
  throttle
};