import React from 'react';

export const Table = () => {
  return (
    <table className="react-table">
      <thead>
        <tr>
          <th scope="col"><div>src/constants.js</div></th>
          <th scope="col"><div>src/managers/roomManager.js</div></th>
          <th scope="col"><div>src/managers/spawnManager.js</div></th>
          <th scope="col"><div>src/managers/towerManager.js</div></th>
          <th scope="col"><div>src/roles/builder.js</div></th>
          {/* additional headers ... */}
        </tr>
      </thead>
      <tbody>
        {/* table body content remains unchanged */}
      </tbody>
    </table>
  );
};

export default Table;