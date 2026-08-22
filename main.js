tsx
// Import required components and dependencies
import React from 'react';
// ...

const Dashboard = () => {
  // Define state, functions, and variables as before...

  if (isError) {
    // Error state component, consolidate with success state for a single <main>
    return (
      <main>
        <h1>Error occurred</h1>
        {/* rest of the error state component */}
      </main>
    );
  }

  return (
    <main>
      {/* Success state component structure */}
    </main>
  );
};

export default Dashboard;