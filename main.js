// Main.js - React Table Component with Accessibility Fixes (REACT_027)

import React from 'react';

// Sample data for demonstration
const tableData = {
  headers: ['Name', 'Email', 'Role', 'Status'],
  rows: [
    ['John Doe', 'john@example.com', 'Developer', 'Active'],
    ['Jane Smith', 'jane@example.com', 'Designer', 'Active'],
    ['Bob Johnson', 'bob@example.com', 'Manager', 'Inactive'],
  ]
};

// Fixed table component with proper scope attributes
const DataTable = ({ data }) => {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {data.headers.map((header, index) => (
            // Added scope="col" to all column headers
            <th key={index} scope="col">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              // First cell in each row gets scope="row"
              cellIndex === 0 ? (
                <td key={cellIndex} scope="row">{cell}</td>
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

// Example with nested headers
const ComplexTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th rowSpan={2} scope="col">Category</th>
          <th colSpan={2} scope="col">Details</th>
        </tr>
        <tr>
          <th scope="col">Subcategory A</th>
          <th scope="col">Subcategory B</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td scope="row">Technology</td>
          <td>Software</td>
          <td>Hardware</td>
        </tr>
      </tbody>
    </table>
  );
};

// Utility function to generate accessible table headers
const generateTableHeaders = (headers) => {
  return headers.map((header, index) => (
    <th key={`header-${index}`} scope="col">
      {header}
    </th>
  ));
};

// Utility function to generate accessible table rows
const generateTableRows = (rows) => {
  return rows.map((row, rowIndex) => (
    <tr key={`row-${rowIndex}`}>
      {row.map((cell, cellIndex) => (
        <td key={`cell-${rowIndex}-${cellIndex}`} 
            scope={cellIndex === 0 ? "row" : undefined}>
          {cell}
        </td>
      ))}
    </tr>
  ));
};

// Reusable Accessible Table Component
const AccessibleTable = ({ title, headers, rows }) => {
  return (
    <div className="table-container">
      {title && <caption>{title}</caption>}
      <table>
        <thead>
          <tr>
            {generateTableHeaders(headers)}
          </tr>
        </thead>
        <tbody>
          {generateTableRows(rows)}
        </tbody>
      </table>
    </div>
  );
};

// Export all components and utilities
export {
  DataTable,
  ComplexTable,
  AccessibleTable,
  generateTableHeaders,
  generateTableRows,
  tableData
};

export default DataTable;