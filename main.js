// Hypothetical main.js that renders a table or is part of the component rendering the table

import React from 'react';
import ReactDOM from 'react-dom';
import TableComponent from './TableComponent'; // Assuming TableComponent is the component that renders the table

ReactDOM.render(
  <React.StrictMode>
    <TableComponent />
  </React.StrictMode>,
  document.getElementById('root')
);

// Example of TableComponent that might need the fix
class TableComponent extends React.Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th scope="col">Column 1</th>
            <th scope="col">Column 2</th>
            <th scope="row">Row Header</th>
          </tr>
        </thead>
        <tbody>
          {/* Table rows go here */}
        </tbody>
      </table>
    );
  }
}