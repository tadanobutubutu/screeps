import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers';
import { DashboardData } from '../types/dashboardTypes';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const Dashboard: React.FC = () => {
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
        <ErrorMessage message={error} />
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
    <div className="dashboard-container">
      <main>
        <h1>Dashboard</h1>
        <section className="dashboard-stats">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Active Users</h3>
              <p>{dashboardData.activeUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p>${dashboardData.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </section>

        <section className="dashboard-recent-activity">
          <h2>Recent Activity</h2>
          <ul>
            {dashboardData.recentActivity.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;