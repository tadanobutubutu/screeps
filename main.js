import React from 'react';

const MyComponent = () => {
  // Existing component code

  // Add ARIA property role for better tab focusability
  const role = 'button';
  const inputRole = 'checkbox';

  return (
    <div>
      {/* Existing component JSX */}

      {/* Add role attribute for better tab focusability */}
      <button role={role}>Button with ARIA role</button>

      {/* Add role='checkbox' attribute for checkboxes */}
      <input type="checkbox" role={inputRole} />
    </div>
  );
};

// Export MyComponent
export default MyComponent;

// REACT_017 & REACT_025: Helper function to get appropriate landmark role
// Ensures unique landmarks by using semantic HTML landmarks
export const getLandmarkRole = (landmarkType) => {
  const landmarkRoles = {
    main: 'main',
    navigation: 'navigation',
    banner: 'banner',
    contentinfo: 'contentinfo',
    complementary: 'complementary',
    form: 'form',
    search: 'search',
  };
  return landmarkRoles[landmarkType] || null;
};

// REACT_041: Helper function to add accessible names to SVG elements
export const getSvgAccessibilityProps = (title, description = '') => {
  const props = {
    'aria-labelledby': `svg-title-${title.replace(/\s+/g, '-').toLowerCase()}`,
    role: 'img',
  };
  
  return {
    svgProps: props,
    titleId: `svg-title-${title.replace(/\s+/g, '-').toLowerCase()}`,
    title: title,
    description: description,
  };
};