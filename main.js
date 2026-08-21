// src/constants.js - Constants for the application
export const TABLE_HEADERS = ['Name', 'Type', 'Value', 'Status'];
export const TABLE_DATA = [
  { name: 'Item 1', type: 'A', value: 100, status: 'Active' },
  { name: 'Item 2', type: 'B', value: 200, status: 'Inactive' },
];

// main.js - Main application entry
import React from 'react';
import { render } from 'react-dom';

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
            <th scope="row">{row.name}</th>
            <td>{row.type}</td>
            <td>{row.value}</td>
            <td>{row.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function App() {
  return (
    <div>
      <h1>Data Overview</h1>
      <table>
        <thead>
          <tr>
            <th scope="col">Source</th>
            <th scope="col">Destination</th>
            <th scope="col">Priority</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">API</th>
            <td>Server 1</td>
            <td>High</td>
            <td>Execute</td>
          </tr>
        </tbody>
      </table>
      <DataTable headers={TABLE_HEADERS} data={TABLE_DATA} />
    </div>
  );
}

render(<App />, document.getElementById('root'));

export default App;