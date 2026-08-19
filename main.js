// Original main.js content (with conflict markers omitted for brevity)
// ...

// Changes to fix the REACT_027 issue
import React from 'react';

const TableComponent = ({ headers, rows }) => {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th scope="col" key={index}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;

// ...