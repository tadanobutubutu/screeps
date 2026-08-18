import React from 'react';

const DependencyGraph = () => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th scope="col">File</th>
            <th scope="col">Dependencies</th>
            <th scope="col">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>src/constants.js</td>
            <td>None</td>
            <td>Configuration</td>
          </tr>
          <tr>
            <td>src/managers/roomManager.js</td>
            <td>src/constants.js</td>
            <td>Manager</td>
          </tr>
          <tr>
            <td>src/managers/spawnManager.js</td>
            <td>src/constants.js, src/managers/roomManager.js</td>
            <td>Manager</td>
          </tr>
          <tr>
            <td>src/managers/towerManager.js</td>
            <td>src/constants.js, src/managers/roomManager.js</td>
            <td>Manager</td>
          </tr>
          <tr>
            <td>src/roles/builder.js</td>
            <td>src/constants.js, src/managers/roomManager.js</td>
            <td>Role</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const Favicon: React.FC = () => {
  return (
    <link rel="icon" href="/path/to/favicon.svg" />
  );
};

const AppLayout: React.FC = () => {
  return (
    <header>
      <h1>Welcome to the App</h1>
      {/* Add aria-label to the SVG element */}
      <AccessibleSvg ariaLabel="App logo">
        {/* ... your SVG content ... */}
      </AccessibleSvg>
    </header>
  );
};

function wrapPrimaryContentWithMain() {
  const primaryContent = document.getElementById('primary-content');
  if (primaryContent) {
    const mainElement = document.createElement('main');
    mainElement.appendChild(primaryContent);
    primaryContent.parentNode.replaceChild(mainElement, primaryContent);
  }
}

// Call the function to wrap the primary content with <main>
wrapPrimaryContentWithMain();

const RotateBackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button id="unrotate" onClick={onClick}>
      rotate back
    </button>
  );
};

export default AppLayout;
export { DependencyGraph, RotateBackButton };