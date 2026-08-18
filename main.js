import React from 'react';

const TableComponent = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Role</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Alice</td>
          <td>Developer</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Bob</td>
          <td>Designer</td>
        </tr>
      </tbody>
    </table>
  );
};

// New function to handle dependency updates
const handleDependencyUpdates = (updates) => {
  console.log('Processing dependency updates:', updates);
  // Implementation would go here
  return updates.map(update => ({
    ...update,
    status: 'processed'
  }));
};

// New function to display dependency dashboard
const DependencyDashboard = ({ dependencies }) => {
  return (
    <div className="dependency-dashboard">
      <h2>Dependency Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Package</th>
            <th>Current Version</th>
            <th>Latest Version</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dependencies.map((dep, index) => (
            <tr key={index}>
              <td>{dep.package}</td>
              <td>{dep.currentVersion}</td>
              <td>{dep.latestVersion}</td>
              <td>{dep.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
export { handleDependencyUpdates, DependencyDashboard };