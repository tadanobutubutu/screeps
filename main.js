// components/Dashboard.tsx
import React from 'react';

const Dashboard = ({ error, success }) => {
  return (
    <div>
      {error && <main>Error: {error.message}</main>}
      {success && <main>Success: {success.message}</main>}
      {!error && !success && (
        <main>
          <!-- Other content that should be in the main area of the page -->
        </main>
      )}
    </div>
  );
};

export default Dashboard;