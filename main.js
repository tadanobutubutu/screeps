import React from 'react';

const headerItems = [
  'src/constants.js',
  'src/managers/roomManager.js',
  'src/managers/spawnManager.js',
  'src/managers/towerManager.js',
  'src/roles/builder.js',
  // 21 more header items follow the same pattern
];

export default function Main() {
  return (
    <table>
      <thead>
        <tr>
          {headerItems.map((item) => (
            <th key={item} scope="col">
              <div>{item}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* rows */}
      </tbody>
    </table>
  );
}