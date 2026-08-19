import React from 'react';

// Main application component with table structure
function App() {
  return (
    <div className="App">
      <h1>React Table Structure Example</h1>
      <table>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Alice</td>
            <td>Developer</td>
            <td>Active</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Bob</td>
            <td>Designer</td>
            <td>Inactive</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Charlie</td>
            <td>Manager</td>
            <td>Active</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;