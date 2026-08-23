// main.js
import React from 'react';

const TableComponent = () => {
  const handleRotateBack = () => {
    // Handle rotate back action
    console.log('Rotate back clicked');
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
          <th>Column 3</th>
          <th>Column 4</th>
          <th>Column 5</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Row 1 Col 1</td>
          <td>Row 1 Col 2</td>
          <td>Row 1 Col 3</td>
          <td>Row 1 Col 4</td>
          <td>Row 1 Col 5</td>
          <td>
            <button id="unrotate" type="button" onClick={handleRotateBack}>
              rotate back
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TableComponent;