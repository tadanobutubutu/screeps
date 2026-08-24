tsx
import React from 'react';

// ... Other imports and component structure ...

// Move the main element outside the conditionals to have a single top-level main
const Dashboard = () => {
  // ... Conditional logic for error and success states ...

  return (
    <div>
      <main>
        {/* Render portion of actual Dashboard content here */}
      </main>
      {errorMessage && <div>{errorMessage}</div>}
      {successMessage && <div>{successMessage}</div>}
    </div>
  );
};

export default Dashboard;