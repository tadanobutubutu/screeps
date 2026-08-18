import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers/rootReducer';
import { DashboardData } from '../types/dashboardTypes';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { DashboardStats } from './DashboardStats';
import { DashboardCharts } from './DashboardCharts';
import { DashboardActions } from './DashboardActions';

interface DashboardProps {
  // Add any props if needed
}

export const Dashboard: React.FC<DashboardProps> = () => {
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
        <ErrorDisplay message={error} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard-container">
        <div>No data available</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="dashboard-tabs">
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
              className={activeTab === 'actions' ? 'active' : ''}
              onClick={() => setActiveTab('actions')}
            >
              Actions
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <section className="dashboard-section">
              <DashboardStats data={data.stats} />
            </section>
          )}
          {activeTab === 'analytics' && (
            <section className="dashboard-section">
              <DashboardCharts data={data.charts} />
            </section>
          )}
          {activeTab === 'actions' && (
            <section className="dashboard-section">
              <DashboardActions data={data.actions} />
            </section>
          )}
        </div>
      </main>
    </div>
  );
};