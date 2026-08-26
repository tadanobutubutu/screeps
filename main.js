// Existing code from main.js
// ... (Preserve all existing code, exports, and functions)

// Add the following changes to fix the issue with the lang attribute
module.exports = {
  // ... (Preserve existing exports)

  renderDependencyGraph: function() {
    // ... (Preserve existing function code)

    // Add the lang attribute to the HTML element
    const htmlElement = document.createElement('html');
    htmlElement.setAttribute('lang', 'en');
    // ... (Rest of the function code)
  },

  // ... (Preserve any other existing functions)
};

// ... (Preserve any other existing code, exports, and functions)