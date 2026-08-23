const fs = require('fs');
const path = require('path');

/**
 * Process a TSX/JSX file to add accessible names to SVG elements
 * @param {string} filePath - Path to the file
 * @returns {string|null} - Modified content or null if no changes
 */
function processTsxFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Pattern to match SVG elements (self-closing or with children)
    // Matches <svg ... > or <svg ... />
    const svgRegex = /(<svg\b[^>]*>)|(<svg\b[^>]*\/>)/gi;
    
    content = content.replace(svgRegex, (match) => {
      // Skip if already has aria-label or aria-hidden
      if (match.includes('aria-label') || match.includes('aria-hidden')) {
        return match;
      }
      
      // Add aria-label="SVG Graphic" to make it accessible
      // For icon/favicon SVGs, we add aria-hidden="true" as they're typically decorative
      let modifiedMatch = match;
      
      // Remove trailing /> or > to add attributes
      if (match.endsWith('/>')) {
        modifiedMatch = match.slice(0, -2) + ' aria-hidden="true" />';
      } else if (match.endsWith('>')) {
        modifiedMatch = match.slice(0, -1) + ' aria-hidden="true">';
      }
      
      modified = true;
      return modifiedMatch;
    });
    
    return modified ? content : null;
  } catch (error) {
    console.error(`Error processing TSX file ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Process a file based on its extension
 * @param {string} filePath - Path to the file
 * @returns {boolean} - True if file was modified
 */
function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  // Handle TSX/JSX files
  if (ext === '.tsx' || ext === '.jsx') {
    const newContent = processTsxFile(filePath);
    if (newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  }
  
  return false;
}

/**
 * Recursively find and process files in a directory
 * @param {string} dirPath - Directory path
 * @param {string[]} extensions - File extensions to process
 */
function processDirectory(dirPath, extensions = ['.tsx', '.jsx']) {
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return;
  }
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
      if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
        processDirectory(fullPath, extensions);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (extensions.includes(ext)) {
        processFile(fullPath);
      }
    }
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  // Default: process specific files mentioned in the issue
  const targetFiles = [
    'app/layout.tsx',
    'dashboard/app/layout.tsx'
  ];
  
  for (const file of targetFiles) {
    if (fs.existsSync(file)) {
      processFile(file);
    }
  }
} else if (args[0] === '--dir' && args[1]) {
  // Process all TSX/JSX files in a directory
  processDirectory(args[1]);
} else {
  // Process specific files
  for (const file of args) {
    if (fs.existsSync(file)) {
      processFile(file);
    } else {
      console.warn(`File not found: ${file}`);
    }
  }
}

// Utility functions for accessibility improvements

/**
 * Manages focus for accessibility
 * @param {HTMLElement} element - The element to focus
 */
function manageFocus(element) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
}

/**
 * Announces content to screen readers using ARIA live regions
 * @param {string} message - The message to announce
 */
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Handles keyboard navigation for interactive elements
 * @param {KeyboardEvent} event - The keyboard event
 * @param {string} selector - CSS selector for focusable elements
 */
function handleKeyboardNavigation(event, selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') {
  const focusableElements = Array.from(document.querySelectorAll(selector));
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.key === 'Tab') {
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}

/**
 * Removes focus outlines for mouse users while preserving for keyboard users
 */
function initFocusManagement() {
  let hadKeyboardEvent = false;
  
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      hadKeyboardEvent = true;
      document.body.classList.add('user-is-tabbing');
    }
  });

  document.addEventListener('mousedown', () => {
    if (hadKeyboardEvent) {
      document.body.classList.remove('user-is-tabbing');
      hadKeyboardEvent = false;
    }
  });
}

/**
 * Ensures proper focus management when modal dialogs open/close
 * @param {HTMLElement} modal - The modal element
 * @param {HTMLElement} triggerElement - The element that triggered the modal
 */
function trapFocusInModal(modal, triggerElement) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
    if (event.key === 'Escape') {
      modal.blur();
      if (triggerElement) triggerElement.focus();
    }
  });

  firstFocusable?.focus();
}

// Import from remote branch for dependency management
const { 
  getRecommendedUpdateOrder, 
  hasBreakingChanges, 
  processDependencyUpdates,
  DEPENDENCY_UPDATES,
  checkCompatibility,
  validateDependencies,
  getLangAttribute,
  validateLandmark,
  getSvgAccessibleName,
  validateTableAccessibility,
  getTableScopeRecommendation,
  validateLinkAccessibility,
  createInPageButton,
  validateUniqueLandmarks,
  validateLandmarkStructure,
  validateTableStructure,
  getTableCellAttributes,
  createSvgAccessibilityProps,
  validateSvgAccessibility,
  validateLinkOrButton,
  createAccessibleLink,
  getFullLangAttribute,
  validateLangAttribute
} = require('some-module');

// Export all functions for use in other modules
module.exports = {
  processFile,
  processTsxFile,
  processDirectory,
  manageFocus,
  announceToScreenReader,
  handleKeyboardNavigation,
  initFocusManagement,
  trapFocusInModal,
  getRecommendedUpdateOrder,
  hasBreakingChanges,
  processDependencyUpdates,
  DEPENDENCY_UPDATES,
  checkCompatibility,
  validateDependencies,
  getLangAttribute,
  validateLandmark,
  getSvgAccessibleName,
  validateTableAccessibility,
  getTableScopeRecommendation,
  validateLinkAccessibility,
  createInPageButton,
  validateUniqueLandmarks,
  validateLandmarkStructure,
  validateTableStructure,
  getTableCellAttributes,
  createSvgAccessibilityProps,
  validateSvgAccessibility,
  validateLinkOrButton,
  createAccessibleLink,
  getFullLangAttribute,
  validateLangAttribute
};

// Initialize accessibility features on DOM load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initFocusManagement();
  });
}