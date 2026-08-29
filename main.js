import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// TODO: Address accessibility issues from insight report:

// Configuration
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

// Register the service worker
registerSW();

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarks) {
    const seen = new Set();
    return landmarks.filter(landmark => {
        const key = landmark.name + '_' + (landmark.role || 'default');
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

// Testing the checkLandmarkElement function:
// To test this function, we could create a test file with the following content:
const landmarkStructureCheck = (landmark) => {
  if (!landmark.name || !landmark.coordinates) {
    return false;
  }
  return true;
};

/**
 * Initializes the application and applies accessibility fixes.
 */
const initApp = () => {
  // Initialize the main application
  initializeApp();

  // Apply accessibility fixes
  setLanguageAttribute(); // Default to 'en'
  addLandmarkRoles();
  ensureUniqueLandmarks(landmarks);

  // Add accessible names to SVGs (example selectors and names)
  icons = {
    icon: '<svg viewBox="0 0 100 100" aria-label="Screps icon"></svg>'
  };

  // Fix fake links
  fixFakeLinks();

  // Initialize the application data
  console.log('Initializing ' + appData.title + ' v' + appData.version);
  // ... (assuming other initialization logic is present)
};

// Check if the environment is secure before initializing
if (isSecureContext()) {
  initApp();
} else {
  console.warn('Application is not running in a secure context. Some features may not be available.');
}

// Check for proper header scope values
function checkHeaderScope(header, index, isInThead) {
  const scope = header.getAttribute('scope');
  const issues = [];
  
  if (!scope) {
    issues.push({
      type: 'warning',
      message: `Header cell at index ${index} is missing a scope attribute`
    });
  } else if (isInThead && scope !== 'col' && scope !== 'row') {
    issues.push({
      type: 'warning',
      message: `Header cell at index ${index} has invalid scope "${scope}" (expected "col" or "row")`
    });
  }
  
  return issues;
}

// Check if header cells have descriptive text
function checkHeaderContent(header, index) {
  const issues = [];
  const text = header.textContent.trim();
  
  if (!text) {
    issues.push({
      type: 'warning',
      message: `Header cell at index ${index} has no text content`
    });
  } else if (text.length < 2) {
    issues.push({
      type: 'info',
      message: `Header cell at index ${index} has very short text content`
    });
  }
  
  return issues;
}

// TODO: Implement this function for accessibility checks on tables
function checkTableAccessibility(tableElement) {
  if (!tableElement || tableElement.tagName !== 'TABLE') {
    return [{ type: 'error', message: 'Provided element is not a table' }];
  }

  const issues = [];

  // Check for caption
  const caption = tableElement.querySelector('caption');
  if (!caption) {
    issues.push({ type: 'warning', message: 'Table is missing a <caption> element' });
  } else {
    const captionText = caption.textContent.trim();
    if (!captionText) {
      issues.push({ type: 'warning', message: 'Table caption is empty' });
    }
  }

  // Check for header cells
  const headers = tableElement.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push({ type: 'error', message: 'Table has no header cells (<th>)' });
  } else {
    // Check for scope attributes on headers
    headers.forEach((header, index) => {
      const isInThead = header.closest('thead') !== null;
      
      // Check scope attribute
      issues.push(...checkHeaderScope(header, index, isInThead));
      
      // Check header content
      issues.push(...checkHeaderContent(header, index));
      
      // Check for abbreviations
      const abbr = header.getAttribute('abbr');
      if (!abbr && header.textContent.length > 20) {
        issues.push({
          type: 'info',
          message: `Header cell at index ${index} is long and may benefit from an abbr attribute`
        });
      }
    });
  }

  // Check for thead/tbody structure
  const hasThead = tableElement.querySelector('thead');
  const hasTbody = tableElement.querySelector('tbody');
  if (!hasThead && headers.length > 0) {
    issues.push({ type: 'warning', message: 'Table headers should be wrapped in <thead>' });
  }
  if (!hasTbody) {
    issues.push({ type: 'warning', message: 'Table body should be wrapped in <tbody>' });
  }

  // Check for data cells without associated headers
  const dataCells = tableElement.querySelectorAll('td');
  dataCells.forEach((cell, index) => {
    const headersAttr = cell.getAttribute('headers');
    if (!headersAttr && headers.length > 0) {
      issues.push({ 
        type: 'info', 
        message: `Data cell at index ${index} has no explicit headers association` 
      });
    }
  });

  // Check for summary attribute (deprecated but still used)
  const summary = tableElement.getAttribute('summary');
  if (summary) {
    issues.push({
      type: 'info',
      message: 'Table uses deprecated summary attribute - consider using <caption> instead'
    });
  }

  return issues;
}

// Check image accessibility
function checkImageAccessibility(imgElement) {
  const issues = [];
  
  if (!imgElement || imgElement.tagName !== 'IMG') {
    return [{ type: 'error', message: 'Provided element is not an image' }];
  }
  
  const alt = imgElement.getAttribute('alt');
  const src = imgElement.getAttribute('src');
  
  if (!src) {
    issues.push({ type: 'error', message: 'Image is missing src attribute' });
    return issues;
  }
  
  if (alt === null) {
    issues.push({ type: 'error', message: 'Image is missing alt attribute' });
  } else if (alt === '') {
    issues.push({ 
      type: 'info', 
      message: 'Image has empty alt attribute (decorative image)' 
    });
  } else if (alt.length < 5) {
    issues.push({
      type: 'warning',
      message: 'Image alt text is very short and may not be descriptive'
    });
  }
  
  // Check for title attribute
  const title = imgElement.getAttribute('title');
  if (title && alt) {
    issues.push({
      type: 'info',
      message: 'Image has both alt and title attributes - consider removing title'
    });
  }
  
  // Check for long descriptions
  const longDesc = imgElement.getAttribute('longdesc');
  if (!longDesc && alt && alt.length > 100) {
    issues.push({
      type: 'info',
      message: 'Complex image may benefit from a longdesc attribute or linked description'
    });
  }
  
  return issues;
}

// Check form label associations
function checkFormAccessibility(formElement) {
  const issues = [];
  
  if (!formElement || formElement.tagName !== 'FORM') {
    return [{ type: 'error', message: 'Provided element is not a form' }];
  }
  
  const inputs = formElement.querySelectorAll('input, select, textarea');
  const labels = formElement.querySelectorAll('label');
  
  inputs.forEach((input, index) => {
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledby = input.getAttribute('aria-labelledby');
    const placeholder = input.getAttribute('placeholder');
    
    // Check for label association
    let hasLabel = false;
    if (id) {
      labels.forEach(label => {
        if (label.getAttribute('for') === id) {
          hasLabel = true;
        }
      });
    }
    
    if (!hasLabel && !ariaLabel && !ariaLabelledby) {
      issues.push({
        type: 'error',
        message: `Input at index ${index} has no associated label`
      });
    }
    
    // Check placeholder usage
    if (placeholder && !ariaLabel && !hasLabel) {
      issues.push({
        type: 'warning',
        message: `Input at index ${index} relies only on placeholder text`
      });
    }
    
    // Check for required indicators
    const required = input.hasAttribute('required');
    const ariaRequired = input.getAttribute('aria-required');
    if (required && !ariaRequired) {
      issues.push({
        type: 'info',
        message: `Input at index ${index} is required but may benefit from aria-required attribute`
      });
    }
  });
  
  return issues;
}

// Main execution
function main() {
  initialize();
  console.log('Main function executed');
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  initialize,
  processData,
  validateInput,
  checkTableAccessibility,
  checkImageAccessibility,
  checkFormAccessibility,
  config
};