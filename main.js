module.exports = {
  // Main application entry point
  app: require('./app'),
  
  // Configuration
  config: require('./config'),
  
  // Utility functions
  utils: require('./utils'),
};

// Named exports for individual modules
module.exports.hello = require('./hello');
module.exports.User = require('./models/User');
module.exports.validateInput = require('./validateInput');

// New function to enhance SVG accessibility
module.exports.fixSvgAccessibleName = (svgContent) => {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`;
  return svgString.replace(/<svg/g, '<svg aria-label="Descriptive label for SVG">');
};

// Example usage of the new function to fix the issue in the affected files
// This should be called when generating the icons or updating the SVG content in the affected files

// Note: This is just a conceptual example. In a real-world scenario, the actual implementation might differ.
module.exports.fixSvgAccessibleName(icons.icon);
module.exports.fixSvgAccessibleName(icons.apple);