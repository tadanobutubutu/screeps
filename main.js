// components/Dashboard.tsx
import React from 'react';

const Dashboard = ({ isError, data }) => {
  if (isError) {
    return (
      <main>
        <h1>Error</h1>
        <p>Something went wrong. Please try again later.</p>
      </main>
    );
  }

  return (
    <section>
      <h1>Dashboard</h1>
      {/* Your dashboard content here */}
      {data && (
        <div>
          {/* Render your data */}
        </div>
      )}
    </section>
  );
};

export default Dashboard;