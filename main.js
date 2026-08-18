import React, { useState, useEffect } from 'react';
import { useState as useStateNew } from 'react';
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
  const [anotherState, setAnotherState] = useStateNew({});

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return (
      <main className="dashboard-container" aria-busy="true">
        <LoadingSpinner aria-label="Loading dashboard data" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-container" role="alert">
        <ErrorDisplay message={error} />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="dashboard-container">
        <div>No data available</div>
      </main>
    );
  }

  return (
    <main className="dashboard-container" lang="en">
      <div className="dashboard-header" role="banner">
        <h1 id="dashboard-heading">Dashboard</h1>
        <div className="dashboard-tabs" role="tablist" aria-label="Dashboard navigation">
          <button
            role="tab"
            aria-selected={activeTab === 'overview'}
            aria-controls="overview-tab"
            id="overview-tab-button"
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'analytics'}
            aria-controls="analytics-tab"
            id="analytics-tab-button"
            className={activeTab === 'analytics' ? 'active' : ''}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'actions'}
            aria-controls="actions-tab"
            id="actions-tab-button"
            className={activeTab === 'actions' ? 'active' : ''}
            onClick={() => setActiveTab('actions')}
          >
            Actions
          </button>
        </div>
      </div>

      <div className="dashboard-content" role="main" aria-labelledby="dashboard-heading">
        {activeTab === 'overview' && (
          <section className="dashboard-section" id="overview-tab" role="tabpanel" aria-labelledby="overview-tab-button">
            <DashboardStats data={data.stats} />
          </section>
        )}
        {activeTab === 'analytics' && (
          <section className="dashboard-section" id="analytics-tab" role="tabpanel" aria-labelledby="analytics-tab-button">
            <DashboardCharts data={data.charts} />
          </section>
        )}
        {activeTab === 'actions' && (
          <section className="dashboard-section" id="actions-tab" role="tabpanel" aria-labelledby="actions-tab-button">
            <DashboardActions data={data.actions} />
          </section>
        )}
      </div>
    </main>
  );
};