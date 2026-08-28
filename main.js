/**
 * Main module for SVG accessibility utilities
 */

// Existing utility functions
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// SVG accessibility props helper
const getSvgAccessibilityProps = (title, description) => {
  const props = { role: 'img' };
  
  if (title) {
    props['aria-label'] = title;
  }
  
  if (description) {
    props['aria-describedby'] = description;
  }
  
  return props;
};

// TODO: Implement this function for adding SVG accessibility props
const addSvgAccessibilityProps = (props, options = {}) => {
  const { title, description, hidden } = options;
  
  const accessibilityProps = getSvgAccessibilityProps(title, description);
  
  if (hidden) {
    accessibilityProps['aria-hidden'] = true;
  }
  
  return {
    ...props,
    ...accessibilityProps
  };
};

// Export all functions
module.exports = {
  isValidUrl,
  capitalizeFirstLetter,
  getSvgAccessibilityProps,
  addSvgAccessibilityProps
};