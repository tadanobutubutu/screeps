import React from 'react';

const TableComponent = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Age</th>
          <th scope="col">Role</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Alice</td>
          <td>30</td>
          <td>Developer</td>
        </tr>
        <tr>
          <td>Bob</td>
          <td>25</td>
          <td>Designer</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TableComponent;