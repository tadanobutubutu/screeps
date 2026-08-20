// main.js - React Table Component with proper accessibility

import React from 'react';

/**
 * Table component with proper scope attributes for accessibility
 * Addresses REACT_027: React Table Structure
 */
const Table = ({ columns, data }) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} scope="col">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, colIndex) => (
              <td key={colIndex}>{row[column.accessor]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/**
 * Complex table component for nested headers
 */
const ComplexTable = ({ headers, data }) => {
  const renderHeaderCells = (headerList, scopePrefix = 'col') => {
    return headerList.map((header, index) => {
      if (header.columns) {
        return (
          <th key={index} scope="colgroup" colSpan={header.columns.length}>
            {header.label}
          </th>
        );
      }
      return (
        <th key={index} scope="col">
          {header.label}
        </th>
      );
    });
  };

  return (
    <table>
      <thead>
        <tr>{renderHeaderCells(headers)}</tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header, colIndex) => (
              <td key={colIndex}>{row[header.accessor]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/**
 * Editable table with scope attributes
 */
const EditableTable = ({ columns, rows, onUpdate }) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.id} scope="col">
              {col.label}
            </th>
          ))}
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {columns.map((col) => (
              <td key={col.id}>{row[col.id]}</td>
            ))}
            <td>
              <button onClick={() => onUpdate(row.id)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { Table, ComplexTable, EditableTable };
export default Table;