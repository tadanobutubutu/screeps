import React from 'react';

// Main application component
const App = () => {
  return (
    <div>
      {/* Layout with accessible SVG favicon */}
      <div className="layout">
        <svg 
          src="/favicon.svg" 
          aria-hidden="true" 
          role="img"
        />
      </div>
    </div>
  );
};

export default App;