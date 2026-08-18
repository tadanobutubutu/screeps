// ExampleComponent.js
import React from 'react';

const ExampleComponent = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Column 1</th>
          <th scope="col">Column 2</th>
          <th scope="col">Column 3</th>
        </tr>
      </thead>
      <tbody>
        {/* Table rows here */}
      </tbody>
    </table>
  );
};

export default ExampleComponent;

// New component for accessible SVG
const AccessibleSvg = ({ isDecorative, label, children }) => {
  if (isDecorative) {
    return <svg aria-hidden="true">{children}</svg>;
  }
  return (
    <svg aria-label={label}>
      <title>{label}</title>
      {children}
    </svg>
  );
};

export { AccessibleSvg };