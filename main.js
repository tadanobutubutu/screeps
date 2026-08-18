// Example React table component with proper scope attributes
// This is a template showing how to fix the REACT_027 issue

import React from 'react';

function DataTable({ headers, data }) {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              cellIndex === 0 ? (
                <th key={cellIndex} scope="row">{cell}</th>
              ) : (
                <td key={cellIndex}>{cell}</td>
              )}
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;