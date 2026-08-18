// ExampleComponent.js
import React from 'react';

const ExampleComponent = () => {
  return (
    <div role="region" aria-label="Example table">
      <table>
        <caption>Example Table</caption>
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