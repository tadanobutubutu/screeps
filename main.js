// TODO: This is the existing code that needs to be preserved
const getAccessibleName = (node) => {
  // ... (keep the existing code)
};

const setAccessibleName = (node, accessibleName) => {
  // ... (keep the existing code)
};

// New function to convert anchor tags to button tags
const convertLinkToButton = (node) => {
  if (node.tagName === 'A' && !node.href.includes('http')) {
    const button = document.createElement('button');
    button.textContent = node.textContent;
    button.setAttribute('aria-label', getAccessibleName(node));
    node.parentNode.replaceChild(button, node);
  }
};

// Update exports with the new function
module.exports = { getAccessibleName, setAccessibleName, convertLinkToButton };