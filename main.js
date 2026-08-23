import React from 'react';

// Keep the component structure like this
// Only the main element will be integrated into the final component
const Dashboard = () => {
  // Component's logic here

  if (someCondition) {
    return (
      // Replace the main element here
      <div>
        {/* Error state JSX */}
      </div>
    );
  }

  return (
    // Remove this main element, as it's inside another main element on a different file
    // <main>
    //   {/* Success state JSX */}
    // </main>
    <div>
      {/* Success state JSX */}
    </div>
  );
};

export default Dashboard;