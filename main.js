import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

let icons = {};

// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

// Implemented validateLandmark functionality
function validateLandmark(landmark) {
  const errors = [];

  // Check if landmark exists
  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  // Validate name
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  // Validate latitude
  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  // Validate longitude
  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  // Additional validation changes from the other branch
  if (Array.isArray(landmark) && landmark.length > 0) {
    if (!landmark[0].name || typeof landmark[0].name !== 'string' || landmark[0].name.trim() === '') {
      errors.push('Landmark array must have a name');
    }
  }

  // Check for updated validation changes from another branch that also checks for array composition
  if (Array.isArray(landmark)) {
    landmark.forEach(innerLandmark => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push('Landmark array must have valid names');
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

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
function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
      return [];
  }
  const seen = new Set();
  return landmarksArray.filter(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    // Merge both approaches for checking uniqueness
    if (seen.has(key)) {
        return false;
    }
    seen.add(key);
    return true;
  });
}

// ... (previous and updated code remains as it is)

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const validLandmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  if (Array.isArray(elements)) {
    const seen = new Set();
    for (let i = 0; i < elements.length; i++) {
      const landmark = elements[i];
      if (landmark.id) {
        const key = landmark.id + '_' + (landmark.role || 'default');
        if (seen.has(key)) {
          landmark.id = landmark.id + '_' + i;
        }
        seen.add(key);
      }
    }
  }

  return elements;
}

/**
 * Validate landmark structure to ensure proper accessibility
 * @param {HTMLElement} element - The element to validate
 * @returns {Object} Validation result with valid status and any errors
 */
function landmarkStructureCheck(element) {
  const errors = [];
  
  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }
  
  const tagName = element.tagName.toLowerCase();
  const validLandmarks = ['main', 'nav', 'aside', 'footer', 'header', 'form', 'section', 'article', 'search'];
  
  // Check if element has valid landmark role
  const role = element.getAttribute('role');
  const isLandmark = validLandmarks.includes(tagName) || (role && validLandmarks.includes(role));
  
  if (!isLandmark) {
    errors.push('Element should have a valid landmark role');
  }
  
  // Check for accessible name
  const accessibleName = element.getAttribute('aria-label') || 
                         element.getAttribute('aria-labelledby') || 
                         element.textContent.trim();
  
  if (!accessibleName) {
    errors.push('Landmark should have an accessible name (aria-label, aria-labelledby, or content)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * REACT_015: Set language attribute on HTML element
 * @param {string} langCode - The language code (e.g., 'en', 'es', 'fr')
 */
function setLanguageAttribute(langCode) {
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    if (htmlElement) {
      htmlElement.setAttribute('lang', langCode || 'en');
    }
  }
}

/**
 * REACT_017: Add landmark roles and fix landmark issues
 * Adds proper landmark roles to semantic HTML elements and ensures accessibility
 */
function addLandmarkRoles() {
  if (typeof document === 'undefined') return;
  
  const validLandmarks = {
    'header': 'banner',
    'nav': 'navigation',
    'main': 'main',
    'aside': 'complementary',
    'footer': 'contentinfo',
    'form': 'form',
    'section': 'region',
    'article': 'article'
  };
  
  // Process each landmark type
  Object.entries(validLandmarks).forEach(([tagName, defaultRole]) => {
    const elements = document.getElementsByTagName(tagName);
    Array.from(elements).forEach((element, index) => {
      const existingRole = element.getAttribute('role');
      
      // Only add role if not already present
      if (!existingRole) {
        // Add index to role for uniqueness when multiple landmarks of same type exist
        const role = document.querySelectorAll(tagName).length > 1 
          ? `${defaultRole}_${index + 1}` 
          : defaultRole;
        element.setAttribute('role', role);
      }
      
      // Ensure landmark has accessible name
      if (!element.getAttribute('aria-label') && 
          !element.getAttribute('aria-labelledby') && 
          !element.textContent.trim()) {
        // Add aria-label based on landmark type
        const label = `Region ${index + 1}`;
        element.setAttribute('aria-label', label);
      }
    });
  });
}

/**
 * REACT_025: Ensure unique landmarks
 * Ensures all landmarks have unique identifiers or accessible names
 */
function addProperLandmarkRegions() {
  if (typeof document === 'undefined') return;
  
  const landmarkTags = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form'];
  const seenLandmarks = new Map();
  
  landmarkTags.forEach(tag => {
    const elements = document.querySelectorAll(tag);
    elements.forEach((element, index) => {
      const role = element.getAttribute('role') || tag;
      const existingId = element.getAttribute('id');
      const accessibleName = element.getAttribute('aria-label') || 
                             element.getAttribute('aria-labelledby') ||
                             element.textContent.trim();
      
      // Track landmarks of same type
      const count = seenLandmarks.get(role) || 0;
      seenLandmarks.set(role, count + 1);
      
      // Add unique identifier if needed
      if (!existingId && count > 0) {
        element.setAttribute('id', `${role}_${count}`);
      }
      
      // Add accessible name if missing
      if (!accessibleName) {
        element.setAttribute('aria-label', `${role} region`);
      }
    });
  });
}

/**
 * REACT_041: Add accessible names to SVGs
 * Ensures all SVG elements have accessible titles and descriptions
 */
function validateSvgAccessibility() {
  if (typeof document === 'undefined') return;
  
  const svgs = document.querySelectorAll('svg');
  let fixedCount = 0;
  
  svgs.forEach((svg, index) => {
    // Check if SVG has an accessible title
    let title = svg.querySelector('title');
    let desc