// main.js
import React from 'react';

/**
 * Component for rotating the dependency graph
 */
const DependencyGraphRotator = () => {
  const handleRotateBack = () => {
    // Implement your rotation logic here
    console.log('Rotating back to original position');
  };

  return (
    <button id="unrotate" onClick={handleRotateBack}>
      rotate back
    </button>
  );
};

const Table = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
          <th scope="col">Status</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>{item.role}</td>
            <td>{item.status}</td>
            <td>{item.actions}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Preserve all existing exports
export const existingFunction1 = () => {
  // existing implementation
};

export const existingFunction2 = () => {
  // existing implementation
};

// Add any new exports as needed
export { DependencyGraphRotator, Table };

export default Table;