// main.js - Fixed version with scope attributes added to <th> elements

import React from 'react';

// Example: A table component with scope attributes fixed
const TableComponent = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Header 1</th>
          <th scope="col">Header 2</th>
          <th scope="col">Header 3</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <th scope="row">{row.label}</th>
            <td>{row.value1}</td>
            <td>{row.value2}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Example: Another table with scope attributes
const DataTable = ({ columns, rows }) => {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i} scope="col">{col.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <th scope="row">{rowIndex + 1}</th>
            {columns.map((col, colIndex) => (
              <td key={colIndex}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Example: Simple table with scope attributes
const SimpleTable = ({ headers, items }) => (
  <table>
    <thead>
      <tr>
        {headers.map((header, index) => (
          <th key={index} scope="col">{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {items.map((item, rowIndex) => (
        <tr key={rowIndex}>
          {item.map((cell, cellIndex) => (
            <td key={cellIndex}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export { TableComponent, DataTable, SimpleTable };