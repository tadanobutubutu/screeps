import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers';
import { DashboardData } from '../types/dashboard';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
        </header>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
        </header>
        <section className="error-state">
          <h2>Error</h2>
          <p>Failed to load dashboard data: {error}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      <main className="dashboard-content">
        <nav className="dashboard-tabs">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={activeTab === 'stats' ? 'active' : ''}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
          <button
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>

        {activeTab === 'overview' && (
          <section className="dashboard-overview">
            <h2>Overview</h2>
            {/* Overview content */}
          </section>
        )}

        {activeTab === 'stats' && (
          <section className="dashboard-stats">
            <h2>Statistics</h2>
            {/* Stats content */}
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="dashboard-settings">
            <h2>Settings</h2>
            {/* Settings content */}
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;