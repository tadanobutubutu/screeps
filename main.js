// TODO: Add the necessary new functions (without strict mode)

// Helper function to check if a value is defined
function isDefined(value) {
    return value !== undefined && value !== null;
}

// Helper function to check if a value is a number
function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}

// Helper function to check if a value is a string
function isString(value) {
    return typeof value === 'string';
}

// Helper function to safely parse JSON
function safeJsonParse(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        return null;
    }
}

// Helper function to clone an object
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    
    const clonedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }
    return clonedObj;
}

// Helper function to generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

/**
 * Adds lang attribute to the HTML element for accessibility.
 * This helps screen readers and assistive technologies understand the page language.
 */
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Export functions for testing and accessibility feature
module.exports = {
    isDefined,
    isNumber,
    isString,
    safeJsonParse,
    deepClone,
    generateId,
    addLangAttribute
};