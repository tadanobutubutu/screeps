import React from 'react';

// Hypothetical table component with <th> elements lacking scope attribute
const MyTable = () => {
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
        {/* Table rows with data cells */}
      </tbody>
    </table>
  );
};

export default MyTable;

// Additional table component for dependency graph
const DependencyGraphTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Source File</th>
          <th scope="col">Target File</th>
          <th scope="col">Dependency Type</th>
        </tr>
      </thead>
      <tbody>
        {/* Table rows with dependency data */}
      </tbody>
    </table>
  );
};

export { DependencyGraphTable };