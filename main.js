import React from 'react';

const App = () => {
  return (
    <div className="App">
      <header>
        <h1>Welcome to Screeps</h1>
      </header>
      
      {/* Favicon SVG - marked as decorative with aria-hidden */}
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" aria-hidden="true">
        <circle cx="16" cy="16" r="14" stroke="black" strokeWidth="2" fill="none"/>
      </svg>
    </div>
  );
};

export default App;