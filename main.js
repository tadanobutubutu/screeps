// Example of how to update your main.js to include the scope attribute
import React from 'react';
import ReactDOM from 'react-dom';

// Placeholder for your table component
const MyTable = () => {
  // Placeholder for your table headers
  const headers = ['Header 1', 'Header 2', 'Header 3'];

  // Placeholder for your table rows and data
  const rows = [
    { col1: 'Data 1-1', col2: 'Data 1-2', col3: 'Data 1-3' },
    { col1: 'Data 2-1', col2: 'Data 2-2', col3: 'Data 2-3' },
    // ... more rows
  ];

  return (
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
            {Object.keys(row).map((col, colIndex) => (
              <td key={colIndex}>{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

ReactDOM.render(<MyTable />, document.getElementById('root'));