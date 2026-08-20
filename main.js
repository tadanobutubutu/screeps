import React from 'react';
import './main.css';

function TableComponent() {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Col 1</th>
          <th scope="col">Col 2</th>
          <th scope="col">Col 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Row 1</td>
          <td>Row 2</td>
          <td>Row 3</td>
        </tr>
      </tbody>
    </table>
  );
}

export default TableComponent;