import React from 'react';
import { useDashboard } from './hooks/useDashboard';

/**
 * Dashboard component with unique landmark compliance
 */
export const Dashboard = () => {
  const { data } = useDashboard();
  
  if (data.error) {
    return (
      <main>
        <h2>Error State</h2>
        <p>An error occurred while loading the dashboard.</p>
      </main>
    );
  }
  
  return (
    <section>
      <h1>Dashboard</h1>
      <div className="dashboard-content">
        <p>Welcome to the dashboard! This is the main content area.</p>
        {/* Additional dashboard components */}
      </div>
    </section>
  );
};

// Export other components as needed
export { Dashboard };