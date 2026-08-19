import React from 'react';

// Accessible table component with proper structure and ARIA attributes
const MyTable = () => {
  return (
    <table role="grid" aria-label="Example table">
      <thead>
        <tr role="row">
          <th scope="col" role="columnheader">Column 1</th>
          <th scope="col" role="columnheader">Column 2</th>
          <th scope="col" role="columnheader">Column 3</th>
        </tr>
      </thead>
      <tbody>
        <tr role="row">
          <td role="gridcell">Data 1</td>
          <td role="gridcell">Data 2</td>
          <td role="gridcell">Data 3</td>
        </tr>
        <tr role="row">
          <td role="gridcell">Data 4</td>
          <td role="gridcell">Data 5</td>
          <td role="gridcell">Data 6</td>
        </tr>
      </tbody>
    </table>
  );
};

export default MyTable;