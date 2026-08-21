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
  ];

  // Initialize the React Table hook
  const {
    getHeaderGroups,
    getRowProps,
    columns: allColumns,
    // other table utilities...
  } = useTable({ columns });

  return (
    <table>
      <caption className="sr-only">Source code file overview table</caption>
      <thead>
        {getHeaderGroups().map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} scope="col">
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {allColumns.map(row => (
          <tr {...row.getRowProps()}>
            {row.cells.map((cell, idx) => (
              <td
                {...cell.getCellProps()}
                scope={idx === 0 ? 'row' : undefined}
                role={idx === 0 ? 'rowheader' : undefined}
              >
                {cell.render('Cell')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Replace the non-interactive link with a button
export function RotateBackButton() {
  return (
    <button id="unrotate" aria-label="Rotate view back to original position" type="button">
      rotate back
    </button>
  );
}