// main.js
import React from 'react';

const TableComponent = () => {
  return (
    <main>
      <table id="table-rotated">
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
            <td>Row 1 Col 1</td>
            <td>Row 1 Col 2</td>
            <td>Row 1 Col 3</td>
            <td>Row 1 Col 4</td>
            <td>Row 1 Col 5</td>
          </tr>
        </tbody>
      </table>
    </main>
  );
};

export default TableComponent;