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

const DependencyGraph = () => {
  return (
    <div>
      {/* ... other content ... */}
      <table>
        <thead>
          <tr>
            {/* ... other header cells ... */}
            <th scope="col"><div>src/constants.js</div></th>
            <th scope="col"><div>src/managers/roomManager.js</div></th>
            <th scope="col"><div>src/managers/spawnManager.js</div></th>
            <th scope="col"><div>src/managers/towerManager.js</div></th>
            <th scope="col"><div>src/roles/builder.js</div></th>
            {/* ... other header cells ... */}
          </tr>
        </thead>
        <tbody>
          {/* ... other table rows ... */}
        </tbody>
      </table>
      {/* ... other content ... */}
    </div>
  );
};

export default DependencyGraph;
export { Table };