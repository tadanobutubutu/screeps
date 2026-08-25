// Example of a React component rendering a table with proper <th> scope attributes
import React from 'react';

const MyTableComponent = ({ headers, rows }) => {
  return (
    <main>
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col">
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
    </main>
  );
};

export default MyTableComponent;