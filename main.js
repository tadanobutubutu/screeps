import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchDashboardData } from '../store/dashboardSlice';
import { DashboardData } from '../types/dashboard';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'settings'>('overview');

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading dashboard data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error loading dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="dashboard-container">
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
      </header>

      <section className="dashboard-content">
        {activeTab === 'overview' && (
          <article className="dashboard-overview">
            <h2>System Overview</h2>
            {/* Overview content */}
          </article>
        )}

        {activeTab === 'stats' && (
          <article className="dashboard-stats">
            <h2>Statistics</h2>
            {/* Stats content */}
          </article>
        )}

        {activeTab === 'settings' && (
          <article className="dashboard-settings">
            <h2>Settings</h2>
            {/* Settings content */}
          </article>
        )}
      </section>
    </main>
  );
};

export default Dashboard;