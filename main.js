// Main.js - Fixed with scope attributes for accessibility (REACT_027)

import React from 'react';

const Table = ({ data, columns, caption }) => {
  return (
    <table>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index} scope="col">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col, colIndex) => (
              <td key={colIndex}>
                {colIndex === 0 ? (
                  <th scope="row">{row[col.key]}</th>
                ) : (
                  row[col.key]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;