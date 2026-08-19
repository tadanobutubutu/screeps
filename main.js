import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers';
import { DashboardData } from '../types/dashboard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    dispatch(fetchDashboardData());

    return () => {
      setIsMounted(false);
    };
  }, [dispatch]);

  if (loading) {
    return (
      <main className="dashboard-container">
        <section className="dashboard-loading">
          <LoadingSpinner />
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-container">
        <section className="dashboard-error">
          <ErrorMessage message={error} />
        </section>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="dashboard-container">
        <section className="dashboard-empty">
          <p>No data available</p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-container">
      <section className="dashboard-header">
        <h1>Dashboard</h1>
      </section>

      <article className="dashboard-content">
        <section className="dashboard-stats">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{data.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Active Sessions</h3>
              <p>{data.activeSessions}</p>
            </div>
          </div>
        </section>

        <section className="dashboard-recent-activity">
          <h2>Recent Activity</h2>
          <ul>
            {data.recentActivity.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </section>
      </article>

      <section className="dashboard-footer">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </section>
    </main>
  );
};

export default Dashboard;