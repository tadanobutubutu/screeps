// Assume the Dashboard component is structured something like this:

// Dashboard.tsx
import React from 'react';

const Dashboard = ({ isLoading, error, successData }) => {
  if (isLoading) {
    // Render loading state
    return <div>Loading...</div>;
  }

  if (error) {
    // Render error state
    return <main>Error: {error.message}</main>;
  }

  if (successData) {
    // Render success state
    return (
      <main>
        {/* Render the content of the success state */}
      </main>
    );
  }

  // This should not be necessary, but it's here for completeness
  return null;
};

export default Dashboard;