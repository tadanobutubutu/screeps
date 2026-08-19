import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers';
import { DashboardData } from '../types/dashboardTypes';
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

  return (
    <main className="dashboard-container">
      {/* Main dashboard content */}
      <section className="dashboard-header">
        <h1>Dashboard</h1>
      </section>

      <section className="dashboard-content">
        {/* Render dashboard data */}
        <div className="data-section">
          <h2>Summary</h2>
          <p>Total items: {dashboardData.totalItems}</p>
        </div>

        <div className="data-section">
          <h2>Recent Activity</h2>
          {/* Render recent activity */}
        </div>
      </section>
    </main>
  );
};