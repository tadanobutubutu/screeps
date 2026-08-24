// Before:
// <main>Content for error state</main>
// <main>Content for success state</main>

// After:
import React from 'react';

const Dashboard = ({ error, success }) => {
  return (
    <div>
      {/* Other components or content */}
      <main>
        {error ? (
          // Render error content here
          <div>Error content goes here</div>
        ) : success ? (
          // Render success content here
          <div>Success content goes here</div>
        ) : (
          // Render default content here if neither error nor success
          <div>Default content goes here</div>
        )}
      </main>
      {/* Other components or content */}
    </div>
  );
};

export default Dashboard;