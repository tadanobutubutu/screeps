import React from 'react';

const DataTable = () => {
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'age', label: 'Age' },
    { id: 'email', label: 'Email' }
  ];

  // Add a function to set the appropriate ARIA role and attributes for the table
  const getTableRoleAndAccessKey = (shouldUseAccessKey) => {
    // Use the access key attribute only if specified in the issue and if it's beneficial for accessibility
    const accessKeyAttribute = shouldUseAccessKey ? { 'accessKey': 't' } : {};

    return {
      role: 'grid',
      'aria-label': 'Data Table',
      ...accessKeyAttribute
    };
  };

  return (
    <table {...getTableRoleAndAccessKey(true)}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.id} scope="col" {...getTableRoleAndAccessKey(false)}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Alice</td>
          <td>25</td>
          <td>alice@example.com</td>
        </tr>
        <tr>
          <td>Bob</td>
          <td>30</td>
          <td>bob@example.com</td>
        </tr>
      </tbody>
    </table>
  );
};

export default DataTable;