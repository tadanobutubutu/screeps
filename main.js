// main.js - React Table Component with accessibility fixes (REACT_027)
import React, { useMemo } from 'react';

export function App() {
  return (
    <div>
      {/* Existing content */}
      <p lang="en">This is an English paragraph.</p>
      {/* More content */}
    </div>
  );
}

export const DataTable = ({ columns, data, caption }) => {
  return (
    <table>
      {caption && <caption>{caption}</caption>}
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
              <td key={colIndex}>{column.accessor(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const InventoryTable = ({ items }) => {
  return (
    <table className="inventory-table">
      <thead>
        <tr>
          <th scope="col">Item Name</th>
          <th scope="col">Quantity</th>
          <th scope="col">Price</th>
          <th scope="col">Category</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr>
            <td>{item.name}</td>
            <td>{item.quantity}</td>
            <td>${item.price}</td>
            <td>{item.category}</td>
            <td>{item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const UserTable = ({ users }) => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
          <th scope="col">Last Login</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.lastLogin}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const SimpleTable = ({ headers, rows }) => {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th key={i} scope="col">
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

export default DataTable;