// main.js - Module exports

// Helper function to format data
function formatData(data) {
    if (Array.isArray(data)) {
        return data.map(item => item.toString());
    }
    return String(data);
}

// Validate input parameters
function validateInput(input) {
    if (input === null || input === undefined) {
        return false;
    }
    return true;
}

// Process data with given options
function processData(data, options = {}) {
    if (!validateInput(data)) {
        throw new Error('Invalid input data');
    }
    return {
        result: formatData(data),
        processed: true,
        timestamp: Date.now(),
        ...options
    };
}

// TODO: Add any other missing exports that might have been?
// Added missing exports as per the issue

// Export existing functions
module.exports = {
    formatData,
    validateInput,
    processData,
    // Missing exports added
    VERSION: '1.0.0',
    DEFAULT_OPTIONS: {
        timeout: 5000,
        retries: 3
    }
};

// Also export as ES modules if needed
module.exports.formatData = formatData;
module.exports.validateInput = validateInput;
module.exports.processData = processData;
module.exports.VERSION = '1.0.0';
module.exports.DEFAULT_OPTIONS = {
    timeout: 5000,
    retries: 3
};