// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// Import required module(s) here (if any modules are needed, add them below)
// Example: const someModule = require('some-module');

module.exports = {
  // Export functions or values as needed
  someFunction: function() {
    return 'some value';
  },
  anotherFunction: function(arg) {
    return arg;
  },
  // New function to address accessibility issue
  addLangAttribute: function(htmlElement) {
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en'); // Default to English
    }
  },
  // New function as per issue request
  processRequest: function(request) {
    // Process the request in some way
    console.log('Processing request:', request);
    // Return processed request
    return request;
  }
};