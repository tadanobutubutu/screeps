import React from 'react';
import { useTable } from 'react-table';

// Main component
export default function Main() {
  // Define the columns for the table (26 columns total)
  const columns = [
    { Header: 'src/constants.js' },
    { Header: 'src/managers/roomManager.js' },
    { Header: 'src/managers/spawnManager.js' },
    { Header: 'src/managers/towerManager.js' },
    { Header: 'src/roles/builder.js' },
    // ... (additional columns up to 26 total)
    { Header: 'src/other1.js' },
    { Header: 'src/other2.js' },
    // Add remaining columns as needed to reach 26
  ];

  // Initialize the React Table hook
  const {
    getHeaderGroups,
    getRowProps,
    columns: allColumns,
    // other table utilities...
  } = useTable({ columns });

  return (
    <main>
      <table>
        <thead>
          {getHeaderGroups().map(group => (
            <tr {...group.getRowProps()}>
              {group.headers.map(column => (
                <th key={column.id} scope="col">
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {allColumns.map(row => (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td key={cell.id}>{cell.render('Cell')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}