// Helper function to add accessibility attributes to an SVG element
function addAccessibilityToSVG(svgElement, label) {
  if (svgElement.hasAttribute('aria-hidden') && svgElement.getAttribute('aria-hidden') === 'true') {
    // SVG is decorative and already hidden
    return;
  }

  if (!svgElement.hasAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', label);
  }
}

// Example usage in your JSX components
import React from 'react';

const FaviconSVG = ({ ariaLabel }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      role="img"
      aria-labelledby={ariaLabel}
      // ... other props
    >
      <title id={ariaLabel}>{ariaLabel}</title>
      {/* SVG content */}
    </svg>
  );
};