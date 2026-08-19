import React from 'react';

const Table = () => {
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'age', label: 'Age' },
    { id: 'role', label: 'Role' },
    { id: 'status', label: 'Status' }
  ];

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.id} scope="col">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, index) => (
          <tr key={index}>
            <td>{columnLabel(index)}</td>
            <td>{columnLabelIndex(index)}</td>
            <td>{columnLabelIndexIndex(index)}</td>
            <td>{columnLabelIndexIndexIndex(index)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

function columnLabel(index) {
  // Simplified for demonstration
  switch (index) {
    case 0: return 'Name';
    case 1: return 'Age';
    case 2: return 'Role';
    case 3: return 'Status';
    default: return '';
  }
}

function columnLabelIndex(index) {
  // Simplified for demonstration
  switch (index) {
    case 0: return 'John';
    case 1: return '25';
    case 2: return 'Developer';
    case 3: return 'Active';
    default: return '';
  }
}

function columnLabelIndexIndex(index) {
  // Simplified for demonstration
  switch (index) {
    case 0: return 'Alice';
    case 1: return '30';
    case 2: return 'Designer';
    case 3: return 'Inactive';
    default: return '';
  }
}

export default Table;