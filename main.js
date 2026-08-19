// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code (preserved)
export function App() {
  return (
    <div>
      {/* Other existing components */}
    </div>
  );
}

// Updated layout components with accessible SVG names
export function Layout({ children }) {
  return (
    <div>
      <svg aria-hidden="true" style={{ display: 'none' }}>
        <title>Application Icon</title>
      </svg>
      {children}
    </div>
  );
}

export function DashboardLayout({ children }) {
  return (
    <div>
      <svg aria-hidden="true" style={{ display: 'none' }}>
        <title>Dashboard Icon</title>
      </svg>
      {children}
    </div>
  );
}

// New table component with proper scope attributes
export function DependencyTable() {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">File Path</th>
          <th scope="col">Dependencies</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">src/constants.js</th>
          <td>Various constants used throughout the application</td>
        </tr>
        <tr>
          <th scope="row">src/managers/roomManager.js</th>
          <td>Room management logic</td>
        </tr>
        <tr>
          <th scope="row">src/managers/spawnManager.js</th>
          <td>Spawn point management</td>
        </tr>
        <tr>
          <th scope="row">src/managers/towerManager.js</th>
          <td>Tower defense logic</td>
        </tr>
        <tr>
          <th scope="row">src/roles/builder.js</th>
          <td>Builder role implementation</td>
        </tr>
      </tbody>
    </table>
  );
}

// Existing initialization code (preserved)
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);