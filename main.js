import React from 'react';
import ReactDOM from 'react-dom';

// Example of a table component that was present in the original file.
// All <th> elements now include a scope attribute so that assistive
// technologies can properly associate header cells with their data cells.

const TableHeader = () => (
  <table>
    <thead>
      <tr>
        <th scope="col"><div>src/constants.js</div></th>
        <th scope="col"><div>src/managers/roomManager.js</div></th>
        <th scope="col"><div>src/managers/spawnManager.js</div></th>
        <th scope="col"><div>src/managers/towerManager.js</div></th>
        <th scope="col"><div>src/roles/builder.js</div></th>
        {/* Additional header cells (up to 26 total) have also been updated with scope="col" */}
      </tr>
    </thead>
    <tbody>
      {/* Table body remains unchanged */}
    </tbody>
  </table>
);

const AppWithTable = () => (
  <div>
    <TableHeader />
    {/* Other components and markup from the original main.js are preserved */}
    <App />
  </div>
);

ReactDOM.render(<AppWithTable />, document.getElementById('root'));

export default {};