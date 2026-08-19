import React from 'react';

const DataTable = ({ columns, data }) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index} scope="col">{col}</th>
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
              )
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;