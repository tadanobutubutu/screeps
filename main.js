import React from 'react';

const DataTable = () => {
  const columns = [
    { id: 'name', label: 'Name', accessibilityLabel: 'Name of the person' },
    { id: 'age', label: 'Age', accessibilityLabel: 'Age of the person' },
    { id: 'email', label: 'Email', accessibilityLabel: 'Email address of the person' }
  ];

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.id} scope="col" aria-label={col.accessibilityLabel}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td aria-label="Name of the person">Alice</td>
          <td aria-label="Age of the person">25</td>
          <td aria-label="Email address of the person">alice@example.com</td>
        </tr>
        <tr>
          <td aria-label="Name of the person">Bob</td>
          <td aria-label="Age of the person">30</td>
          <td aria-label="Email address of the person">bob@example.com</td>
        </tr>
      </tbody>
    </table>
  );
};

export default DataTable;