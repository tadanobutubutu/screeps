import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../redux/actions/dashboardActions';
import { RootState } from '../redux/store';
import { DashboardData } from '../types/dashboardTypes';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import DashboardCard from './DashboardCard';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

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

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <nav className="dashboard-tabs">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={activeTab === 'analytics' ? 'active' : ''}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
      </header>

      <section className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="dashboard-overview">
            <DashboardCard title="Total Users" value={data?.totalUsers || 0} />
            <DashboardCard title="Active Sessions" value={data?.activeSessions || 0} />
            <DashboardCard title="System Status" value={data?.systemStatus || 'Unknown'} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="dashboard-analytics">
            <h2>Analytics Data</h2>
            <p>Detailed analytics information will be displayed here.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="dashboard-settings">
            <h2>Settings</h2>
            <p>Configuration options will be available here.</p>
          </div>
        )}
      </section>

      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} Dashboard App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;