import React from 'react';

// Table component with proper scope attributes for column headers
const Table = ({ columns }) => {
  const headerRow = Array.from({ length: columns.length }, (_, i) => 
    <th key={i} scope="col"><span>{columns[i]}</span></th>
  );

  return (
    <table>
      {headerRow}
      {/* Data rows would be rendered here */}
    </table>
  );
};

// Main application component
const App = () => {
  const columns = ['Name', 'Age', 'Role'];
  
  return (
    <div>
      <h1>Sample Table</h1>
      <Table columns={columns} />
    </div>
  );
};

export default App;