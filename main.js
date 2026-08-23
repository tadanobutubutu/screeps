// main.js

// Existing code that needs to be preserved
// ... (code before conflict markers)

// <<<<<<< HEAD
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

// New code to fix the issue
// Adding a <main> tag around the primary content of the App component
import React from 'react';
import icons from './icons';

const App = () => {
  return (
    <main>
      <div>
        {/* ... */}
        <link rel="icon" href={icons.icon} aria-label="Screeps Dashboard" />
        {/* ... */}
      </div>
    </main>
  );
};

export default App;
// ... (code after conflict markers)