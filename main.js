// main.js
import React from 'react';

// Example component containing the fix for REACT_036
const App = () => {
  return (
    <div>
      {/* Fixed: Changed <a> to <button> for proper keyboard and screen reader support */}
      <button id="unrotate" type="button">rotate back</button>
    </div>
  );
};

export default App;