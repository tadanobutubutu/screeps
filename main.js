import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers';
import { DashboardData } from '../types/dashboard';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingSpinner } from './LoadingSpinner';

interface DashboardProps {
  // Add any props if needed
}

export const Dashboard: React.FC<DashboardProps> = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setDashboardData(data);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <ErrorDisplay message={error} />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="dashboard-container">
        <p>No data available</p>
      </div>
    );
  }

  // Wrap all content in a single main element
  return (
    <main className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="dashboard-content">
        {/* Render your dashboard content here */}
        <section className="stats-section">
          <h2>Statistics</h2>
          {/* Stats content */}
        </section>
        <section className="data-section">
          <h2>Data Overview</h2>
          {/* Data content */}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;