import React from 'react';

const TableHeader = ({ children }) => {
  return (
    <th scope="col">
      {children}
    </th>
  );
};

const MyTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <TableHeader>src/constants.js</TableHeader>
          <TableHeader>src/managers/roomManager.js</TableHeader>
          <TableHeader>src/managers/spawnManager.js</TableHeader>
          <TableHeader>src/managers/towerManager.js</TableHeader>
          {/* ... other headers ... */}
        </tr>
      </thead>
      <tbody>
        {/* ... table rows ... */}
      </tbody>
    </table>
  );
};

export default MyTable;