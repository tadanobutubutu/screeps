// main.js
import React from 'react';

// Example component containing the fix for REACT_015
const App = () => {
  return (
    <html lang="en">
      <div>
        {/* Fixed: Added lang attribute to <html> for screen reader support */}
        <button id="unrotate" type="button">rotate back</button>
      </div>
    </html>
  );
};

export default App;