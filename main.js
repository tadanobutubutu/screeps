import React from 'react';
import { useTable } from 'react-table';

const columns = [
  { Header: 'src/constants.js' },
  { Header: 'src/managers/roomManager.js' },
  { Header: 'src/managers/spawnManager.js' },
  { Header: 'src/managers/towerManager.js' },
  { Header: 'src/roles/builder.js' },
  // ... other columns (total 26 occurrences)
];

const table = useTable({ columns, data: [] });

function Main() {
  return (
    <table>
      <thead>
        <tr>
          {columns.map(column => (
            <th key={column.id} scope="col">{column.Header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map(row => (
          <tr>
            {row.map(cell => (
              <td key={cell.id}>{cell.render('Cell')}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Main;