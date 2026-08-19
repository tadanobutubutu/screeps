import React from 'react';

// Dependency Graph component displaying file dependencies
const DependencyGraph = () => {
  // Sample headers for the dependency graph
  const headers = ['src/constants.js', 'src/managers/roomManager.js', 'src/managers/spawnManager.js', 'src/managers/towerManager.js', 'src/roles/builder.js'];

  // Sample data rows for the dependency graph
  const rows = [
    ['file1.js', 'file2.js', 'file3.js', 'file4.js', 'file5.js'],
    ['file6.js', 'file7.js', 'file8.js', 'file9.js', 'file10.js'],
    ['file11.js', 'file12.js', 'file13.js', 'file14.js', 'file15.js'],
    ['file16.js', 'file17.js', 'file18.js', 'file19.js', 'file20.js'],
    ['file21.js', 'file22.js', 'file23.js', 'file24.js', 'file25.js'],
    ['file26.js', 'file27.js', 'file28.js', 'file29.js', 'file30.js']
  ];

  const someFunction = () => {
    console.log('This is a valid JavaScript function');
  };

  module.exports = {
    DependencyGraph,
    someFunction
  };

ReactDOM.render(<DependencyGraph />, document.getElementById('root'));