tsx
import React from "react";
// ... Existing imports ...

const AppLayout: React.FC = () => {
  // ... Existing code ...

  return (
    <div className="App">
      <header className="App-header">
        <svg
          aria-hidden="true"
          className="App-favicon"
          width="1em"
          height="1em"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Screeps Dashboard</title>
          <text y=".9em" font-size="90">🐛</text>
        </svg>
        {/* ... Existing code ... */}
      </header>
      {/* ... Existing code ... */}
    </div>
  );
};

export default AppLayout;