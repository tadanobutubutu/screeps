// main.js - React component with rotate functionality and table with accessibility

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// Sample component that demonstrates the fix for REACT_036
function App() {
  const [isRotated, setIsRotated] = useState(false);

  const handleRotate = () => {
    setIsRotated(true);
  };

  const handleRotateBack = () => {
    setIsRotated(false);
  };

  return (
    <div>
      <div
        id="image-container"
        style={{
          transform: isRotated ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }}
      >
        <img src="/sample-image.png" alt="Sample" />
      </div>

      {/* Fixed: Changed from <a href="#"> to <button> for accessibility */}
      <button id="unrotate" onClick={handleRotateBack}>
        rotate back
      </button>

      <button id="rotate" onClick={handleRotate}>
        rotate
      </button>
    </div>
  );
}

// Main functional component with internationalization
const Main = ({ data }) => {
  // Address critical issue: React Language Attribute
  // Wrap all child nodes in a top-level Lang tag
  return (
    <div lang="en">
      <header>
        {/* Header content */}
      </header>
      <main>
        {/* Primary content */}
        {/* Wrap the existing table in a more accessible Table structure */}
        <Table data={data}>
          {/* Address warning issue: React Fake Link */}
          {/* Use Link component from next/link or react-router-dom instead of regular a tags for navigation */}
        </Table>
      </main>
      <footer>
        {/* Footer content */}
      </footer>
      {/* Rest of the code as before */}
    </div>
  );
};

// Table component with proper role, headers, and accessibility properties
const Table = ({ data }) => {
  return (
    <table role="grid" aria-label="My Table">
      {/* Address warning issue: React Table Structure */}
      {/* Ensure the table headers have associated scope attributes */}
      <thead>
        <tr>
          <th scope="col"><div>src/constants.js</div></th>
          <th scope="col"><div>src/managers/roomManager.js</div></th>
          <th scope="col"><div>src/managers/spawnManager.js</div></th>
          {/* ... other <th> elements ... */}
        </tr>
      </thead>
      <tbody>
        {/* ... add tbody and tr/td structure depending on data structure ... */}
      </tbody>
      {/* ... adjust row and cell structure to add scope="col" to headers ... */}
    </table>
  );
};

// Prop types for the Main and Table components
Main.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({ /* data structure */ })).isRequired,
};

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({ /* data structure */ })).isRequired,
};

export { App, Table };
export default Main;