// Combine the error state and success state main elements
import React from 'react';
import ErrorSection from './components/ErrorSection';
import DashboardContent from './components/DashboardContent';

const Dashboard = () => {
  const error = /* your error state logic */;

  if (error) {
    return (
      <div className="error-state">
        <ErrorSection error={error} />
      </div>
    );
  }

  return (
    <main>
      <DashboardContent />
    </main>
  );
};

export default Dashboard;