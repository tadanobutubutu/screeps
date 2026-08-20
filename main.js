// main.js
import React from 'react';

// Utility function to add accessible name to SVGs
function addAccessibleName(svgProps) {
  if (!svgProps) return svgProps;
  const { ariaLabel, children, ...restProps } = svgProps;
  if (ariaLabel) {
    // If an aria-label is provided, use it as the accessible name
    return { ...restProps, 'aria-label': ariaLabel };
  } else if (React.isValidElement(children) && children.type === 'title') {
    // If a title child is provided, use its text content as the accessible name
    return { ...restProps, 'aria-label': children.props.children };
  } else if (!restProps['aria-hidden']) {
    // If no accessible name is provided and aria-hidden is not set, add aria-hidden="true"
    return { ...restProps, 'aria-hidden': 'true' };
  }
  return svgProps;
}

// Example component usage
function MyComponent() {
  return (
    <svg {...addAccessibleName({ ariaLabel: 'My SVG description' })}>
      {/* SVG content */}
      <title>My SVG description</title>
      {/* or */}
      {/* <title>My SVG description</title> */}
    </svg>
  );
}

export default MyComponent;