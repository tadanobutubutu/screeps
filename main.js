// main.js
import React from 'react';

// Existing component (example - would be replaced with actual content)
function ExistingComponent() {
  return (
    <div className="app">
      <h1>Accessible Table Example</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Occupation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>John Doe</th>
            <td>32</td>
            <td>Developer</td>
          </tr>
          <tr>
            <th>Jane Smith</th>
            <td>28</td>
            <td>Designer</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// New component with proper scope attributes
function AccessibleTable() {
  return (
    <div className="app">
      <h1>Accessible Table Example</h1>
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Age</th>
            <th scope="col">Occupation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">John Doe</th>
            <td>32</td>
            <td>Developer</td>
          </tr>
          <tr>
            <th scope="row">Jane Smith</th>
            <td>28</td>
            <td>Designer</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Export all existing components
export { ExistingComponent, AccessibleTable };

// Default export (example)
export default function App() {
  return (
    <div>
      <ExistingComponent />
      <AccessibleTable />
    </div>
  );
}