import React from 'react';

const Dashboard = ({ error, loading, success, children }) => {
  if (loading) {
    // Handle loading state
    return <div>Loading...</div>;
  }

  if (error) {
    // Handle error state
    return <div>Error: {error.message}</div>;
  }

  if (success) {
    // Handle success state
    return (
      <main>
        {/* Success content goes here */}
        {children}
      </main>
    );
  }

  // Default case (shouldn't happen, but good for completeness)
  return null;
};

export default Dashboard;