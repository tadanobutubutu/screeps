// main.js

// Assuming that the table structure is defined in a React component
import React from 'react';

// ... other imports ...

// Component that renders the table
const DependencyGraphTable = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          {data.columns.map((column, index) => (
            <th scope="col" key={index}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.cells.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell.content}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// ... rest of the code ...

export default DependencyGraphTable;