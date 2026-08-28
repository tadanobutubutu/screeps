// Hypothetical existing code
import React from 'react';

function MyComponent() {
  // Existing code that needs to be preserved

  // Example of an SVG with an accessibility issue - FIXED: Added role and aria-label for accessible name
  const svgElement = (
    <svg
      role="img"
      aria-label="Decorative SVG icon"
      // ... other attributes ...
    >
      <title>Decorative SVG icon</title>
      {/* SVG content */}
    </svg>
  );

  // Example of a table header with an accessibility issue - FIXED: Added scope attribute
  const tableHeader = (
    <th scope="col">
      {/* Table header content */}
    </th>
  );

  // Existing code that needs to be preserved

  return (
    <div>
      {/* ... other JSX elements ... */}
      {svgElement}
      {tableHeader}
      {/* ... other JSX elements ... */}
    </div>
  );
}

export default MyComponent;