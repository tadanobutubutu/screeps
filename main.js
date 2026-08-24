// main.js

// React component for rendering the dependency graph table with proper accessibility
import React from 'react';

const DependencyGraphTable = ({ rows }) => {
  return (
    <main>
      <table aria-describedby="dependency-graph-caption">
        <caption id="dependency-graph-caption">
          Dependency Graph showing module relationships and versions
        </caption>
        <thead>
          <tr>
            <th scope="col">Module Name</th>
            <th scope="col">Version</th>
            <th scope="col">Dependencies</th>
            <th scope="col">Dependents</th>
            <th scope="col">Status</th>
            {/* Add the rest of the column headers with scope="col" */}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <th scope="row">{row.name}</th>
              <td>{row.version}</td>
              <td>{row.dependencies}</td>
              <td>{row.dependents}</td>
              <td>{row.status}</td>
              {/* Add data cells */}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

// Additional code and exports
// ...

export { DependencyGraphTable };