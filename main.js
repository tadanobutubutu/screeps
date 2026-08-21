import React, { useState } from 'react';
import CommonDashboard from './CommonDashboard';

const Dashboard = () => {
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = (refresh = false) => {
    // Fetch stats logic here
  };

  const copyErr = () => {
    // Copy error logic here
  };

  return (
    <>
      {error && <CommonDashboard errorMessage={error} />}
      {!error && !refreshing && <CommonDashboard successMessage="Success" />}
      {refreshing && <CommonDashboard refreshing={refreshing} />}
    </>
  );
};

export default Dashboard;