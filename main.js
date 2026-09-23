// main.js - Main application file

// Existing configuration
const APP_CONFIG = {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
    retries: 3
};

// Existing utility functions
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return date.toISOString().split('T')[0];
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Existing data processing
function processData(items) {
    if (!Array.isArray(items)) {
        return [];
    }
    return items.map(item => ({
        ...item,
        processed: true,
        timestamp: Date.now()
    }));
}

// Existing helper functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// New function to implement
function formatString(input) {
    if (typeof input !== 'string') {
        return '';
    }
    return input.trim().replace(/\s+/g, ' ').toLowerCase();
}

// Export functions for testing
module.exports = {
    formatDate,
    validateEmail,
    processData,
    debounce,
    formatString,
    APP_CONFIG
};