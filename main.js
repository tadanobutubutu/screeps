// main.js
import React from 'react';
import ReactDOM from 'react-dom';

const TableComponent = () => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th scope="col"><div>src/constants.js</div></th>
            <th scope="col"><div>src/managers/roomManager.js</div></th>
            <th scope="col"><div>src/managers/spawnManager.js</div></th>
            <th scope="col"><div>src/managers/towerManager.js</div></th>
            <th scope="col"><div>src/roles/builder.js</div></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><div>Row 1 Col 1</div></td>
            <td><div>Row 1 Col 2</div></td>
            <td><div>Row 1 Col 3</div></td>
            <td><div>Row 1 Col 4</div></td>
            <td><div>Row 1 Col 5</div></td>
          </tr>
          <tr>
            <td><div>Row 2 Col 1</div></td>
            <td><div>Row 2 Col 2</div></td>
            <td><div>Row 2 Col 3</div></td>
            <td><div>Row 2 Col 4</div></td>
            <td><div>Row 2 Col 5</div></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;