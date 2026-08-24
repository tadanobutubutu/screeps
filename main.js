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
  // Maintain original content and structure
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
          {/* ... original table rows ... */}
          {/* Add new table rows if present in the conflicting code */}
          // ...
        </tbody>
      </table>
      {/* ... other content ... */}
    </div>
  );
};

export default DependencyGraph;
export { Table };
```

This solution assumes that the conflicting code contains new table rows that need to be added to the `DependencyGraph` component. You should review the conflicting code and make any necessary adjustments to the script as needed.