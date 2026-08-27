// main.js

// REACT_027: Implements a utility function for React component lifecycle handling
// Function REACT_027 (Assuming it's a new function)
function REACT_027(component) {
  if (!component) {
    return null;
  }

  // Handle functional components
  if (typeof component === 'function') {
    return {
      type: component,
      props: component.defaultProps || {}
    };
  }

  // Handle class components
  if (component.prototype && component.prototype.isReactComponent) {
    return {
      type: component,
      props: component.defaultProps || {}
    };
  }

  // Handle element objects
  if (component.type) {
    return {
      type: component.type,
      props: component.props || {}
    };
  }

  return null;
}

// Export the function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { REACT_027 };
}