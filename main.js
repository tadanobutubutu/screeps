// TODO: Address accessibility issues from insight report
// Added accessibility-related functionality

module.exports = {
  // Export functions or values as needed
  someFunction: function() {
    return 'some value';
  },
  anotherFunction: function(arg) {
    return arg;
  },
  // Hypothetical previous content of main.js
  oldFunction: function() {
    // ... old code ...
  },
  // Hypothetical missing export
  missingFunction: function() {
    // ... new code ...
  },
  // New function or changes requested in the issue
  ensureUniqueMain: function() {
    // This function contains logic to ensure that only one <main> tag is present
    // in the entire rendered tree. This addresses the accessibility requirement
    // that there should be only one <main> landmark per page for screen readers.
    
    // Query all main elements in the document
    const mainElements = document.querySelectorAll('main');
    
    // If more than one main tag exists, remove duplicates keeping only the first
    if (mainElements.length > 1) {
      for (let i = 1; i < mainElements.length; i++) {
        mainElements[i].remove();
      }
      console.warn(`Accessibility fix: Removed ${mainElements.length - 1} duplicate <main> tag(s). Only one <main> tag should exist per page.`);
    }
    
    // Return the remaining main element if any
    return mainElements[0] || null;
  }
};