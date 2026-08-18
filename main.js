import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/dashboardSlice';
import { RootState } from '../store/store';
import { DashboardData } from '../types/dashboard';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setIsError(true);
    }
  }, [error]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <main>
        <h1>Error</h1>
        <p>Failed to load dashboard data. Please try again later.</p>
      </main>
    );
  }

  return (
    <section>
      <h1>Dashboard</h1>
      {data && (
        <div>
          <h2>Statistics</h2>
          <p>Total Users: {data.totalUsers}</p>
          <p>Active Sessions: {data.activeSessions}</p>
        </div>
      )}
    </section>
  );
};

export default Dashboard;