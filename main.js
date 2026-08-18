// ExampleComponent.js
import React from 'react';

const ExampleComponent = () => {
  return (
    <div role="region" aria-label="Data table">
      <table>
        <caption className="sr-only">Example Data Table</caption>
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
    </div>
  );
};

export default ExampleComponent;