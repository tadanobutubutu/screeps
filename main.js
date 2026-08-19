import React from 'react';

/**
 * Sample table component demonstrating proper use of scope attributes
 * Fixes REACT_027: <th> has no scope
 */
const Table = () => {
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
        <tr>
          <td>3</td>
          <td>Charlie</td>
          <td>Manager</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;