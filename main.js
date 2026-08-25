import React from 'react';

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
          <td>Admin</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Bob</td>
          <td>User</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;