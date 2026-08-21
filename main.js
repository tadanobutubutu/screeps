// Existing main.js content before the conflict markers

// ... existing code ...

// Refactored Dashboard.tsx to ensure only one <main> element
import React from 'react';

const Dashboard = () => {
  // ... existing state and props handling ...

  // Refactor to return a single <main> element
  return (
    <div>
      {error ? (
        // Error state
        <main>
          {/* Error content */}
        </main>
      ) : success ? (
        // Success state
        <main>
          {/* Success content */}
        </main>
      ) : (
        // Default state
        <main>
          {/* Default content */}
        </main>
      )}
    </div>
  );
};

export default Dashboard;

// ... existing code ...

// Existing main.js content after the conflict markers