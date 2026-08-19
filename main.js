import React from 'react';

/**
 * Table Component with proper scope attributes for accessibility
 * Fixes REACT_027: Adds scope="col" to all <th> elements
 */
const TableComponent = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Role</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Alice</td>
          <td>Developer</td>
          <td>Active</td>
        </tr>
        <tr>
          <td>Bob</td>
          <td>Designer</td>
          <td>Active</td>
        </tr>
        <tr>
          <td>Charlie</td>
          <td>Tester</td>
          <td>Inactive</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TableComponent;