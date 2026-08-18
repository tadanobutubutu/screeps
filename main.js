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

// New component for the rotation button
const RotationButton = ({ onClick }) => {
  return (
    <button id="unrotate" onClick={onClick}>
      rotate back
    </button>
  );
};

export { RotationButton };