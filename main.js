// main.js

// TODO: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)

const fs = require('fs');
const path = require('path');

// ----- BEGIN ORIGINAL CODE (unchanged) -----
// TODO: This is the existing code that needs to be preserved
// ...

const someData = [];

function processData(data) {
    return data.map(item => {
        // process each item
        return {
            ...item,
            processed: true
        };
    });
}

/**
 * Validate a single landmark object
 * @param {Object} landmark - The landmark to validate
 * @returns {Object} - { valid: boolean, error?: string }
 */
function validateLandmark(landmark) {
    // Check required fields
    if (!landmark || typeof landmark !== 'object') {
        return { valid: false, error: 'Landmark must be an object' };
    }
    
    const requiredFields = ['name', 'coordinates', 'type'];
    for (const field of requiredFields) {
        if (!(field in landmark) || landmark[field] === null || landmark[field] === undefined) {
            return { valid: false, error: `Missing required field: ${field}` };
        }
    }
    
    // Validate coordinates structure
    if (!landmark.coordinates || 
        typeof landmark.coordinates !== 'object' ||
        typeof landmark.coordinates.lat !== 'number' ||
        typeof landmark.coordinates.lng !== 'number') {
        return { valid: false, error: 'Invalid coordinates: must have lat and lng as numbers' };
    }
    
    // Validate coordinate ranges
    const { lat, lng } = landmark.coordinates;
    if (lat < -90 || lat > 90) {
        return { valid: false, error: 'Latitude must be between -90 and 90' };
    }
    if (lng < -180 || lng > 180) {
        return { valid: false, error: 'Longitude must be between -180 and 180' };
    }
    
    // Validate landmark type
    const validTypes = ['monument', 'building', 'natural', 'historic', 'cultural'];
    if (!validTypes.includes(landmark.type)) {
        return { valid: false, error: `Invalid type: must be one of ${validTypes.join(', ')}` };
    }
    
    return { valid: true };
}

/**
 * Validate the structure of landmarks collection
 * @param {Array} landmarks - Array of landmarks to validate
 * @returns {Object} - { valid: boolean, error?: string }
 */
function validateLandmarkStructure(landmarks) {
    // Check if landmarks is an array
    if (!Array.isArray(landmarks)) {
        return { valid: false, error: 'Landmarks must be an array' };
    }
    
    // Check for empty array
    if (landmarks.length === 0) {
        return { valid: false, error: 'Landmarks array cannot be empty' };
    }
    
    // Check for duplicate names
    const names = landmarks.map(l => l && l.name).filter(Boolean);
    const uniqueNames = new Set(names);
    if (uniqueNames.size !== names.length) {
        const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
        return { valid: false, error: `Duplicate landmark names: ${[...new Set(duplicates)].join(', ')}` };
    }
    
    // Validate each landmark
    for (let i = 0; i < landmarks.length; i++) {
        const result = validateLandmark(landmarks[i]);
        if (!result.valid) {
            return { valid: false, error: `Landmark at index ${i}: ${result.error}` };
        }
    }
    
    return { valid: true };
}

/**
 * Create an in-page button element
 * @param {string} buttonId - Unique identifier for the button
 * @param {string} buttonText - Text displayed on the button
 * @param {string} buttonClass - CSS class name(s) to apply to the button
 * @returns {HTMLElement} - The created button element
 */
function createInPageButton(buttonId, buttonText, buttonClass) {
  // Create a new button element
  const button = document.createElement('button');
  
  // Set the button's ID, text content, and class
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;
  
  // Append the button to the body or a specific container
  document.body.appendChild(button);
  
  // Return the created button for further manipulation if needed
  return button;
}

function calculateDiscount(price, discountRate) {
    // Calculate and return the discounted price
    return price - (price * discountRate);
}

// ----- END ORIGINAL CODE -------
// ... existing code above ...

// TODO: Implement a function to count dependencies
function countDependencies() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

// TODO: Implement this function for adding SVG accessibility props
function addSvgAccessibilityProps(svgElement, options = {}) {
  const {
    role = 'img',
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    focusable = false,
    tabIndex
  } = options;

  if (role && !svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', role);
  }

  if (ariaLabel && !svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', ariaLabel);
  }

  if (ariaLabelledby && !svgElement.getAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-labelledby', ariaLabelledby);
  }

  if (ariaDescribedby && !svgElement.getAttribute('aria-describedby')) {
    svgElement.setAttribute('aria-describedby', ariaDescribedby);
  }

  if (typeof focusable === 'boolean' && !svgElement.hasAttribute('focusable')) {
    svgElement.setAttribute('focusable', focusable.toString());
  }

  if (tabIndex !== undefined && !svgElement.hasAttribute('tabindex')) {
    svgElement.setAttribute('tabindex', tabIndex);
  }

  return svgElement;
}

// Export affected functions and new function to make them accessible
// ... existing code below ...
module.exports = {
    someData,
    processData,
    validateLandmark,
    validateLandmarkStructure,
    createInPageButton,
    calculateDiscount,
    countDependencies,
    addSvgAccessibilityProps
};