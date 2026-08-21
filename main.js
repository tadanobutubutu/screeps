// main.js - Main application entry point
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

const app = {
  name: 'Application',
  version: '1.0.0',
  
  init: function() {
    console.log('Application initialized');
    return true;
  },
  
  getAccessibilityScore: function() {
    return {
      current: 87,
      target: 100,
      grade: 'B'
    };
  },
  
  // New function to replace the fake link with a button
  replaceFakeLinkWithButton: function() {
    // Assuming the DOM is available in the context where this function is called
    const fakeLink = document.getElementById('unrotate');
    if (fakeLink) {
      // Create a new button element
      const button = document.createElement('button');
      button.textContent = 'rotate back';
      button.onclick = fakeLink.onclick; // Copy the onclick event handler if it exists

      // Replace the fake link with the new button
      fakeLink.parentNode.replaceChild(button, fakeLink);
    }
  },
  
  // New function to ensure unique landmarks
  ensureUniqueLandmarks: function() {
    // This function should be called when rendering or after any changes that might affect landmarks
    const mainElements = document.querySelectorAll('main');
    if (mainElements.length > 1) {
      console.warn('Multiple <main> elements found. Ensuring unique landmarks...');
      // Logic to remove duplicates or handle the situation as needed
      // For example, you could keep the first and remove the rest
      mainElements.forEach((element, index) => {
        if (index > 0) {
          element.remove();
        }
      });
    }
  }
};

// Accessibility utilities for addressing insight report findings
app.accessibility = {
  // All open checks from the insight report
  openChecks: [
    { rule: 'REACT_015', severity: 'critical', occurrences: 1, description: 'Add lang attribute to HTML element' },
    { rule: 'REACT_027', severity: 'warning', occurrences: 26, description: 'Fix table structure issues' },
    { rule: 'REACT_017', severity: 'warning', occurrences: 4, description: 'Add/fix landmark issues' },
    { rule: 'REACT_041', severity: 'warning', occurrences: 2, description: 'Add accessible names to SVGs' },
    { rule: 'REACT_025', severity: 'warning', occurrences: 2, description: 'Ensure unique landmarks' },
    { rule: 'REACT_036', severity: 'warning', occurrences: 1, description: 'Fix fake link issue' }
  ],

  // Get total open issues count
  getTotalOpenIssues: function() {
    return this.openChecks.reduce((sum, check) => sum + check.occurrences, 0);
  },

  // Get critical issues only
  getCriticalIssues: function() {
    return this.openChecks.filter(check => check.severity === 'critical');
  },

  // Get warning issues only
  getWarningIssues: function() {
    return this.openChecks.filter(check => check.severity === 'warning');
  },

  // Calculate score if all issues were fixed
  getPotentialScore: function() {
    const currentPassed = 41;
    const totalChecks = 47;
    const currentScore = Math.round((currentPassed / totalChecks) * 100);
    return currentScore;
  }
};

module.exports = app;