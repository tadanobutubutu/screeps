// dashboard/app/layout.tsx

import React from 'react';

const Layout = ({ children }) => {
  // Add lang attribute to HTML element
  const htmlElement = document.querySelector('html');
  const lang = htmlElement?.lang || 'en'; // Use default language if not specified
  htmlElement.setAttribute('lang', lang);

  // Add aria-hidden="true" to the SVG if it's decorative and not meant to be read by screen readers
  const svgElement = document.querySelector('svg');
  let svgIsDecorative = false; // Update this condition to true if the SVG element is decorative

  if (svgElement) {
    svgElement.setAttribute('aria-hidden', svgIsDecorative ? 'true' : 'false');
  }

  return (
    <div>
      {/* ... other components ... */}
      {children}
    </div>
  );
};

export default Layout;