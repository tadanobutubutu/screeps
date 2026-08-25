// main.js - Fixed REACT_027: Added scope attributes to all <th> elements

import React from 'react';

const TableComponent = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <th scope="row">{item.name}</th>
            <td>{item.email}</td>
            <td>{item.role}</td>
            <td>{item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;