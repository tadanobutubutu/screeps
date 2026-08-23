import React from 'react';

const DataTable = () => {
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'age', label: 'Age' },
    { id: 'email', label: 'Email' }
  ];

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.id} ...
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Alice</td>
          <td>25</td>
          ...
        </tr>
        <tr>
          <td>Bob</td>
          <td>30</td>
          ...
        </tr>
      </tbody>
    </table>
  );
};

export default DataTable;