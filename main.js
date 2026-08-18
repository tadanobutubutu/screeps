import React from 'react';

const TableComponent = () => {
  return (
    <main>
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
    </main>
  );
};

export default TableComponent;