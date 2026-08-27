// main.js
import React from 'react';

// Original code with conflict markers
<<<<<<< HEAD
function rotateBack() {
  // ... existing code ...
}
function App() {
  return (
    <div>
      {/* ... other JSX ... */}
      <a id="unrotate" href="#" onClick={rotateBack}>rotate back</a>
      {/* ... other JSX ... */}
    </div>
  );
}

export default App;
=======

function rotateBack() {
  // ... existing code ...
}
function App() {
  return (
    <div>
      {/* ... other JSX ... */}
      <button id="unrotate" onClick={rotateBack}>rotate back</button>
      {/* ... other JSX ... */}
    </div>
  );
}

export default App;
>>>>>>> origin/main