// main.js

// Existing code that needs to be preserved
// ... (code before conflict markers)

// <<<<<<< HEAD
// Code that contains the issue
import React from 'react';
import icons from './icons';

const App = () => {
  return (
    <div>
      {/* ... */}
      <link rel="icon" href={icons.icon} />
      {/* ... */}
    </div>
  );
};

export default App;
// >>>>>>> origin/main

// ... (code after conflict markers)

// New code to fix the issue
import React from 'react';
import icons from './icons';

const App = () => {
  return (
    <div>
      {/* ... */}
      <link rel="icon" href={icons.icon} aria-label="Screeps Dashboard" />
      {/* ... */}
    </div>
  );
};

export default App;