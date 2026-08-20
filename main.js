import React from 'react';

/*
  // New changes to fix the REACT_041 issue
  // Add the aria-label attribute to the <svg> elements in the affected files
  // Example of how to fix the issue in a single file
  // Replace the following line:
  // <svg>...</svg>
  // With:
  // <svg aria-label="Accessible description of the SVG content">...</svg>
  // Repeat the above change for all occurrences in the affected files, such as:
*/

const DataTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Role</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Alice</td>
          <td>Developer</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Bob</td>
          <td>Designer</td>
        </tr>
      </tbody>
    </table>
  );
};

export default DataTable;