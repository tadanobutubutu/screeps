// Example of a table component in main.js
import React from 'react';

const MyTableComponent = () => {
  // Hypothetical data and columns for the table
  const columns = [
    { header: 'Source', accessor: 'source' },
    { header: 'Room', accessor: 'room' },
    // ... other columns
  ];

  const rows = [
    { source: 'Source1', room: 'N12S1' },
    { source: 'Source2', room: 'N12S2' },
    // ... other rows
  ];

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th scope="col" key={index}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, index) => (
              <td key={index}>{row[column.accessor]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MyTableComponent;