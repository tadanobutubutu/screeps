import React from 'react';
import { useFetchData } from './useFetchData';
import ErrorBoundary from './ErrorBoundary';
import SectionHeader from './SectionHeader';

const Dashboard = () => {
  const { data, isLoading, error } = useFetchData('/api/dashboard/data');

  return (
    <div>
      <SectionHeader text="Dashboard" />
      {error && (
        <ErrorBoundary>
          <main>Error: {error.message}</main>
        </ErrorBoundary>
      )}
      {isLoading && <main>Loading...</main>}
      {data && (
        <main>
          {/* Render the data here */}
          <h1>Dashboard Content</h1>
          {/* Other dashboard content */}
        </main>
      )}
    </div>
  );
};

export default Dashboard;