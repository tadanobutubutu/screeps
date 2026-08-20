import React from 'react';

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
          <td>Alice Johnson</td>
          <td>Developer</td>
          <td>Active</td>
        </tr>
        <tr>
          <td>Bob Smith</td>
          <td>Designer</td>
          <td>Inactive</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TableComponent;