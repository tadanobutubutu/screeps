// main.js
import React from 'react';

// Updated Header component to include scope attribute for accessibility
const Header = ({ column }) => (
  <th scope="col">
    <div>{column.columnDef.header}</div>
  </th>
);

// Example usage in a table component
const TableComponent = () => {
  const columns = [
    {
      Header: 'Constants',
      accessor: 'constants',
    },
    {
      Header: 'Room Manager',
      accessor: 'roomManager',
    },
    {
      Header: 'Spawn Manager',
      accessor: 'spawnManager',
    },
    {
      Header: 'Tower Manager',
      accessor: 'towerManager',
    },
    {
      Header: 'Builder Role',
      accessor: 'builderRole',
    },
    // ... other column definitions ...
  ];

  return (
    <table className="react-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <Header column={col} key={col.accessor} />
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Table body content */}
      </tbody>
    </table>
  );
};

// Existing exports must remain unchanged
export default TableComponent;
export { Header };