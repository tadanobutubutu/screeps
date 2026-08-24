import React from 'react';

const Table = ({ columns, data }) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} scope="col">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <th scope="row">{row.name}</th>
            {columns.slice(1).map((column, colIndex) => (
              <td key={colIndex}>{row[column.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Combine both components into a single DependencyGraph component
const DependencyGraph = () => {
  const columns = [
    { header: 'src/constants.js', key: 'constants' },
    { header: 'src/managers/roomManager.js', key: 'roomManager' },
    { header: 'src/managers/spawnManager.js', key: 'spawnManager' },
    { header: 'src/managers/towerManager.js', key: 'towerManager' },
    { header: 'src/roles/builder.js', key: 'builder' },
  ];

  const data = [
    // Original table rows would be added here
    // Example placeholder row:
    // { name: 'SampleRow', constants: true, roomManager: true, spawnManager: false, towerManager: true, builder: true }
  ];

  // Maintain original content and structure
  return (
    <div>
      {/* ... other content ... */}
      <Table columns={columns} data={data} />
      {/* ... other content ... */}
    </div>
  );
};

export default DependencyGraph;
export { Table };