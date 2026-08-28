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
          ...
          width="1em"
          height="1em"
          viewBox="0 0 100 100"
          ...
        >
          <title>Screeps Dashboard</title>
          <text y=".9em" ...
        </svg>
        {/* ... Existing code ... */}
      </header>
      {/* ... Existing code ... */}
    </div>
  );
};

export const AppLayout = AppLayout;
export default AppLayout;