import React from 'react';

function MyTableComponent() {
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
        <tr>
          <td>Data 1</td>
          <td>Data 2</td>
        </tr>
        <!-- More rows -->
      </tbody>
    </table>
  );
}

export default MyTableComponent;