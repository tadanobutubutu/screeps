// Original main.js content (hypothetical)
import React from 'react';
import Table from './Table'; // Assume Table is a component that needs updating

const Main = () => {
  return (
    <div>
      <Table />
    </div>
  );
};

export default Main;

// Updated main.js content with accessibility improvements
import React from 'react';
import Table from './Table'; // Assume Table is a component that needs updating

// New function to create a landmark for the table
const createTableLandmark = (id) => {
  return (
    <div id={id} role="region" aria-labelledby="tableLabel">
      <h2 id="tableLabel">Table</h2>
      <Table />
    </div>
  );
};

const Main = () => {
  return (
    <div>
      {createTableLandmark('table-landmark')}
    </div>
  );
};

export default Main;