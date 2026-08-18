import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers';
import { DashboardData } from '../types/dashboard';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { DashboardStats } from './DashboardStats';
import { DashboardCharts } from './DashboardCharts';
import { DashboardActions } from './DashboardActions';

interface DashboardProps {
  userId: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  const [activeTab, setActiveTab] = useState<'stats' | 'charts' | 'actions'>('stats');

  useEffect(() => {
    dispatch(fetchDashboardData(userId));
  }, [dispatch, userId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <section className="dashboard-error">
        <ErrorDisplay message={error} />
      </section>
    );
  }

  if (!data) {
    return (
      <section className="dashboard-empty">
        <p>No dashboard data available</p>
      </section>
    );
  }

  return (
    <section className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <nav className="dashboard-tabs">
          <button
            className={activeTab === 'stats' ? 'active' : ''}
            onClick={() => setActiveTab('stats')}
          >
            Stats
          </button>
          <button
            className={activeTab === 'charts' ? 'active' : ''}
            onClick={() => setActiveTab('charts')}
          >
            Charts
          </button>
          <button
            className={activeTab === 'actions' ? 'active' : ''}
            onClick={() => setActiveTab('actions')}
          >
            Actions
          </button>
        </nav>
      </header>

      <main className="dashboard-content">
        {activeTab === 'stats' && <DashboardStats data={data} />}
        {activeTab === 'charts' && <DashboardCharts data={data} />}
        {activeTab === 'actions' && <DashboardActions data={data} />}
      </main>
    </section>
  );
};