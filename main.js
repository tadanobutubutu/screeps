import React from 'react';

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

// Note: The actual fix for the REACT_036 issue would be to replace:
// <a id="unrotate" href="#">rotate back</a>
// with:
// <button id="unrotate">rotate back</button>
// in the dependency-graph.html file