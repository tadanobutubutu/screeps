// Existing code
const existingFunction = () => {};
module.exports = {
  existingFunction,
  // Other exports...
};

// New function
const getSvgAccessibleName = (svgElement) => {
  // Implement your logic here.
  // For example:
  if (!svgElement || !svgElement.hasAttribute('aria-label')) {
    return svgElement.nodeName;
  }
  return svgElement.ariaLabel || svgElement.nodeName;
};

// Add the new function to the exports...
module.exports.getSvgAccessibleName = getSvgAccessibleName;