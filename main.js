import React from 'react';
import DependencyGraph from './docs/dependency-graph.html';

const App = () => {
  const handleRotateBack = () => {
    // Add your rotation logic here
    console.log('Rotating back');
  };

  return (
    <html lang="en">
      <head>
        ...
      </head>
      <body>
        <DependencyGraph />
        <button id="unrotate" onClick={handleRotateBack}>rotate back</button>
      </body>
    </html>
  );
};

export default App;